import React from "react";
import { Scissors, Sun, Moon, Key, ShieldCheck, HelpCircle, RefreshCw } from "lucide-react";

interface HeaderProps {
  apiKeyStatus: "connected" | "invalid" | "expired" | "not_set" | "demo";
  theme: "dark" | "light";
  onThemeToggle: () => void;
  onOpenSetupKey: () => void;
}

export default function Header({
  apiKeyStatus,
  theme,
  onThemeToggle,
  onOpenSetupKey,
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-neutral-200/50 dark:border-neutral-800/50 px-4 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Title Brand Logo */}
        <div className="flex items-center space-x-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-600 shadow-lg shadow-sky-500/20 flex items-center justify-center">
            <Scissors className="w-4.5 h-4.5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold font-display tracking-tight text-neutral-900 dark:text-white leading-none">
              StyleAI
            </h1>
            <span className="text-[9px] text-neutral-400 font-mono tracking-wider uppercase">
              Hairstyles & Beards
            </span>
          </div>
        </div>

        {/* Option Status Badge and Controls */}
        <div className="flex items-center space-x-2">
          {/* API key status badge */}
          <button
            onClick={onOpenSetupKey}
            id="header-api-status-btn"
            className={`px-2.5 py-1 rounded-full text-[10px] font-semibold tracking-wide flex items-center space-x-1.5 cursor-pointer hover:opacity-95 transition-all outline-none border ${
              apiKeyStatus === "connected"
                ? "bg-emerald-50 text-emerald-700 border-emerald-200/50 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-900/40"
                : apiKeyStatus === "demo"
                ? "bg-purple-50 text-purple-700 border-purple-200/50 dark:bg-purple-950/30 dark:text-purple-400 dark:border-purple-900/40"
                : "bg-rose-50 text-rose-700 border-rose-200/50 dark:bg-rose-950/20 dark:text-rose-400 dark:border-rose-900/40"
            }`}
          >
            {apiKeyStatus === "connected" ? (
              <>
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                <span className="xs:inline hidden">Gemini Connected</span>
                <span className="xs:hidden inline">Active</span>
              </>
            ) : apiKeyStatus === "demo" ? (
              <>
                <HelpCircle className="w-3.5 h-3.5 text-purple-400" />
                <span>Simulation Demo</span>
              </>
            ) : (
              <>
                <Key className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
                <span>Configure Key</span>
              </>
            )}
          </button>

          {/* Theme Toggler */}
          <button
            onClick={onThemeToggle}
            id="theme-toggler-btn"
            className="p-2 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white/70 dark:bg-neutral-900/70 hover:bg-neutral-50 dark:hover:bg-neutral-950 text-neutral-700 dark:text-neutral-300 transition-colors cursor-pointer"
            aria-label="Toggle visual theme"
          >
            {theme === "dark" ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </header>
  );
}
