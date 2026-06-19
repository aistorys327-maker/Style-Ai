export type FaceShape = "Oval" | "Round" | "Square" | "Heart" | "Diamond" | "Oblong";

export type OptionMode = "Hair Only" | "Beard Only" | "Hair + Beard" | "Trending Styles";

export interface QualityReport {
  isClear: boolean;
  warning: string;
  lighting: string;
}

export interface AnalysisResult {
  faceShape: FaceShape;
  confidence: number;
  qualityReport: QualityReport;
  description: string;
  recommendedHairstyles: string[];
  recommendedBeards: string[];
  hairstylistAdvice: string;
}

export interface StyleOption {
  id: string;
  name: string;
  description: string;
  imageUrl?: string;
}

export interface GenerationHistoryItem {
  id: string;
  timestamp: number;
  originalImage: string; // base64 or URL
  editedImage: string;   // base64 or URL
  faceShapeResult?: AnalysisResult;
  selectedHair: string;
  selectedBeard: string;
  optionsMode: OptionMode;
}

export interface FavoriteStyle {
  id: string;
  type: "hair" | "beard";
  name: string;
  timestamp: number;
}

export interface FavoriteGeneration {
  id: string;
  historyId: string;
  originalImage: string;
  editedImage: string;
  selectedHair: string;
  selectedBeard: string;
  timestamp: number;
}

export interface AppSettings {
  apiKey: string;
  apiKeyStatus: "connected" | "invalid" | "expired" | "not_set";
  theme: "dark" | "light";
}
