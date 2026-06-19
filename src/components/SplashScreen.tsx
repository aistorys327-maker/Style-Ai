import React, { useEffect, useState } from "react";
import { Sparkles, Scissors, Loader } from "lucide-react";
import { motion } from "motion/react";

interface SplashScreenProps {
  onFinish: () => void;
}

export default function SplashScreen({ onFinish }: SplashScreenProps) {
  const [loadingText, setLoadingText] = useState("Initializing StyleAI...");

  useEffect(() => {
    const textSequence = [
      { t: 700, val: "Setting up virtual barbershop..." },
      { t: 1400, val: "Calibrating facial geometric grid..." },
      { t: 2100, val: "Preparing style intelligence models..." },
      { t: 2800, val: "Ready!" }
    ];

    const timers = textSequence.map(item => 
      setTimeout(() => setLoadingText(item.val), item.t)
    );

    const finishTimer = setTimeout(() => {
      onFinish();
    }, 3200);

    return () => {
      timers.forEach(clearTimeout);
      clearTimeout(finishTimer);
    };
  }, [onFinish]);

  return (
    <div
      id="splash-screen-bg"
      className="fixed inset-0 bg-neutral-900 text-white flex flex-col items-center justify-center z-50 overflow-hidden"
    >
      {/* Mesh Glow */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-sky-500/20 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />

      <div className="flex flex-col items-center space-y-6 max-w-sm px-6 text-center z-10">
        {/* Animated Brand Emblem */}
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: [1, 1.1, 1], opacity: 1 }}
          transition={{ duration: 1.5, repeat: Infinity, repeatType: "reverse" }}
          className="relative w-24 h-24 rounded-3xl bg-gradient-to-tr from-sky-500 to-indigo-600 shadow-2xl shadow-sky-500/30 flex items-center justify-center"
        >
          <Scissors className="w-10 h-10 text-white" />
          <div className="absolute -top-1 -right-1 bg-yellow-400 text-black p-1.5 rounded-full shadow-lg">
            <Sparkles className="w-4 h-4" />
          </div>
        </motion.div>

        {/* Brand Name */}
        <div className="space-y-2">
          <h1 className="text-4xl font-extrabold tracking-tight font-display bg-gradient-to-r from-white via-sky-200 to-indigo-200 bg-clip-text text-transparent">
            StyleAI
          </h1>
          <p className="text-neutral-400 font-medium text-sm">
            AI Hairstyle & Beard Recommendation
          </p>
        </div>

        {/* Loading Spinner and Status Labels */}
        <div className="w-full pt-10 flex flex-col items-center space-y-3">
          <Loader className="w-6 h-6 animate-spin text-sky-400" />
          <motion.p
            key={loadingText}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xs font-mono text-sky-300 tracking-widest uppercase"
          >
            {loadingText}
          </motion.p>
        </div>
      </div>

      {/* Aesthetic credit overlay in fine print */}
      <div className="absolute bottom-6 left-0 right-0 text-center text-[10px] font-mono text-neutral-600 uppercase tracking-widest">
        Style Intelligence Engine v1.0.0
      </div>
    </div>
  );
}
