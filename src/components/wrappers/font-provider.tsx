"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { type FontSetting } from "@/lib/fonts";

type FontContextType = {
  font: FontSetting;
  setFont: (font: FontSetting) => void;
};

const FontContext = createContext<FontContextType | undefined>(undefined);

export function FontProvider({ children }: { children: React.ReactNode }) {
  const [font, setFont] = useState<FontSetting>(() => {
    if (typeof window !== "undefined") {
      return (localStorage.getItem("font") as FontSetting) || "geist";
    }
    return "geist";
  });

  useEffect(() => {
    localStorage.setItem("font", font);
    document.body.classList.remove(
      "font-geist",
      "font-playfair",
      "font-crimson",
      "font-space",
      "font-exo",
      "font-fira",
      "font-dm"
    );
    document.body.classList.add(`font-${font}`);
  }, [font]);

  return (
    <FontContext.Provider value={{ font, setFont }}>
      {children}
    </FontContext.Provider>
  );
}

export function useFont() {
  const context = useContext(FontContext);
  if (!context) throw new Error("useFont must be used within FontProvider");
  return context;
}
