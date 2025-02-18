import { Geist } from "next/font/google";
import {
  Playfair_Display,
  Crimson_Pro,
  Space_Grotesk,
  Fira_Code,
  Exo_2,
  DM_Mono,
} from "next/font/google";

export const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

export const crimsonPro = Crimson_Pro({
  variable: "--font-crimson",
  subsets: ["latin"],
});

export const spaceGrotesk = Space_Grotesk({
  variable: "--font-space",
  subsets: ["latin"],
});

export const exo = Exo_2({
  variable: "--font-exo",
  subsets: ["latin"],
});

export const firaCode = Fira_Code({
  variable: "--font-fira",
  subsets: ["latin"],
});

export const dmMono = DM_Mono({
  variable: "--font-dm",
  weight: ["300", "400", "500"],
  subsets: ["latin"],
});

export type FontSetting =
  | "geist"
  | "playfair"
  | "crimson"
  | "space"
  | "exo"
  | "fira"
  | "dm";

export const fontOptions = [
  {
    value: "geist",
    label: "Geist Sans",
  },
  {
    value: "playfair",
    label: "Playfair Display",
  },
  {
    value: "crimson",
    label: "Crimson Pro",
  },
  {
    value: "space",
    label: "Space Grotesk",
  },
  {
    value: "exo",
    label: "Exo 2",
  },
  {
    value: "fira",
    label: "Fira Code",
  },
  {
    value: "dm",
    label: "DM Mono",
  },
];
