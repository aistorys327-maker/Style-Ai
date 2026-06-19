import React, { useState } from "react";
import { Heart, Grid, Scissors, Smile, Image as ImageIcon, ArrowRight, Trash2, HelpCircle } from "lucide-react";
import { FavoriteStyle, FavoriteGeneration, GenerationHistoryItem } from "../types";
import { HAIR_STYLES, BEARD_STYLES } from "../data/styles";

interface FavoritesViewProps {
  favoriteStyles: FavoriteStyle[];
  favoriteGenerations: FavoriteGeneration[];
  historyItems: GenerationHistoryItem[];
  onSelectHistoryItem: (item: GenerationHistoryItem) => void;
  onRemoveFavoriteStyle: (id: string) => void;
  onRemoveFavoriteGeneration: (id: string) => void;
}

export default function FavoritesView({
  favoriteStyles,
  favoriteGenerations,
  historyItems,
  onSelectHistoryItem,
  onRemoveFavoriteStyle,
  onRemoveFavoriteGeneration,
}: FavoritesViewProps) {
  const [activeTab, setActiveTab] = useState<"generations" | "grooming">("generations");

  const handleSelectGeneration = (favGen: FavoriteGeneration) => {
    // Find matching historyItem so we can reopen full metadata
    const historyItem = historyItems.find((h) => h.id === favGen.historyId);
    if (historyItem) {
      onSelectHistoryItem(historyItem);
    } else {
      // Reconstitute fallback item if deleted from history
      const fallbackItem: GenerationHistoryItem = {
        id: favGen.historyId,
        timestamp: favGen.timestamp,
        originalImage: favGen.originalImage,
        editedImage: favGen.editedImage,
        selectedHair: favGen.selectedHair,
        selectedBeard: favGen.selectedBeard,
        optionsMode: "Hair + Beard",
      };
      onSelectHistoryItem(fallbackItem);
    }
  };

  return (
    <div id="favorites-view-container" className="space-y-6 pb-28 max-w-xl mx-auto">
      {/* Upper header */}
      <div className="flex items-center space-x-2 border-b border-neutral-100 dark:border-neutral-800 pb-3">
        <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />
        <h2 className="text-lg font-bold font-display text-neutral-900 dark:text-white">
          My Saved Favorites
        </h2>
      </div>

      {/* Sub tabs switcher */}
      <div className="flex bg-neutral-100 dark:bg-neutral-950 p-1 rounded-2xl">
        <button
          onClick={() => setActiveTab("generations")}
          className={`w-1/2 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center space-x-1.5 ${
            activeTab === "generations"
              ? "bg-white dark:bg-neutral-900 text-sky-600 dark:text-sky-400 shadow-sm"
              : "text-neutral-500 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200"
          }`}
        >
          <ImageIcon className="w-4 h-4" />
          <span>Generated Makeovers</span>
        </button>
        <button
          onClick={() => setActiveTab("grooming")}
          className={`w-1/2 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center space-x-1.5 ${
            activeTab === "grooming"
              ? "bg-white dark:bg-neutral-900 text-sky-600 dark:text-sky-400 shadow-sm"
              : "text-neutral-500 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200"
          }`}
        >
          <Scissors className="w-4 h-4" />
          <span>Preferred Styles</span>
        </button>
      </div>

      {/* GENERATIONS LIST VIEW */}
      {activeTab === "generations" && (
        <div className="space-y-3">
          {favoriteGenerations.length === 0 ? (
            <div className="text-center py-16 space-y-4 font-sans bg-white/40 dark:bg-neutral-900/40 border border-neutral-200/50 dark:border-neutral-800/50 rounded-3xl p-6">
              <div className="mx-auto w-12 h-12 rounded-full bg-neutral-100 dark:bg-neutral-950 flex items-center justify-center text-neutral-400">
                <Heart className="w-6 h-6" />
              </div>
              <p className="text-sm font-bold text-neutral-800 dark:text-neutral-200">
                No favorited makeovers yet
              </p>
              <p className="text-xs text-neutral-400 max-w-xs mx-auto leading-relaxed">
                Open any generated look in the Studio, and tap the heart icon at the top right to save it to your personal wall.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3.5">
              {favoriteGenerations.map((fav) => (
                <div
                  key={fav.id}
                  className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800/80 rounded-3xl p-3 flex flex-col space-y-3 relative group overflow-hidden shadow-sm"
                >
                  {/* Photo Before After overlay representation */}
                  <div
                    onClick={() => handleSelectGeneration(fav)}
                    className="relative aspect-[4/3] rounded-2xl overflow-hidden cursor-pointer bg-neutral-100"
                  >
                    <img
                      src={fav.editedImage}
                      alt="Fav model"
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-2.5">
                      <p className="text-[10px] font-bold text-white truncate w-full">
                        {fav.selectedHair} {fav.selectedBeard && `+ ${fav.selectedBeard}`}
                      </p>
                    </div>
                  </div>

                  {/* Options row */}
                  <div className="flex items-center justify-between px-1">
                    <span className="text-[9px] text-neutral-400 font-mono tracking-wider">
                      {new Date(fav.timestamp).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
                    </span>
                    
                    <button
                      onClick={() => onRemoveFavoriteGeneration(fav.id)}
                      className="text-neutral-400 hover:text-rose-500 p-1 cursor-pointer"
                      title="Delete favorite"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* GROOMING / STYLES VIEW */}
      {activeTab === "grooming" && (
        <div className="space-y-3">
          {favoriteStyles.length === 0 ? (
            <div className="text-center py-16 space-y-4 font-sans bg-white/40 dark:bg-neutral-900/40 border border-neutral-200/50 dark:border-neutral-800/50 rounded-3xl p-6">
              <div className="mx-auto w-12 h-12 rounded-full bg-neutral-100 dark:bg-neutral-950 flex items-center justify-center text-neutral-400">
                <Scissors className="w-6 h-6" />
              </div>
              <p className="text-sm font-bold text-neutral-800 dark:text-neutral-200">
                No saved preferred styles
              </p>
              <p className="text-xs text-neutral-400 max-w-xs mx-auto leading-relaxed">
                You can save and keep track of your favorite haircuts or beard guidelines in the Settings page or via style catalogs.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {favoriteStyles.map((fav) => {
                const styleObj =
                  fav.type === "hair"
                    ? HAIR_STYLES.find((h) => h.name === fav.name)
                    : BEARD_STYLES.find((b) => b.name === fav.name);

                return (
                  <div
                    key={fav.id}
                    className="bg-white/80 dark:bg-neutral-900/60 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-4 flex items-start justify-between gap-4 shadow-sm"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        {fav.type === "hair" ? (
                          <Scissors className="w-4 h-4 text-sky-500 shrink-0" />
                        ) : (
                          <Smile className="w-4 h-4 text-indigo-500 shrink-0" />
                        )}
                        <h4 className="text-sm font-bold text-neutral-800 dark:text-white leading-none">
                          {fav.name}
                        </h4>
                        <span className="bg-neutral-100 dark:bg-neutral-950 text-[8px] font-mono uppercase px-1.5 py-0.5 rounded text-neutral-400">
                          {fav.type}
                        </span>
                      </div>

                      <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
                        {styleObj?.description || "Curated groom styling outline profile option."}
                      </p>

                      {styleObj?.tip && (
                        <div className="text-[11px] bg-sky-50/50 dark:bg-sky-950/20 text-sky-700 dark:text-sky-400 p-2 rounded-xl border border-sky-100/30">
                          <b className="font-bold">Advice: </b> {styleObj.tip}
                        </div>
                      )}
                    </div>

                    <button
                      onClick={() => onRemoveFavoriteStyle(fav.id)}
                      className="text-neutral-400 hover:text-rose-500 p-1 cursor-pointer shrink-0"
                      title="Remove preference"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
