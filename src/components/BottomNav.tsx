import React from "react";
import { Camera, History, Heart, Settings } from "lucide-react";

export type TabID = "home" | "history" | "favorites" | "settings";

interface BottomNavProps {
  activeTab: TabID;
  onChangeTab: (tab: TabID) => void;
  favoritesCount?: number;
}

export default function BottomNav({
  activeTab,
  onChangeTab,
  favoritesCount = 0,
}: BottomNavProps) {
  interface NavItem {
    id: TabID;
    label: string;
    icon: React.ComponentType<any>;
    badge?: number;
  }

  const navItems: NavItem[] = [
    { id: "home", label: "Studio", icon: Camera },
    { id: "history", label: "History", icon: History },
    {
      id: "favorites",
      label: "Favorites",
      icon: Heart,
      badge: favoritesCount > 0 ? favoritesCount : undefined,
    },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 glass-panel border-t border-neutral-200/50 dark:border-neutral-800/40 pb-safe shadow-[0_-8px_24px_rgba(0,0,0,0.04)]">
      <div className="max-w-md mx-auto px-4 py-2 flex items-center justify-around">
        {navItems.map((item) => {
          const IconComponent = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onChangeTab(item.id)}
              className="relative py-2 px-3 rounded-2xl flex flex-col items-center justify-center space-y-1 transition-all select-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-sky-500/20"
            >
              <div
                className={`p-1.5 rounded-xl transition-all ${
                  isActive
                    ? "bg-sky-500 text-white scale-110 shadow-md shadow-sky-500/10"
                    : "text-neutral-400 dark:text-neutral-500 hover:text-neutral-600 dark:hover:text-neutral-400"
                }`}
              >
                <IconComponent className="w-5 h-5" />
              </div>
              <span
                className={`text-[10px] font-medium tracking-wide transition-colors ${
                  isActive
                    ? "text-sky-600 dark:text-sky-400 font-semibold"
                    : "text-neutral-500 dark:text-neutral-400"
                }`}
              >
                {item.label}
              </span>

              {/* Counts Badge */}
              {item.badge !== undefined && (
                <span className="absolute top-1 right-2 w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] font-bold flex items-center justify-center border border-white dark:border-neutral-900 animate-pulse">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
