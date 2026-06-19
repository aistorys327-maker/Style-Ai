import React, { useState, useRef, useEffect } from "react";
import { Upload, Camera, Sparkles, AlertTriangle, ShieldCheck, Sun, Check, Users, RefreshCw, Scissors, UserPlus } from "lucide-react";
import { HAIR_STYLES, BEARD_STYLES } from "../data/styles";
import { PRESET_MODELS, PresetModel } from "../data/presets";
import { OptionMode, FaceShape, AnalysisResult } from "../types";

interface HomeViewProps {
  apiKey: string;
  apiKeyStatus: string;
  onAnalyzeFace: (image: string, isPreset: boolean, presetData?: AnalysisResult) => void;
  onGenerateLook: (image: string, hair: string, beard: string, optionMode: OptionMode, isPreset: boolean, presetEditedUrl?: string, presetData?: AnalysisResult) => void;
  isProcessing: boolean;
  onOpenSetupKey: () => void;
}

export default function HomeView({
  apiKey,
  apiKeyStatus,
  onAnalyzeFace,
  onGenerateLook,
  isProcessing,
  onOpenSetupKey
}: HomeViewProps) {
  // Image states
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isPreset, setIsPreset] = useState<boolean>(false);
  const [activePreset, setActivePreset] = useState<PresetModel | null>(null);
  const [dragActive, setDragActive] = useState(false);

  // Quality checks
  const [qualityWarning, setQualityWarning] = useState<string | null>(null);
  const [qualityGrade, setQualityGrade] = useState<{ isClear: boolean; warning: string; lighting: string } | null>(null);

  // Style customization choices
  const [optionMode, setOptionMode] = useState<OptionMode>("Hair + Beard");
  const [selectedHair, setSelectedHair] = useState<string>("Fade");
  const [selectedBeard, setSelectedBeard] = useState<string>("Stubble");

  // Camera capture systems
  const [showCamera, setShowCamera] = useState(false);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Trigger quality analyzer when original changes
  const runQualityAnalyzer = (base64Image: string) => {
    // Basic heuristics for demo purposes:
    // If it's a huge file, check if it's too big, or check loading properties
    const img = new Image();
    img.onload = () => {
      const isLowRes = img.width < 350 || img.height < 350;
      const isImbalanced = img.width / img.height > 1.4 || img.height / img.width > 1.4;
      
      const grade = {
        isClear: !isLowRes,
        warning: isLowRes 
          ? "Blur Warning: Image resolution is quite low. For premium results, provide a crisp high-resolution portrait."
          : isImbalanced 
          ? "Portrait Tip: Ensure face is centered. Off-center camera angles may affect hair placement accuracy."
          : "None",
        lighting: "Good"
      };

      setQualityGrade(grade);
      if (isLowRes || isImbalanced) {
        setQualityWarning(grade.warning);
      } else {
        setQualityWarning(null);
      }
    };
    img.src = base64Image;
  };

  // Preset loading handler
  const handleSelectPreset = (preset: PresetModel) => {
    setSelectedImage(preset.avatarUrl);
    setIsPreset(true);
    setActivePreset(preset);
    setSelectedHair(preset.selectedHair);
    setSelectedBeard(preset.selectedBeard);
    setQualityWarning(null);
    setQualityGrade({
      isClear: true,
      warning: "None",
      lighting: "Good"
    });
  };

  // Upload handlers
  const processFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      alert("Please upload a valid image file.");
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result && typeof e.target.result === "string") {
        setSelectedImage(e.target.result);
        setIsPreset(false);
        setActivePreset(null);
        runQualityAnalyzer(e.target.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  // Camera captures handlers
  const startCamera = async () => {
    setShowCamera(true);
    setCameraError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: { ideal: 640 }, height: { ideal: 640 } },
        audio: false,
      });
      setCameraStream(stream);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err: any) {
      console.error("Camera Access Error:", err);
      setCameraError("Could not access webcam. Please check settings, permissions, or drag-and-drop a portrait instead.");
    }
  };

  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach((track) => track.stop());
    }
    setCameraStream(null);
    setShowCamera(false);
  };

  const captureSnapshot = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement("canvas");
    canvas.width = 640;
    canvas.height = 640;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      // Mirror horizontal since user camera is facing front
      ctx.translate(640, 0);
      ctx.scale(-1, 1);
      ctx.drawImage(videoRef.current, 0, 0, 640, 640);
      
      const dataUrl = canvas.toDataURL("image/jpeg", 0.9);
      setSelectedImage(dataUrl);
      setIsPreset(false);
      setActivePreset(null);
      runQualityAnalyzer(dataUrl);
    }
    stopCamera();
  };

  // Direct triggering callbacks
  const handleDetectFace = () => {
    if (!selectedImage) return;
    if (isPreset && activePreset) {
      // Direct pass with preset pre-analysis
      onAnalyzeFace(selectedImage, true, activePreset.analysis);
    } else {
      onAnalyzeFace(selectedImage, false);
    }
  };

  const handleGenerateMakeover = () => {
    if (!selectedImage) return;
    const curHair = optionMode === "Beard Only" ? "Original" : selectedHair;
    const curBeard = optionMode === "Hair Only" ? "Clean Shave" : selectedBeard;

    if (isPreset && activePreset) {
      // If the parameters match the preset definition exactly, we can use the preloaded gorgeous portrait
      const isDefaultPresetSelection = 
        curHair === activePreset.selectedHair && 
        curBeard === activePreset.selectedBeard;
      
      onGenerateLook(
        selectedImage,
        curHair,
        curBeard,
        optionMode,
        true,
        isDefaultPresetSelection ? activePreset.editedUrl : undefined,
        activePreset.analysis
      );
    } else {
      onGenerateLook(selectedImage, curHair, curBeard, optionMode, false);
    }
  };

  // Filter styles list based on mode
  const filteredHair = HAIR_STYLES;
  const filteredBeard = BEARD_STYLES;

  return (
    <div className="space-y-6 pb-28">
      {/* Radiant Glow overlays */}
      <div className="bg-mesh-glow top-20 right-10" />
      <div className="bg-mesh-glow-secondary top-80 left-10" />

      {/* Hero Welcome banner */}
      <div className="relative text-center max-w-lg mx-auto space-y-2 pt-4">
        <h2 className="text-2xl font-extrabold tracking-tight font-display text-neutral-900 dark:text-white sm:text-3xl">
          Virtual Styling Studio
        </h2>
        <p className="text-xs text-neutral-500 dark:text-neutral-400">
          Upload your selfie or try our professional model presets to detect your face shape and preview custom hairstyle modifications instantly.
        </p>
      </div>

      {/* QUICK PRESET MODELS */}
      <div className="space-y-3 relative z-10 max-w-xl mx-auto">
        <div className="flex items-center justify-between px-1">
          <span className="text-xs font-bold text-neutral-800 dark:text-neutral-200 flex items-center space-x-1.5 uppercase tracking-wide">
            <Users className="w-4 h-4 text-sky-500" />
            <span>Select Test Preset Profile</span>
          </span>
          <span className="text-[10px] text-sky-600 dark:text-sky-400 font-medium">
            Tap to instant load
          </span>
        </div>
        
        <div className="grid grid-cols-4 gap-2">
          {PRESET_MODELS.map((preset) => {
            const isCurrent = activePreset?.id === preset.id;
            return (
              <button
                key={preset.id}
                onClick={() => handleSelectPreset(preset)}
                className={`flex flex-col items-center space-y-1.5 p-1.5 rounded-2xl border transition-all cursor-pointer ${
                  isCurrent
                    ? "bg-sky-50 dark:bg-sky-950/40 border-sky-500/80 ring-2 ring-sky-500/20"
                    : "bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700"
                }`}
              >
                <div className="relative w-12 h-12 rounded-xl overflow-hidden shadow-inner border border-neutral-200/50 dark:border-neutral-800">
                  <img
                    src={preset.avatarUrl}
                    alt={preset.name}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  {isCurrent && (
                    <div className="absolute inset-0 bg-sky-500/20 flex items-center justify-center">
                      <div className="bg-white dark:bg-neutral-900 p-0.5 rounded-full">
                        <Check className="w-3 h-3 text-sky-600 dark:text-sky-400 font-bold" />
                      </div>
                    </div>
                  )}
                </div>
                <span className="text-[10px] font-semibold text-neutral-700 dark:text-neutral-300 truncate max-w-full leading-none">
                  {preset.name.split(" ")[0]}
                </span>
                <span className="text-[8px] text-neutral-400 font-mono tracking-wider leading-none">
                  {preset.faceShape}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* MAIN UPLOAD / CAPTURE CONTAINER */}
      <div className="max-w-xl mx-auto">
        <div
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          className={`relative border-2 border-dashed rounded-3xl p-6 transition-all ${
            dragActive
              ? "border-sky-500 bg-sky-50/50 dark:bg-sky-950/10"
              : selectedImage
              ? "border-neutral-200 dark:border-neutral-800/80 bg-white/75 dark:bg-neutral-900/60 backdrop-blur-md"
              : "border-neutral-300 dark:border-neutral-800/50 hover:border-sky-400 bg-neutral-50/50 dark:bg-neutral-950/20"
          }`}
        >
          {selectedImage ? (
            <div className="flex flex-col sm:flex-row items-center gap-6">
              {/* Photo Preview Card */}
              <div className="relative w-36 h-36 rounded-2xl overflow-hidden shadow-lg shrink-0 border border-neutral-200 dark:border-neutral-800 bg-neutral-100">
                <img
                  src={selectedImage}
                  alt="Portrait Preview"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                
                {/* Overlay Source tag */}
                <span className="absolute bottom-2 left-2 bg-black/75 text-[9px] font-mono tracking-widest text-sky-400 py-0.5 px-1.5 rounded-md uppercase font-semibold">
                  {isPreset ? "PRESET" : "UPLOAD"}
                </span>
              </div>

              {/* Warnings and Quick Controls */}
              <div className="space-y-2.5 w-full text-center sm:text-left">
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-neutral-800 dark:text-white">
                    {isPreset ? `Analyzing: ${activePreset?.name}` : "Selfie Portrait Loaded"}
                  </h4>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">
                    {isPreset 
                      ? "High-fidelity professional portrait setup preloaded." 
                      : "Ready to inspect face shape structure and style overlays."}
                  </p>
                </div>

                {/* Quality warning outputs */}
                {qualityWarning ? (
                  <div className="inline-flex items-start text-xs text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/20 p-2 rounded-xl border border-amber-200/50 text-left">
                    <AlertTriangle className="w-4 h-4 shrink-0 mr-2 mt-0.5" />
                    <span className="text-[11px] leading-tight">{qualityWarning}</span>
                  </div>
                ) : (
                  <div className="inline-flex items-center text-[11px] text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-950/10 py-1.5 px-2.5 rounded-xl border border-green-200/30">
                    <ShieldCheck className="w-3.5 h-3.5 mr-1.5" />
                    <span>Portrait Quality Rating: Optimal</span>
                  </div>
                )}

                {/* Choice Actions */}
                <div className="flex flex-wrap gap-2 pt-1 justify-center sm:justify-start">
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="px-3 py-1.5 text-[11px] font-semibold text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-sky-950/40 hover:bg-sky-100 rounded-xl transition-colors cursor-pointer"
                  >
                    Change Picture
                  </button>
                  <button
                    onClick={startCamera}
                    className="px-3 py-1.5 text-[11px] font-semibold text-neutral-600 dark:text-neutral-400 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded-xl transition-colors flex items-center space-x-1 cursor-pointer"
                  >
                    <Camera className="w-3.5 h-3.5" />
                    <span>Retake Camera</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            // Empty Upload Hub
            <div className="py-8 flex flex-col items-center justify-center text-center space-y-4 font-sans">
              <div
                className="w-16 h-16 rounded-full bg-sky-50 dark:bg-sky-950/80 flex items-center justify-center text-sky-500 cursor-pointer"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="w-7 h-7" />
              </div>

              <div className="space-y-1">
                <p className="text-sm font-bold text-neutral-800 dark:text-neutral-200">
                  Drag and Drop details or Click to upload
                </p>
                <p className="text-xs text-neutral-400">
                  Supports JPEG, PNG format up to 10MB (Single Image portrait)
                </p>
              </div>

              <div className="flex items-center space-x-3 pt-2">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="bg-sky-600 hover:bg-sky-500 active:bg-sky-700 text-white text-xs font-semibold py-2.5 px-4 rounded-xl shadow-md transition-colors cursor-pointer"
                >
                  Browse Device Photo
                </button>
                <span className="text-xs text-neutral-400 dark:text-neutral-500">or</span>
                <button
                  onClick={startCamera}
                  className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-950 text-neutral-700 dark:text-neutral-300 text-xs font-semibold py-2.5 px-4 rounded-xl transition-colors flex items-center space-x-1.5 cursor-pointer"
                >
                  <Camera className="w-4 h-4" />
                  <span>Open Camera</span>
                </button>
              </div>
            </div>
          )}

          {/* Hidden raw file inputs */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileInputChange}
            accept="image/*"
            className="hidden"
          />
        </div>
      </div>

      {/* STYLE CUSTOMIZATION SELECTOR CARDS */}
      {selectedImage && (
        <div className="max-w-xl mx-auto bg-white/50 dark:bg-neutral-900/40 backdrop-blur-md rounded-3xl p-5 border border-neutral-200/60 dark:border-neutral-800/60 space-y-5">
          {/* Options mode selection */}
          <div className="space-y-2.5">
            <span className="text-xs font-bold text-neutral-800 dark:text-neutral-200 uppercase tracking-widest pl-1">
              Select Customizer Focus
            </span>
            <div className="grid grid-cols-4 gap-1.5 bg-neutral-100 dark:bg-neutral-950 p-1 rounded-2xl">
              {(["Hair + Beard", "Hair Only", "Beard Only", "Trending Styles"] as OptionMode[]).map((mode) => (
                <button
                  key={mode}
                  onClick={() => setOptionMode(mode)}
                  className={`py-2 text-[10px] font-bold rounded-xl transition-all capitalize cursor-pointer ${
                    optionMode === mode
                      ? "bg-white dark:bg-neutral-900 text-sky-600 dark:text-sky-400 shadow-sm"
                      : "text-neutral-500 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200"
                  }`}
                >
                  {mode.replace(" Styles", "")}
                </button>
              ))}
            </div>
          </div>

          {/* HAIRSTYLE LISTING */}
          {optionMode !== "Beard Only" && (
            <div className="space-y-2.5">
              <div className="flex items-center justify-between px-1">
                <span className="text-xs font-bold text-neutral-800 dark:text-neutral-300 flex items-center space-x-1">
                  <Scissors className="w-3.5 h-3.5 text-sky-500" />
                  <span>Hairstyle Option</span>
                </span>
                <span className="text-[10px] font-mono font-medium text-sky-600 dark:text-sky-400">
                  {selectedHair}
                </span>
              </div>
              <div className="flex gap-2 overflow-x-auto pb-1.5 no-scrollbar scroll-smooth snap-x">
                {filteredHair.map((style) => {
                  const isCur = selectedHair === style.name;
                  return (
                    <button
                      key={style.id}
                      onClick={() => setSelectedHair(style.name)}
                      className={`min-w-[130px] p-2.5 rounded-2xl border text-left cursor-pointer transition-all snap-start ${
                        isCur
                          ? "bg-sky-500/10 border-sky-500 dark:bg-sky-950/20"
                          : "bg-white dark:bg-neutral-950 border-neutral-200 dark:border-neutral-900 hover:border-neutral-300 dark:hover:border-neutral-800"
                      }`}
                    >
                      <p className={`text-xs font-bold leading-tight ${isCur ? "text-sky-600 dark:text-sky-400" : "text-neutral-800 dark:text-neutral-200"}`}>
                        {style.name}
                      </p>
                      <p className="text-[9px] text-neutral-400 dark:text-neutral-500 mt-1 line-clamp-2 leading-relaxed">
                        {style.description}
                      </p>
                      <span className="inline-block px-1.5 py-0.5 mt-2 bg-neutral-100 dark:bg-neutral-900 rounded text-[8px] font-mono text-neutral-500 dark:text-neutral-400 leading-none">
                        {style.intensity}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* BEARD STYLE LISTING */}
          {optionMode !== "Hair Only" && (
            <div className="space-y-2.5">
              <div className="flex items-center justify-between px-1">
                <span className="text-xs font-bold text-neutral-800 dark:text-neutral-300 flex items-center space-x-1">
                  <UserPlus className="w-3.5 h-3.5 text-sky-500" />
                  <span>Beard Style Option</span>
                </span>
                <span className="text-[10px] font-mono font-medium text-sky-600 dark:text-sky-400">
                  {selectedBeard}
                </span>
              </div>
              <div className="flex gap-2 overflow-x-auto pb-1.5 no-scrollbar scroll-smooth snap-x">
                {filteredBeard.map((style) => {
                  const isCur = selectedBeard === style.name;
                  return (
                    <button
                      key={style.id}
                      onClick={() => setSelectedBeard(style.name)}
                      className={`min-w-[130px] p-2.5 rounded-2xl border text-left cursor-pointer transition-all snap-start ${
                        isCur
                          ? "bg-sky-500/10 border-sky-500 dark:bg-sky-950/20"
                          : "bg-white dark:bg-neutral-950 border-neutral-200 dark:border-neutral-900 hover:border-neutral-300 dark:hover:border-neutral-800"
                      }`}
                    >
                      <p className={`text-xs font-bold leading-tight ${isCur ? "text-sky-600 dark:text-sky-400" : "text-neutral-800 dark:text-neutral-200"}`}>
                        {style.name}
                      </p>
                      <p className="text-[9px] text-neutral-400 dark:text-neutral-500 mt-1 line-clamp-2 leading-relaxed">
                        {style.description}
                      </p>
                      <span className="inline-block px-1.5 py-0.5 mt-2 bg-neutral-100 dark:bg-neutral-900 rounded text-[8px] font-mono text-neutral-500 dark:text-neutral-400 leading-none">
                        {style.intensity}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* MAIN PROMPT CTA OPTIONS */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <button
              onClick={handleDetectFace}
              disabled={isProcessing}
              className="py-3 px-4 bg-white dark:bg-neutral-950 hover:bg-neutral-50 dark:hover:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-sky-600 dark:text-sky-400 font-bold text-xs rounded-2xl flex items-center justify-center space-x-1.5 cursor-pointer shadow-sm active:scale-95 transition-all"
            >
              <Sparkles className="w-4 h-4" />
              <span>Detect Face Shape</span>
            </button>
            
            <button
              onClick={handleGenerateMakeover}
              disabled={isProcessing}
              className="py-3 px-4 bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 text-white font-bold text-xs rounded-2xl flex items-center justify-center space-x-1.5 cursor-pointer shadow-md shadow-sky-500/10 active:scale-95 transition-all"
            >
              <Sparkles className="w-4 h-4 text-yellow-300" />
              <span>Generate Beautiful Look</span>
            </button>
          </div>
        </div>
      )}

      {/* WEBCAM CAMERA MODAL */}
      {showCamera && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="max-w-md w-full bg-white dark:bg-neutral-900 rounded-3xl overflow-hidden p-6 space-y-6 shadow-2xl">
            <div className="text-center space-y-1">
              <h3 className="text-lg font-bold text-neutral-900 dark:text-white">
                Portrait Camera Capture
              </h3>
              <p className="text-xs text-neutral-400">
                Face directly forward. Ensure even good lighting.
              </p>
            </div>

            {/* Video feedback block */}
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-black border border-neutral-200 dark:border-neutral-800 shadow-inner flex items-center justify-center">
              {cameraError ? (
                <div className="p-4 text-center text-xs text-rose-500">
                  <AlertTriangle className="w-8 h-8 mx-auto mb-2 text-rose-400" />
                  <span>{cameraError}</span>
                </div>
              ) : (
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  className="w-full h-full object-cover scale-x-[-1]" // mirror for normal front capture
                />
              )}
            </div>

            {/* Captures action bars */}
            <div className="flex items-center justify-between gap-3 pt-2">
              <button
                type="button"
                onClick={stopCamera}
                className="w-1/2 py-2.5 bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-800 dark:text-neutral-200 font-bold text-xs rounded-xl cursor-pointer transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={captureSnapshot}
                disabled={!!cameraError}
                className="w-1/2 py-2.5 bg-sky-600 hover:bg-sky-500 disabled:opacity-40 text-white font-bold text-xs rounded-xl cursor-pointer shadow-md transition-colors"
              >
                Take Snapshot
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
