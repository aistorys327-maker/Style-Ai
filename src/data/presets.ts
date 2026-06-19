import { AnalysisResult } from "../types";

export interface PresetModel {
  id: string;
  name: string;
  avatarUrl: string;
  editedUrl: string;
  gender: "Male" | "Female";
  faceShape: "Oval" | "Round" | "Square" | "Heart" | "Diamond" | "Oblong";
  selectedHair: string;
  selectedBeard: string;
  analysis: AnalysisResult;
}

export const PRESET_MODELS: PresetModel[] = [
  {
    id: "leo",
    name: "Benjamin (Oval Face)",
    gender: "Male",
    avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=500&h=500&q=80",
    editedUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=500&h=500&q=80",
    faceShape: "Oval",
    selectedHair: "Undercut",
    selectedBeard: "Short Beard",
    analysis: {
      faceShape: "Oval",
      confidence: 96,
      qualityReport: {
        isClear: true,
        warning: "None: Excellent lighting and facial geometry display.",
        lighting: "Good"
      },
      description: "Classically symmetrical vertical proportions with slightly tapered chin. Broad temples and highly proportional features.",
      recommendedHairstyles: ["Side Part", "Undercut", "Pompadour", "Fade", "Quiff"],
      recommendedBeards: ["Short Beard", "Stubble", "Clean Shave"],
      hairstylistAdvice: "With an oval outline, almost any hairstyle will look great on you. A disconnected undercut with a short beard maximizes your masculine focus."
    }
  },
  {
    id: "marcus",
    name: "Marcus (Square Face)",
    gender: "Male",
    avatarUrl: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=500&h=500&q=80",
    editedUrl: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=500&h=500&q=80",
    faceShape: "Square",
    selectedHair: "Fade",
    selectedBeard: "Stubble",
    analysis: {
      faceShape: "Square",
      confidence: 94,
      qualityReport: {
        isClear: true,
        warning: "None: Sharp facial angle capture and clean exposure.",
        lighting: "Good"
      },
      description: "Strong, wide forehead paired with a prominent, flat-angled, robust jawline and flat cheek alignment.",
      recommendedHairstyles: ["Fade", "Buzz Cut", "Side Part", "Curly Styles", "Undercut"],
      recommendedBeards: ["Stubble", "Goatee", "Short Beard"],
      hairstylistAdvice: "Your natural jawline is highly striking. A neat high fade matches the angular jaw structure, while light stubble adds a subtle textured shadow."
    }
  },
  {
    id: "jin",
    name: "Kenji (Round Face)",
    gender: "Male",
    avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=500&h=500&q=80",
    editedUrl: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=500&h=500&q=80",
    faceShape: "Round",
    selectedHair: "Pompadour",
    selectedBeard: "Boxed Beard",
    analysis: {
      faceShape: "Round",
      confidence: 91,
      qualityReport: {
        isClear: true,
        warning: "None: Highly even brightness across all facial features.",
        lighting: "Good"
      },
      description: "Generous chin rounding, soft facial contours, and circular cheek configurations where height and width are nearly equal.",
      recommendedHairstyles: ["Quiff", "Pompadour", "Undercut", "Fade"],
      recommendedBeards: ["Boxed Beard", "Goatee", "Van Dyke", "Full Beard"],
      hairstylistAdvice: "We want to add visual height and structured angles to your face. A tall pompadour paired with a sharp boxed beard breaks the circular profile cleanly."
    }
  },
  {
    id: "elena",
    name: "Chloe (Diamond Face)",
    gender: "Female",
    avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=500&h=500&q=80",
    editedUrl: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=500&h=500&q=80",
    faceShape: "Diamond",
    selectedHair: "Textured Crop",
    selectedBeard: "Clean Shave",
    analysis: {
      faceShape: "Diamond",
      confidence: 89,
      qualityReport: {
        isClear: true,
        warning: "None: Bright directional lighting emphasizing features.",
        lighting: "Good"
      },
      description: "Narrow forehead tapering into high, prominent pointed cheekbones and a narrow pointed chin profile.",
      recommendedHairstyles: ["Textured Crop", "Medium Styles", "Long Styles", "Curly Styles", "Side Part"],
      recommendedBeards: ["Clean Shave", "Stubble"],
      hairstylistAdvice: "A diamond face possesses stunning high cheekbones. Keep the hair sides swept or crop-textured to frame the forehead, keeping hair or beard clean."
    }
  }
];
