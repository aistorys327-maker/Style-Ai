import React, { useState } from "react";
import { Key, Eye, EyeOff, Check, AlertCircle, Trash2, Sun, Moon, ShieldAlert, BadgeInfo, Star, Scissors, Smile, ExternalLink } from "lucide-react";
import { HAIR_STYLES, BEARD_STYLES } from "../data/styles";
import { FavoriteStyle } from "../types";

interface SettingsViewProps {
  apiKey: string;
  apiKeyStatus: string;
  theme: "dark" | "light";
  favoriteStyles: FavoriteStyle[];
  onUpdateApiKey: (key: string) => Promise<boolean>;
  onThemeToggle: () => void;
  onClearHistory: () => void;
  onClearFavorites: () => void;

  onAddFavoriteStyle: (name: string, type: "hair" | "beard") => void;
  onRemoveFavoriteStyle: (id: string) => void;
}

export default function SettingsView({
  apiKey,
  apiKeyStatus,
  theme,
  favoriteStyles,
  onUpdateApiKey,
  onThemeToggle,
  onClearHistory,
  onClearFavorites,
  onAddFavoriteStyle,
  onRemoveFavoriteStyle,
}: SettingsViewProps) {
  const [newKey, setNewKey] = useState(apiKey);
  const [showKey, setShowKey] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateMsg, setUpdateMsg] = useState<{ text: string; isError: boolean } | null>(null);

  // Clear confirmation states
  const [confirmHistory, setConfirmHistory] = useState(false);
  const [confirmFavorites, setConfirmFavorites] = useState(false);

  const handleSaveKey = async () => {
    setIsUpdating(true);
    setUpdateMsg(null);
    try {
      const isOk = await onUpdateApiKey(newKey.trim());
      if (isOk) {
        setUpdateMsg({ text: "API Key updated and validated successfully!", isError: false });
      } else {
        setUpdateMsg({ text: "Key update failed validation. Please double check the key.", isError: true });
      }
    } catch (e) {
      setUpdateMsg({ text: "Failed to connect to verification microservice.", isError: true });
    } finally {
      setIsUpdating(false);
    }
  };

  const isFav = (name: string, type: "hair" | "beard") => {
    return favoriteStyles.some((f) => f.name === name && f.type === type);
  };

  const handleToggleFavStyle = (name: string, type: "hair" | "beard") => {
    const existing = favoriteStyles.find((f) => f.name === name && f.type === type);
    if (existing) {
      onRemoveFavoriteStyle(existing.id);
    } else {
      onAddFavoriteStyle(name, type);
    }
  };

  return (
    <div id="settings-view-container" className="space-y-6 pb-28 max-w-xl mx-auto font-sans">
      {/* Upper header */}
      <div className="border-b border-neutral-100 dark:border-neutral-800 pb-3">
        <h2 className="text-lg font-bold font-display text-neutral-900 dark:text-white">
          Application Settings
        </h2>
        <p className="text-xs text-neutral-400">
          Configure API endpoints, choose appearance themes, manage stored storage profiles, and toggle hairstyle preferences.
        </p>
      </div>

      {/* GEMINI KEY SECTOR CARD */}
      <div className="bg-white/60 dark:bg-neutral-900/40 border border-neutral-200 dark:border-neutral-800 p-5 rounded-3xl space-y-4 shadow-sm">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-widest flex items-center space-x-1">
            <Key className="w-4 h-4 text-sky-500" />
            <span>Gemini Key Manager</span>
          </h3>
          <span
            className={`px-2 py-0.5 rounded text-[9px] font-mono uppercase font-bold border ${
              apiKeyStatus === "connected"
                ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900/40"
                : apiKeyStatus === "demo"
                ? "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/20 dark:text-purple-400 dark:border-purple-900/40"
                : "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/20 dark:text-rose-400 dark:border-rose-900/40"
            }`}
          >
            {apiKeyStatus === "connected" ? "CONNECTED" : apiKeyStatus === "demo" ? "DEMO MODE" : "NOT SET"}
          </span>
        </div>

        <div className="space-y-3">
          <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
            Change or view your Gemini API key used to conduct server-side facial recognition and style generation.
          </p>

          <div className="relative">
            <input
              type={showKey ? "text" : "password"}
              value={newKey}
              onChange={(e) => {
                setNewKey(e.target.value);
                setUpdateMsg(null);
              }}
              placeholder="PASTE NEW KEY HERE..."
              className="w-full pl-3 pr-10 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-100/50 dark:bg-neutral-950 focus:bg-white dark:focus:bg-neutral-900 outline-none transition-all text-xs text-neutral-850 dark:text-neutral-200 placeholder-neutral-400 font-mono"
            />
            <button
              onClick={() => setShowKey(!showKey)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-neutral-400 hover:text-neutral-600 cursor-pointer"
            >
              {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          {updateMsg && (
            <div
              className={`flex items-start space-x-1.5 p-2.5 rounded-xl text-xs border ${
                updateMsg.isError
                  ? "bg-rose-50 text-rose-700 border-rose-200/50 dark:bg-rose-950/25 dark:text-rose-400 dark:border-rose-900/50"
                  : "bg-green-50 text-green-700 border-green-200/50 dark:bg-green-950/25 dark:text-green-400 dark:border-green-900/50"
              }`}
            >
              {updateMsg.isError ? <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" /> : <Check className="w-4 h-4 mt-0.5 shrink-0" />}
              <span>{updateMsg.text}</span>
            </div>
          )}

          <div className="flex justify-between items-center gap-2 pt-1.5">
            <a
              href="https://aistudio.google.com/app/apikey"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[10px] font-semibold text-sky-600 dark:text-sky-400 flex items-center space-x-1 hover:underline"
            >
              <span>Get key from AI Studio</span>
              <ExternalLink className="w-3 h-3" />
            </a>
            
            <button
              onClick={handleSaveKey}
              disabled={isUpdating}
              className="bg-neutral-900 dark:bg-white hover:bg-neutral-800 dark:hover:bg-neutral-100 disabled:opacity-40 text-white dark:text-black text-xs font-bold py-2 px-4 rounded-xl cursor-pointer transition-colors shadow-sm"
            >
              {isUpdating ? "Saving..." : "Update Key"}
            </button>
          </div>
        </div>
      </div>

      {/* APPEARANCE SECTOR */}
      <div className="bg-white/60 dark:bg-neutral-900/40 border border-neutral-200 dark:border-neutral-800 p-5 rounded-3xl space-y-4 shadow-sm">
        <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-widest flex items-center space-x-1">
          <Sun className="w-4 h-4 text-sky-500" />
          <span>Appearance Mode</span>
        </h3>

        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-neutral-800 dark:text-neutral-200">
              {theme === "dark" ? "Dark Mode Active" : "Light Mode Active"}
            </p>
            <p className="text-[11px] text-neutral-400">
              Choose between glassmorphic white and cinematic dark themes.
            </p>
          </div>

          <button
            onClick={onThemeToggle}
            className="flex items-center space-x-2 bg-neutral-100 dark:bg-neutral-950 hover:bg-neutral-200 dark:hover:bg-neutral-900 border border-neutral-200 dark:border-neutral-850 px-3.5 py-2 rounded-2xl cursor-pointer transition-all"
          >
            {theme === "dark" ? (
              <>
                <Sun className="w-4 h-4 text-amber-500" />
                <span className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">Light Mode</span>
              </>
            ) : (
              <>
                <Moon className="w-4 h-4 text-indigo-500" />
                <span className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">Dark Mode</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* STYLES PREFERENCES TOGGLER BINDER */}
      <div className="bg-white/60 dark:bg-neutral-900/40 border border-neutral-200 dark:border-neutral-800 p-5 rounded-3xl space-y-4 shadow-sm">
        <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-widest flex items-center space-x-1">
          <Star className="w-4 h-4 text-sky-500" />
          <span>General Style Preferencing</span>
        </h3>

        <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
          Toggle styles to lock them directly into your Saved Favorites catalog. This acts as your custom preferred reference deck.
        </p>

        {/* Hairstyle Preferred Grid */}
        <div className="space-y-3">
          <div className="space-y-1.5">
            <span className="text-[10px] font-bold text-neutral-400 uppercase flex items-center space-x-1">
              <Scissors className="w-3 h-3 text-sky-500 shrink-0" />
              <span>Hairstyles Catalog</span>
            </span>
            <div className="flex flex-wrap gap-1.5">
              {HAIR_STYLES.map((style) => {
                const fav = isFav(style.name, "hair");
                return (
                  <button
                    key={style.id}
                    onClick={() => handleToggleFavStyle(style.name, "hair")}
                    className={`text-[10px] py-1 px-2.5 rounded-lg border font-medium cursor-pointer transition-all ${
                      fav
                        ? "bg-rose-50 text-rose-600 border-rose-200 dark:bg-rose-950/20 dark:text-rose-400 dark:border-rose-900"
                        : "bg-neutral-50 dark:bg-neutral-950 text-neutral-600 dark:text-neutral-400 border-neutral-200 dark:border-neutral-900 hover:border-neutral-300 dark:hover:border-neutral-800"
                    }`}
                  >
                    {style.name}
                  </button>
                );
              })}
            </div>
          </div>

          {/* beard styles */}
          <div className="space-y-1.5">
            <span className="text-[10px] font-bold text-neutral-400 uppercase flex items-center space-x-1">
              <Smile className="w-3 h-3 text-indigo-500 shrink-0" />
              <span>Beard Styles Catalog</span>
            </span>
            <div className="flex flex-wrap gap-1.5">
              {BEARD_STYLES.map((style) => {
                const fav = isFav(style.name, "beard");
                return (
                  <button
                    key={style.id}
                    onClick={() => handleToggleFavStyle(style.name, "beard")}
                    className={`text-[10px] py-1 px-2.5 rounded-lg border font-medium cursor-pointer transition-all ${
                      fav
                        ? "bg-rose-50 text-rose-600 border-rose-200 dark:bg-rose-950/20 dark:text-rose-400 dark:border-rose-900"
                        : "bg-neutral-50 dark:bg-neutral-950 text-neutral-600 dark:text-neutral-400 border-neutral-200 dark:border-neutral-900 hover:border-neutral-300 dark:hover:border-neutral-800"
                    }`}
                  >
                    {style.name}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* STORAGE & DATA PURGES */}
      <div className="bg-white/60 dark:bg-neutral-900/40 border border-neutral-200 dark:border-neutral-800 p-5 rounded-3xl space-y-4 shadow-sm border-rose-100/30 dark:border-rose-950/20">
        <h3 className="text-xs font-bold text-rose-500 dark:text-rose-400 uppercase tracking-widest flex items-center space-x-1">
          <ShieldAlert className="w-4 h-4 text-rose-500" />
          <span>Advanced Storage Reset</span>
        </h3>

        <p className="text-xs text-neutral-400 leading-relaxed">
          Irreversible commands to clean cached data. These clean your virtual browser space for privacy or storage purposes.
        </p>

        <div className="space-y-2 pt-1 font-sans">
          {/* History Clean row */}
          <div className="flex items-center justify-between bg-neutral-100/50 dark:bg-neutral-950 p-3 rounded-2xl border border-neutral-200/40 dark:border-neutral-900">
            <div>
              <p className="text-xs font-bold text-neutral-850 dark:text-neutral-200">
                Purge History
              </p>
              <p className="text-[10px] text-neutral-400">
                Deletes all items inside the History makeover list.
              </p>
            </div>
            {confirmHistory ? (
              <div className="flex space-x-2">
                <button
                  onClick={() => setConfirmHistory(false)}
                  className="px-2 py-1 text-[10px] bg-neutral-200 dark:bg-neutral-850 text-neutral-700 dark:text-neutral-300 rounded cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    onClearHistory();
                    setConfirmHistory(false);
                  }}
                  className="px-2.5 py-1 text-[10px] bg-rose-600 text-white font-bold rounded cursor-pointer"
                >
                  Confirm Delete
                </button>
              </div>
            ) : (
              <button
                onClick={() => setConfirmHistory(true)}
                className="text-neutral-400 hover:text-rose-500 p-1.5 cursor-pointer"
              >
                <Trash2 className="w-4.5 h-4.5" />
              </button>
            )}
          </div>

          {/* Favorites Clean row */}
          <div className="flex items-center justify-between bg-neutral-100/50 dark:bg-neutral-950 p-3 rounded-2xl border border-neutral-200/40 dark:border-neutral-900">
            <div>
              <p className="text-xs font-bold text-neutral-850 dark:text-neutral-200">
                Purge Saved Favorites
              </p>
              <p className="text-[10px] text-neutral-400">
                Deletes all saved styles and generated pictures.
              </p>
            </div>
            {confirmFavorites ? (
              <div className="flex space-x-2">
                <button
                  onClick={() => setConfirmFavorites(false)}
                  className="px-2 py-1 text-[10px] bg-neutral-200 dark:bg-neutral-850 text-neutral-700 dark:text-neutral-300 rounded cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    onClearFavorites();
                    setConfirmFavorites(false);
                  }}
                  className="px-2.5 py-1 text-[10px] bg-rose-600 text-white font-bold rounded cursor-pointer"
                >
                  Confirm Delete
                </button>
              </div>
            ) : (
              <button
                onClick={() => setConfirmFavorites(true)}
                className="text-neutral-400 hover:text-rose-500 p-1.5 cursor-pointer"
              >
                <Trash2 className="w-4.5 h-4.5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
