"use client";
import { Link } from "@/i18n/routing";
import React, { use, useEffect, useState } from "react";
import { GiHamburgerMenu } from "react-icons/gi";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
// import { UserProfile } from "../user-profile";
import { BlocksIcon, CompassIcon } from "lucide-react";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";

import { cn } from "@/lib/utils";
import { useScroll } from "@/hooks/use-scroll";
import { consts } from "@/lib/constants";
import { log } from "console";
import { useTranslations } from "next-intl";
import { CombinedToggle } from "@/components/combined_toggle";

interface NavBarProps {
  scroll?: boolean;
  large?: boolean;
}

export default function NavBar({ scroll = true }: NavBarProps) {
  const scrolled = useScroll(50);
  const t = useTranslations("Navigation");

  return (
    <div
      className={`flex min-w-full fixed justify-between p-2 border-b z-10 sm:px-24 md:px-32 lg:px-48 xl:px-64 px-2 bg-background/60 backdrop-blur-xl transition-all ${
        scroll ? (scrolled ? "border-b" : "bg-transparent") : "border-b"
      }`}
    >
      <Link
        href="/"
        className="pl-2 flex items-center gap-2 min-[825px]:hidden group"
        aria-label={consts.appName}
      >
        <CompassIcon
          aria-hidden="true"
          className="text-primary group-hover:-rotate-12 transition-all duration-300"
        />
        <h1 className="text-md font-medium group-hover:translate-x-0.5 transition-all duration-300">
          {consts.appName}
        </h1>
      </Link>
      <NavigationMenu className="gap-2">
        <NavigationMenuList className="max-[825px]:hidden flex gap-3 w-[100%] justify-between">
          <Link
            href="/"
            className="pl-2 flex items-center gap-2 group"
            aria-label={consts.appName}
          >
            <CompassIcon
              aria-hidden="true"
              className="text-primary group-hover:-rotate-12 transition-all duration-300"
            />
            <h1 className="text-md font-medium group-hover:translate-x-0.5 transition-all duration-300">
              {consts.appName}
            </h1>
          </Link>
        </NavigationMenuList>
      </NavigationMenu>
      <div className="flex items-center gap-2">
        <CombinedToggle />
        <Link href="/signin" legacyBehavior passHref>
          <Button>{t("signin")}</Button>
        </Link>
      </div>
    </div>
  );
}

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-hidden transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";
