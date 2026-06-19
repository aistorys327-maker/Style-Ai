import React, { useState } from "react";
import { Key, Eye, EyeOff, Check, AlertCircle, ExternalLink, HelpCircle, Loader2, ArrowRight } from "lucide-react";

interface SetupWizardProps {
  onCompleted: (key: string, status: "connected" | "not_set") => void;
  onSkip: () => void;
}

export default function SetupWizard({ onCompleted, onSkip }: SetupWizardProps) {
  const [apiKey, setApiKey] = useState("");
  const [showKey, setShowKey] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [validationResult, setValidationResult] = useState<{
    status: "none" | "connected" | "invalid" | "expired" | "error";
    error?: string;
  }>({ status: "none" });

  const getGeminiKeyURL = "https://aistudio.google.com/app/apikey";

  const handleValidateAndSave = async () => {
    if (!apiKey.trim()) {
      setValidationResult({
        status: "invalid",
        error: "Please enter a key before validating."
      });
      return;
    }

    setIsValidating(true);
    setValidationResult({ status: "none" });

    try {
      const response = await fetch("/api/gemini/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ apiKey: apiKey.trim() }),
      });

      const data = await response.json();

      if (response.ok && data.status === "connected") {
        setValidationResult({ status: "connected" });
        // Small delay to let user see success before progressing
        setTimeout(() => {
          onCompleted(apiKey.trim(), "connected");
        }, 1200);
      } else {
        setValidationResult({
          status: data.status || "invalid",
          error: data.error || "The key could not be verified by Gemini."
        });
      }
    } catch (err: any) {
      setValidationResult({
        status: "error",
        error: "Failed to connect to the StyleAI verification server."
      });
    } finally {
      setIsValidating(false);
    }
  };

  return (
    <div
      id="api-setup-wizard-container"
      className="max-w-md w-full mx-auto bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl overflow-hidden shadow-2xl p-6 md:p-8 space-y-6"
    >
      {/* Icon & Heading */}
      <div className="text-center space-y-2">
        <div className="inline-flex p-3 rounded-2xl bg-sky-100 dark:bg-sky-950 text-sky-600 dark:text-sky-400">
          <Key className="w-6 h-6" />
        </div>
        <h2 className="text-2xl font-bold font-display text-neutral-950 dark:text-white">
          Gemini API Configuration
        </h2>
        <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
          StyleAI leverages advanced server-side Gemini multimodal LLMs to analyze your portrait face shapes & generate realistic styling. An API key is required to start your makeover.
        </p>
      </div>

      {/* Primary CTA: Obtain Key */}
      <div className="bg-sky-50 dark:bg-sky-950/30 border border-sky-100 dark:border-sky-900/50 p-4 rounded-2xl space-y-3">
        <div className="flex items-start space-x-3">
          <HelpCircle className="w-5 h-5 text-sky-600 dark:text-sky-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="text-xs font-semibold text-sky-900 dark:text-sky-300">
              No Gemini API key yet?
            </h4>
            <p className="text-[11px] text-sky-800/80 dark:text-sky-400/80 leading-relaxed">
              Gemini API keys are free for developer testing! Click the button below to retrieve yours from your Google AI Studio console.
            </p>
          </div>
        </div>
        <a
          href={getGeminiKeyURL}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full inline-flex items-center justify-center space-x-2 bg-sky-600 hover:bg-sky-500 active:bg-sky-700 text-white font-medium text-xs py-2.5 px-4 rounded-xl shadow-md cursor-pointer transition-colors"
        >
          <span>Get Free Gemini API Key</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>

      {/* Step by Step Manual instructions */}
      <div className="space-y-2 font-sans">
        <h4 className="text-xs font-bold text-neutral-800 dark:text-neutral-200 uppercase tracking-widest">
          Quick Setup Instructions:
        </h4>
        <ol className="text-xs text-neutral-600 dark:text-neutral-400 space-y-2 pl-4 list-decimal leading-relaxed">
          <li>Click the blue <b className="text-neutral-800 dark:text-neutral-200">Get Free Gemini API Key</b> button.</li>
          <li>Log in with your standard Google Account.</li>
          <li>Select <b className="text-neutral-800 dark:text-neutral-200">Create API key</b>, choosing either an existing or a new project.</li>
          <li>Copy your unique generated string, paste it back here below, and validate.</li>
        </ol>
      </div>

      {/* Entry field */}
      <div className="space-y-3">
        <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
          Enter your Gemini API key:
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-neutral-400">
            <Key className="w-4 h-4" />
          </div>
          <input
            type={showKey ? "text" : "password"}
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="AIzaSy..."
            className="w-full pl-10 pr-10 py-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 focus:bg-white dark:focus:bg-neutral-900 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-all text-xs text-neutral-800 dark:text-neutral-200 placeholder-neutral-400 font-mono"
          />
          <button
            type="button"
            onClick={() => setShowKey(!showKey)}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-neutral-400 hover:text-neutral-600 cursor-pointer"
          >
            {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>

        {/* Validation statuses */}
        {validationResult.status === "connected" && (
          <div className="flex items-center space-x-2 text-green-600 dark:text-green-400 text-xs bg-green-50 dark:bg-green-950/30 p-2.5 rounded-xl border border-green-200/50">
            <Check className="w-4 h-4 shrink-0" />
            <span>Success: Valid key! Connecting you to StyleAI...</span>
          </div>
        )}

        {(validationResult.status === "invalid" || validationResult.status === "expired") && (
          <div className="flex items-start space-x-2 text-rose-600 dark:text-rose-400 text-xs bg-rose-50 dark:bg-rose-950/30 p-2.5 rounded-xl border border-rose-200/50 leading-relaxed">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">Verification Failed</p>
              <p className="text-[11px] opacity-90">{validationResult.error}</p>
            </div>
          </div>
        )}

        {validationResult.status === "error" && (
          <div className="flex items-center space-x-2 text-amber-600 dark:text-amber-400 text-xs bg-amber-50 dark:bg-amber-950/30 p-2.5 rounded-xl border border-amber-200/50">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{validationResult.error}</span>
          </div>
        )}
      </div>

      {/* Buttons */}
      <div className="grid grid-cols-2 gap-3 pt-2">
        <button
          type="button"
          onClick={onSkip}
          className="py-3 px-4 border border-neutral-200 dark:border-rose-950 hover:bg-neutral-50 dark:hover:bg-neutral-950 dark:text-neutral-300 text-neutral-700 rounded-xl text-xs font-semibold cursor-pointer transition-colors"
        >
          Try Demo Look
        </button>
        <button
          type="button"
          disabled={isValidating || !apiKey.trim()}
          onClick={handleValidateAndSave}
          className="flex items-center justify-center space-x-2 bg-neutral-950 dark:bg-white hover:bg-neutral-800 dark:hover:bg-neutral-200 disabled:opacity-50 text-white dark:text-black py-3 px-4 rounded-xl text-xs font-bold shadow-md cursor-pointer transition-all"
        >
          {isValidating ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Checking...</span>
            </>
          ) : (
            <>
              <span>Validate & Save</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </div>

      <div className="text-center">
        <p className="text-[10px] text-neutral-400">
          Your key stays strictly within authorization context and is stored secure in local memory.
        </p>
      </div>
    </div>
  );
}
