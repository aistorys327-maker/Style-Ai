import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

// Increase payload limit to support base64 image uploads
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

// Shared utility in server to initialize Gemini client safely
function getGeminiClient(clientApiKey?: string) {
  const key = clientApiKey || process.env.GEMINI_API_KEY;
  if (!key) {
    throw new Error("Gemini API key is required. Please set it up in the app or environment.");
  }
  return new GoogleGenAI({
    apiKey: key,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

// 1. API: Validate Gemini API Key
app.post("/api/gemini/validate", async (req, res) => {
  try {
    const { apiKey } = req.body;
    if (!apiKey) {
      return res.status(400).json({ error: "No API key supplied" });
    }
    const ai = getGeminiClient(apiKey);
    
    // Perform simple validation request
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: "Respond with only one word: OK",
    });

    if (response && response.text) {
      return res.json({ status: "connected" });
    } else {
      return res.status(400).json({ status: "invalid", error: "Empty response from Gemini API" });
    }
  } catch (error: any) {
    console.error("Gemini Validation Error:", error);
    const msg = error.message || String(error);
    if (msg.includes("API_KEY_INVALID") || msg.includes("invalid api key") || msg.includes("Key not found")) {
      return res.status(400).json({ status: "invalid", error: "Invalid Key: Checked against the official Gemini server." });
    } else if (msg.includes("quota") || msg.includes("limited")) {
      return res.status(400).json({ status: "expired", error: "Quota Exceeded or Key Expired." });
    }
    return res.status(500).json({ status: "error", error: msg });
  }
});

// 2. API: Detect Face Shape
app.post("/api/gemini/analyze-face", async (req, res) => {
  try {
    const { image, apiKey } = req.body;
    if (!image) {
      return res.status(400).json({ error: "Image is required for analysis." });
    }

    const ai = getGeminiClient(apiKey);

    // Extract base64 image data
    let mimeType = "image/jpeg";
    let base64Data = image;
    
    if (image.startsWith("data:")) {
      const match = image.match(/^data:([^;]+);base64,(.+)$/);
      if (match) {
        mimeType = match[1];
        base64Data = match[2];
      }
    }

    const imagePart = {
      inlineData: {
        mimeType: mimeType,
        data: base64Data,
      },
    };

    const promptText = `
      You are a premium, professional AI hairstylist and beard consultant.
      Analyze the user's uploaded portrait image.
      Determine their precise Face Shape. The shape must be exactly one of the following standard shapes: Oval, Round, Square, Heart, Diamond, or Oblong.
      Additionally, evaluate picture quality. Highlight if the photo is blurry, has bad lighting, or is too close/far.
      
      Output your response STRICTLY as a JSON object with the following structure:
      {
        "faceShape": "Oval" | "Round" | "Square" | "Heart" | "Diamond" | "Oblong",
        "confidence": 0-100,
        "qualityReport": {
          "isClear": boolean,
          "warning": "None" or detailed warning message about blurriness, resolution, etc.,
          "lighting": "Good" | "Dim" | "Overexposed"
        },
        "description": "Short analysis of their facial structure (e.g. prominent cheekbones, jawline characteristics).",
        "recommendedHairstyles": ["Fade", "Pompadour", ...],
        "recommendedBeards": ["Stubble", "Full Beard", ...],
        "hairstylistAdvice": "A professional 2-3 sentence stylist suggestion for making the most of this face shape."
      }
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: {
        parts: [imagePart, { text: promptText }]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            faceShape: { type: Type.STRING, description: "Must be Oval, Round, Square, Heart, Diamond, or Oblong." },
            confidence: { type: Type.INTEGER, description: "An integer confidence percentage from 0 to 100." },
            qualityReport: {
              type: Type.OBJECT,
              properties: {
                isClear: { type: Type.BOOLEAN },
                warning: { type: Type.STRING },
                lighting: { type: Type.STRING }
              },
              required: ["isClear", "warning", "lighting"]
            },
            description: { type: Type.STRING },
            recommendedHairstyles: { type: Type.ARRAY, items: { type: Type.STRING } },
            recommendedBeards: { type: Type.ARRAY, items: { type: Type.STRING } },
            hairstylistAdvice: { type: Type.STRING }
          },
          required: ["faceShape", "confidence", "qualityReport", "description", "recommendedHairstyles", "recommendedBeards", "hairstylistAdvice"]
        }
      }
    });

    const resultText = response.text;
    if (!resultText) {
      throw new Error("Failed to receive a response from face shape analyzer.");
    }

    return res.json(JSON.parse(resultText.trim()));
  } catch (error: any) {
    console.error("Analyze Face Error:", error);
    return res.status(500).json({ error: error.message || String(error) });
  }
});

// 3. API: Generate Realistic Look (AI Hairstyle & Beard Placement)
app.post("/api/gemini/generate-look", async (req, res) => {
  try {
    const { image, hairstyle, beard, optionsMode, apiKey } = req.body;
    if (!image) {
      return res.status(400).json({ error: "Original face image is required." });
    }

    const ai = getGeminiClient(apiKey);

    // Extract base64 image data
    let mimeType = "image/jpeg";
    let base64Data = image;
    
    if (image.startsWith("data:")) {
      const match = image.match(/^data:([^;]+);base64,(.+)$/);
      if (match) {
        mimeType = match[1];
        base64Data = match[2];
      }
    }

    const imagePart = {
      inlineData: {
        mimeType: mimeType,
        data: base64Data,
      },
    };

    // Construct precise prompt following guidelines:
    // Change ONLY the hairstyle or beard while keeping face identity, skin tone, features, background, expression, lighting.
    const editPrompt = `
      You are an expert AI image editor. Modify the hairstyle and/or beard of the person in the attached portrait image according to these parameters:
      - Requested Hairstyle: ${optionsMode === "Beard Only" ? "Keep original hair" : hairstyle}
      - Requested Beard Style: ${optionsMode === "Hair Only" ? "Keep original facial hair / clean shaven if they had none" : beard}
      
      STRICT CONSTRAINTS (CRITICAL FOR SUCCESS):
      1. Keep the identical face identity, skin tone, facial features, age, and identical facial expression.
      2. Keep the identical camera angle, background, and lighting conditions.
      3. Change ONLY the hairstyle and/or beard.
      4. Make the hair and beard look completely realistic, blended organically, with native photorealistic styling. Avoid plastic, game-like, or overly smooth AI-drawn textures. High fidelity human hair/beard texture is required.
      5. Deliver the modified portrait photo directly.
    `;

    // We use gemini-2.5-flash-image to generate/edit the content
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-image",
      contents: {
        parts: [imagePart, { text: editPrompt }]
      },
      config: {
        imageConfig: {
          aspectRatio: "1:1"
        }
      }
    });

    // Scan parts to find the image part as specified in skill instructions
    let base64Result: string | null = null;
    let descriptionText = "";

    if (response.candidates && response.candidates[0]?.content?.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          base64Result = part.inlineData.data;
        } else if (part.text) {
          descriptionText += part.text;
        }
      }
    }

    // If we didn't get an image result directly (e.g. if key is not paid, or image generation isn't enabled on the model version)
    // We will raise an error that the frontend can gracefully catch
    if (!base64Result) {
      throw new Error("Gemini Image generation did not return a modified binary image part. Note: Generating customized high-quality portraits can require specific model configurations or a paid API tier.");
    }

    return res.json({
      imageUrl: `data:image/png;base64,${base64Result}`,
      notes: descriptionText || "Style generated successfully."
    });
  } catch (error: any) {
    console.error("Generate Look Error:", error);
    return res.status(500).json({ error: error.message || String(error) });
  }
});

// Configure Vite middleware and static serving
async function setupServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`StyleAI full-stack server running on http://localhost:${PORT}`);
  });
}

setupServer();
