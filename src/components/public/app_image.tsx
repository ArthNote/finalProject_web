import React from "react";
import Image from "next/image";
import { BorderBeam } from "../ui/border-beam";

const AppImage = () => {
  return (
    <div className="pb-6 sm:pb-16 pt-10 px-3 sm:px-0">
      <div className="rounded-xl md:bg-muted/30 md:p-3.5 md:ring-1 md:ring-inset md:ring-border">
        <div className="relative aspect-video overflow-hidden rounded-xl border md:rounded-lg">
          <Image
            className="size-full object-cover object-center dark:opacity-85"
            src="/seoulpic.svg"
            alt="preview landing"
            width={2000}
            height={1000}
            priority={true}
          />
          <BorderBeam size={250} delay={9} duration={15} />
        </div>
      </div>
    </div>
  );
};

export default AppImage;
