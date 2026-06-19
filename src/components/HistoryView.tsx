import React from "react";
import { History, Calendar, Trash2, ArrowRight, Scissors, Smile, ExternalLink } from "lucide-react";
import { GenerationHistoryItem } from "../types";

interface HistoryViewProps {
  historyItems: GenerationHistoryItem[];
  onSelectHistoryItem: (item: GenerationHistoryItem) => void;
  onClearHistory: () => void;
}

export default function HistoryView({
  historyItems,
  onSelectHistoryItem,
  onClearHistory,
}: HistoryViewProps) {
  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div id="history-view-container" className="space-y-6 pb-28 max-w-xl mx-auto">
      {/* Title Header bar */}
      <div className="flex items-center justify-between border-b border-neutral-100 dark:border-neutral-800 pb-3">
        <div className="flex items-center space-x-2">
          <History className="w-5 h-5 text-sky-500" />
          <h2 className="text-lg font-bold font-display text-neutral-900 dark:text-white">
            Styling Makeover History
          </h2>
        </div>
        {historyItems.length > 0 && (
          <button
            onClick={onClearHistory}
            className="text-[10px] font-semibold text-rose-500 hover:text-rose-600 flex items-center space-x-1 cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear History</span>
          </button>
        )}
      </div>

      {historyItems.length === 0 ? (
        // Empty state
        <div className="text-center py-16 space-y-4 font-sans bg-white/40 dark:bg-neutral-900/40 border border-neutral-200/50 dark:border-neutral-800/50 rounded-3xl p-6">
          <div className="mx-auto w-12 h-12 rounded-full bg-neutral-100 dark:bg-neutral-950 flex items-center justify-center text-neutral-400">
            <History className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <p className="text-sm font-bold text-neutral-800 dark:text-neutral-200">
              No hairstyle history yet
            </p>
            <p className="text-xs text-neutral-400 max-w-xs mx-auto">
              Ready to meet your style? Head back to the Studio tab, upload a photo, and click "Generate Look" to find your first makeover.
            </p>
          </div>
        </div>
      ) : (
        // History List
        <div className="space-y-3">
          {historyItems.map((item) => (
            <div
              key={item.id}
              onClick={() => onSelectHistoryItem(item)}
              className="bg-white/80 dark:bg-neutral-900/60 backdrop-blur-md border border-neutral-200 dark:border-neutral-800/80 hover:border-sky-500/50 dark:hover:border-sky-500/30 p-3.5 rounded-2xl flex items-center justify-between gap-4 cursor-pointer transition-all shadow-sm hover:shadow active:scale-[0.99]"
            >
              {/* Image representations */}
              <div className="flex items-center space-x-3 w-3/4">
                <div className="flex -space-x-4">
                  <div className="w-10 h-10 rounded-xl overflow-hidden border-2 border-white dark:border-neutral-900 shadow-sm shrink-0">
                    <img
                      src={item.originalImage}
                      alt="Before"
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="w-10 h-10 rounded-xl overflow-hidden border-2 border-white dark:border-neutral-900 shadow-md shrink-0">
                    <img
                      src={item.editedImage}
                      alt="After Style"
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                </div>

                {/* Text combination labels */}
                <div className="space-y-1 truncate">
                  <h4 className="text-xs font-bold text-neutral-800 dark:text-white truncate">
                    {item.selectedHair} {item.selectedBeard && `+ ${item.selectedBeard}`}
                  </h4>
                  <div className="flex items-center space-x-3 text-[10px] text-neutral-400 font-medium">
                    <span className="flex items-center">
                      <Calendar className="w-3 h-3 mr-1 shrink-0" />
                      {formatDate(item.timestamp)}
                    </span>
                    <span className="bg-sky-50/50 dark:bg-sky-950/20 text-sky-600 dark:text-sky-400 text-[8px] font-mono uppercase px-1 rounded">
                      {item.faceShapeResult?.faceShape || "Oval"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Reopen pointer button */}
              <div className="text-neutral-400 hover:text-sky-500">
                <ArrowRight className="w-4.5 h-4.5" />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
