"use client";

import React from "react";
import Image from "next/image";
import { BorderBeam } from "../ui/border-beam";

import lightPic from "../../../public/lightDash3.png";
import darkPic from "../../../public/darkDash.png";
import { useTheme } from "next-themes";

const AppImage = () => {
  const { resolvedTheme } = useTheme();
  const imgSrc = resolvedTheme === "dark" ? darkPic : lightPic;
  return (
    <div className="pb-6 sm:pb-16 pt-10 px-3 sm:px-0">
      <div className="rounded-xl md:bg-muted/30 md:p-3.5 md:ring-1 md:ring-inset md:ring-border">
        <div className="relative overflow-hidden rounded-xl border md:rounded-lg w-full max-w-[1600px] mx-auto">
          <Image
            className="w-full h-auto object-contain dark:opacity-85"
            src={imgSrc}
            alt="preview landing"
            width={1600}
            height={800}
            priority={true}
          />
          {/* <BorderBeam size={250} delay={9} duration={15} /> */}
        </div>
      </div>
    </div>
  );
};

export default AppImage;
