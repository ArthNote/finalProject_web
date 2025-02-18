"use client";

import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

const IMAGES = [
  "/authGrid/1.jpg",
  "/authGrid/2.jpg",
  "/authGrid/3.jpg",
  "/authGrid/4.jpg",
  "/authGrid/5.jpg",
  "/authGrid/6.jpg",
];

// Double the images to create seamless loop
const COLUMN_1 = [...IMAGES, ...IMAGES];
const COLUMN_2 = [...IMAGES, ...IMAGES];

export function ImageGrid() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="relative grid h-screen w-full grid-cols-2 overflow-hidden">
      <div className="flex flex-col animate-scroll-up py-4">
        {COLUMN_1.map((src, i) => (
          <div key={`col1-${i}`} className="relative w-full overflow-hidden">
            <img
              src={src}
              alt={`Task preview ${i + 1}`}
              className="h-full w-full object-cover brightness-75 transition-all duration-300 hover:brightness-100"
            />
          </div>
        ))}
      </div>
      <div className="flex flex-col animate-scroll-down py-4">
        {COLUMN_2.map((src, i) => (
          <div key={`col2-${i}`} className="relative w-full overflow-hidden">
            <img
              src={src}
              alt={`Task preview ${i + 1}`}
              className="h-full w-full object-cover brightness-75 transition-all duration-300 hover:brightness-100"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
