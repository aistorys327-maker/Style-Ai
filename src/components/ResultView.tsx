import React, { useState } from "react";
import { ArrowLeft, Download, Share2, Heart, RotateCcw, Check, Sparkles, Scissors, Smile } from "lucide-react";
import BeforeAfterSlider from "./BeforeAfterSlider";
import { AnalysisResult, OptionMode } from "../types";

interface ResultViewProps {
  originalImage: string;
  editedImage: string;
  selectedHair: string;
  selectedBeard: string;
  optionsMode: OptionMode;
  faceShapeResult?: AnalysisResult;

  isFavorited: boolean;
  onToggleFavorite: () => void;
  onBackToStudio: () => void;
}

export default function ResultView({
  originalImage,
  editedImage,
  selectedHair,
  selectedBeard,
  optionsMode,
  faceShapeResult,
  isFavorited,
  onToggleFavorite,
  onBackToStudio,
}: ResultViewProps) {
  const [shareSuccess, setShareSuccess] = useState(false);

  // Download logic (Trigger client side helper)
  const handleDownload = () => {
    try {
      const link = document.createElement("a");
      link.href = editedImage;
      const sanitizedHair = selectedHair.toLowerCase().replace(/\s+/g, "_");
      const sanitizedBeard = selectedBeard.toLowerCase().replace(/\s+/g, "_");
      link.download = `StyleAI_${sanitizedHair}_and_${sanitizedBeard}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (e) {
      console.error("Download Error:", e);
      alert("Failed to trigger automatic download. You can still right-click or long-press the edited photo to save it.");
    }
  };

  // Share logic (Web Share API)
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "My StyleAI Makeover",
          text: `Check out my new AI-recommended ${selectedHair} hairstyle & ${selectedBeard} beard!`,
          url: window.location.href,
        });
      } catch (err) {
        console.log("User cancelled share or shared API blocked:", err);
      }
    } else {
      // Fallback: Clipboard text layout
      try {
        await navigator.clipboard.writeText(
          `StyleAI Makeover! 💇‍♂️\nMy recommended Face Shape is: ${
            faceShapeResult?.faceShape || "Detected"
          }\nI styled a new look with "${selectedHair}" hair and "${selectedBeard}" beard.\nCheck your own styling on StyleAI!`
        );
        setShareSuccess(true);
        setTimeout(() => setShareSuccess(false), 2000);
      } catch (err) {
        alert("Deep-link info saved to console!");
      }
    }
  };

  return (
    <div id="result-view-container" className="space-y-6 pb-28 max-w-xl mx-auto">
      {/* Visual Navigation header */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBackToStudio}
          className="inline-flex items-center space-x-1.5 text-xs font-semibold text-neutral-600 dark:text-neutral-400 hover:text-sky-500 cursor-pointer transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Studio</span>
        </button>

        <div className="flex items-center space-x-2">
          {/* Favorite heart toggle button */}
          <button
            onClick={onToggleFavorite}
            className={`p-2 rounded-xl border transition-all cursor-pointer ${
              isFavorited
                ? "bg-rose-50 border-rose-200 text-rose-500 dark:bg-rose-950/20 dark:border-rose-900"
                : "bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 text-neutral-400 dark:text-neutral-500 hover:text-rose-500"
            }`}
            title={isFavorited ? "Remove from favorites" : "Save to favorites"}
          >
            <Heart className={`w-4 h-4 ${isFavorited ? "fill-rose-500" : ""}`} />
          </button>

          {/* Share button */}
          <button
            onClick={handleShare}
            className="p-2 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 hover:bg-neutral-50 dark:hover:bg-neutral-950 text-neutral-600 dark:text-neutral-300 cursor-pointer transition-colors relative"
          >
            {shareSuccess ? (
              <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-neutral-900 text-white text-[9px] py-1 px-2 rounded-lg pointer-events-none whitespace-nowrap">
                Copied Message!
              </span>
            ) : null}
            <Share2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* BEFORE / AFTER SLIDER WIDGET */}
      <div className="space-y-2">
        <BeforeAfterSlider beforeImg={originalImage} afterImg={editedImage} />
        <p className="text-center text-[10px] text-neutral-400 font-mono tracking-wider">
          ← DRAG HANDLE SIDES TO INSPECT MAKEOVER →
        </p>
      </div>

      {/* CHOSEN STYLE COMBINATION SPECIFICATION BOARD */}
      <div className="grid grid-cols-2 gap-3 bg-neutral-50 dark:bg-neutral-950 p-4 rounded-3xl border border-neutral-200/50 dark:border-neutral-900">
        <div className="text-center sm:text-left space-y-1">
          <span className="text-[9px] text-neutral-400 uppercase tracking-widest font-bold">
            Hairstyle Chosen
          </span>
          <p className="text-sm font-bold text-neutral-800 dark:text-white flex items-center justify-center sm:justify-start space-x-1.5">
            <Scissors className="w-4.5 h-4.5 text-sky-500 shrink-0" />
            <span>{selectedHair}</span>
          </p>
        </div>
        <div className="text-center sm:text-left space-y-1 border-l border-neutral-200/50 dark:border-neutral-900/50 pl-3">
          <span className="text-[9px] text-neutral-400 uppercase tracking-widest font-bold">
            Beard Style Chosen
          </span>
          <p className="text-sm font-bold text-neutral-800 dark:text-white flex items-center justify-center sm:justify-start space-x-1.5">
            <Smile className="w-4.5 h-4.5 text-indigo-500 shrink-0" />
            <span>{selectedBeard}</span>
          </p>
        </div>
      </div>

      {/* FACE SHAPE ANALYSIS REPORT */}
      {faceShapeResult && (
        <div className="bg-white/60 dark:bg-neutral-900/40 backdrop-blur-md border border-neutral-200 dark:border-neutral-800 rounded-3xl p-5 space-y-4 shadow-sm">
          <div className="flex items-center justify-between border-b border-neutral-100 dark:border-neutral-800/80 pb-3">
            <h4 className="text-xs font-bold text-neutral-400 uppercase tracking-widest">
              AI Face Shape Analysis
            </h4>
            <div className="bg-sky-50/80 dark:bg-sky-950/30 text-sky-600 dark:text-sky-400 text-xs font-extrabold px-3 py-1 rounded-full border border-sky-100 dark:border-sky-900/40">
              {faceShapeResult.faceShape} ({faceShapeResult.confidence}%)
            </div>
          </div>

          <div className="space-y-3 font-sans">
            {/* Description list */}
            <div className="space-y-1">
              <span className="text-[10px] text-neutral-400 font-semibold uppercase">Geometry Report:</span>
              <p className="text-xs text-neutral-700 dark:text-neutral-300 leading-relaxed">
                {faceShapeResult.description}
              </p>
            </div>

            {/* Hairstylist advice */}
            <div className="bg-gradient-to-tr from-sky-50/40 to-indigo-50/20 dark:from-sky-950/10 dark:to-indigo-500/5 border border-sky-100/40 dark:border-sky-900/20 p-3.5 rounded-2xl space-y-1">
              <span className="text-[10px] text-sky-600 dark:text-sky-400 font-bold uppercase tracking-wider block">
                Professional Stylist Advice:
              </span>
              <p className="text-xs text-sky-900/90 dark:text-sky-200/90 leading-relaxed italic">
                "{faceShapeResult.hairstylistAdvice}"
              </p>
            </div>

            {/* Side-by-side general recommendations lists */}
            <div className="grid grid-cols-2 gap-4 pt-1">
              <div className="space-y-1">
                <span className="text-[10px] text-neutral-400 font-semibold uppercase">Best Hairstyles:</span>
                <div className="flex flex-wrap gap-1">
                  {faceShapeResult.recommendedHairstyles.slice(0, 4).map((h, i) => (
                    <span key={i} className="text-[10px] font-medium bg-neutral-100 dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400 px-2 py-0.5 rounded-md">
                      {h}
                    </span>
                  ))}
                </div>
              </div>
              <div className="space-y-1 border-l border-neutral-100 dark:border-neutral-800/80 pl-4">
                <span className="text-[10px] text-neutral-400 font-semibold uppercase">Best Beards:</span>
                <div className="flex flex-wrap gap-1">
                  {faceShapeResult.recommendedBeards.slice(0, 4).map((b, i) => (
                    <span key={i} className="text-[10px] font-medium bg-neutral-100 dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400 px-2 py-0.5 rounded-md">
                      {b}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CORE CTA LAYOUT ROWS */}
      <div className="flex gap-3">
        <button
          onClick={onBackToStudio}
          className="w-1/2 py-3.5 px-4 bg-white dark:bg-neutral-950 hover:bg-neutral-50 dark:hover:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-800 dark:text-neutral-200 font-bold text-xs rounded-2xl flex items-center justify-center space-x-1.5 cursor-pointer shadow-sm transition-all"
        >
          <RotateCcw className="w-4 h-4 text-neutral-400" />
          <span>Styling Studio</span>
        </button>

        <button
          onClick={handleDownload}
          className="w-1/2 py-3.5 px-4 bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-505 text-white font-bold text-xs rounded-2xl flex items-center justify-center space-x-1.5 cursor-pointer shadow-md shadow-sky-500/10 transition-all"
        >
          <Download className="w-4 h-4 text-white" />
          <span>Download Portrait</span>
        </button>
      </div>
    </div>
  );
}
