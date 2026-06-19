import React, { useState, useRef, useEffect } from "react";
import { MoveLeft, MoveRight } from "lucide-react";

interface BeforeAfterSliderProps {
  beforeImg: string;
  afterImg: string;
  beforeLabel?: string;
  afterLabel?: string;
}

export default function BeforeAfterSlider({
  beforeImg,
  afterImg,
  beforeLabel = "Original",
  afterLabel = "StyleAI Edited",
}: BeforeAfterSliderProps) {
  const [sliderPosition, setSliderPosition] = useState(50); // percentage (0-100)
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Handle absolute mouse/touch calculations
  const handleMove = (clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    let percentage = (x / rect.width) * 100;
    if (percentage < 0) percentage = 0;
    if (percentage > 100) percentage = 100;
    setSliderPosition(percentage);
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (!isDragging) return;
    if (e.touches && e.touches[0]) {
      handleMove(e.touches[0].clientX);
    }
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;
    handleMove(e.clientX);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
      window.addEventListener("touchmove", handleTouchMove);
      window.addEventListener("touchend", handleMouseUp);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleMouseUp);
    };
  }, [isDragging]);

  const onMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    handleMove(e.clientX);
  };

  const onTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    if (e.touches && e.touches[0]) {
      handleMove(e.touches[0].clientX);
    }
  };

  return (
    <div
      ref={containerRef}
      id="before-after-slider-widget"
      className="slider-container relative w-full aspect-square md:rounded-2xl rounded-xl overflow-hidden cursor-ew-resize select-none border border-neutral-200 dark:border-neutral-800 shadow-lg touch-none"
      onMouseDown={onMouseDown}
      onTouchStart={onTouchStart}
    >
      {/* After Image (Behind) */}
      <img
        src={afterImg}
        alt="After style"
        className="absolute top-0 left-0 w-full h-full object-cover select-none"
        referrerPolicy="no-referrer"
      />
      <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-2 py-1 rounded text-[10px] font-semibold text-white uppercase tracking-wider z-10 pointer-events-none">
        {afterLabel}
      </div>

      {/* Before Image (Overlaid with clip-path) */}
      <div
        className="absolute top-0 left-0 w-full h-full pointer-events-none"
        style={{
          clipPath: `polygon(0 0, ${sliderPosition}% 0, ${sliderPosition}% 100%, 0 100%)`,
        }}
      >
        <img
          src={beforeImg}
          alt="Before style"
          className="absolute top-0 left-0 w-full h-full object-cover select-none"
          referrerPolicy="no-referrer"
        />
        <div className="absolute top-4 left-4 bg-sky-600/90 backdrop-blur-md px-2 py-1 rounded text-[10px] font-semibold text-white uppercase tracking-wider z-10 pointer-events-none">
          {beforeLabel}
        </div>
      </div>

      {/* Vertical Slider Bar Line */}
      <div
        className="absolute top-0 bottom-0 w-0.5 bg-white shadow-2xl z-20 pointer-events-none"
        style={{ left: `${sliderPosition}%` }}
      >
        {/* Slider Handle Knob */}
        <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-white dark:bg-neutral-900 border-2 border-sky-500 shadow-xl flex items-center justify-center pointer-events-none z-30">
          <div className="flex space-x-0.5 text-sky-500">
            <MoveLeft className="w-3 h-3" />
            <MoveRight className="w-3 h-3" />
          </div>
        </div>
      </div>
    </div>
  );
}
