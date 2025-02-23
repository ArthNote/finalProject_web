"use client";
import { Link, usePathname, useRouter } from "@/i18n/routing";
import React, { useEffect, useState } from "react";
import { MenuIcon } from "lucide-react"; // Add this import at the top with other lucide imports
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { CompassIcon } from "lucide-react";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";

import { cn } from "@/lib/utils";
import { useScroll } from "@/hooks/use-scroll";
import { consts } from "@/lib/constants";
import { useTranslations } from "next-intl";
import { CombinedToggle } from "@/components/combined_toggle";
import { FaTasks } from "react-icons/fa";
import { HiMenu, HiOutlineMenuAlt1 } from "react-icons/hi";

interface NavBarProps {
  scroll?: boolean;
  large?: boolean;
}

export default function NavBar({ scroll = true }: NavBarProps) {
  const scrolled = useScroll(50);
  const t = useTranslations("navigation");
  const pathname = usePathname();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const links = [
    { title: t("sections.home"), link: "/" },
    { title: t("sections.pricing"), link: "/pricing" },
    { title: t("sections.contact"), link: "/contact" },
  ];

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted) {
    return (
      <div
        className={`flex min-w-full fixed justify-between p-2 border-b z-10 sm:px-24 md:px-32 lg:px-48 xl:px-64 px-2 bg-background/60 h-14 backdrop-blur-xl transition-all ${
          scroll ? "border-b" : ""
        }`}
      />
    );
  }

  return (
    <div
      className={`flex w-full fixed flex-row justify-between p-2 border-b z-50  md:px-16 lg:px-24 xl:px-36 2xl:px-64 px-2 bg-background/60 backdrop-blur-xl transition-all ${
        scroll ? (scrolled ? "border-b" : "bg-transparent") : "border-b"
      }`}
    >
      <div className="flex w-fit items-center lg:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button
              size="icon"
              variant="ghost"
              className="relative w-9 h-9 rounded-lg group flex items-center justify-center lg:hidden"
              aria-label={t("navbar.menu")}
            >
              <div className="flex flex-col gap-1">
                <div className="w-4 h-0.5 bg-foreground rounded-full transition-all duration-200 group-hover:w-5" />
                <div className="w-5 h-0.5 bg-foreground rounded-full" />
                <div className="w-4 h-0.5 bg-foreground rounded-full transition-all duration-200 group-hover:w-5" />
              </div>
            </Button>
          </SheetTrigger>
          <SheetContent side="left">
            <SheetHeader>
              <SheetTitle>
                <Link href="/" className="pl-2 flex items-center gap-2">
                  {/* <FaTasks className="text-primary" /> */}
                  <h1 className="text-md font-medium">{consts.appName}.</h1>
                </Link>
              </SheetTitle>
            </SheetHeader>
            <div className="flex flex-col space-y-3 mt-[1rem]">
              {links.map((link) => (
                <SheetClose asChild key={link.link}>
                  <Link href={link.link} className="w-full">
                    <Button variant="outline" className="w-full">
                      {link.title}
                    </Button>
                  </Link>
                </SheetClose>
              ))}
              <SheetClose asChild>
                <Link href="/signin" className="w-full">
                  <Button variant="default" className="w-full">
                    {t("signin")}
                  </Button>
                </Link>
              </SheetClose>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      <Link
        href="/"
        className="pl-2 items-center gap-2 flex flex-row group lg:hidden"
      >
        {/* <FaTasks
          aria-hidden="true"
          className="text-primary group-hover:-rotate-12 transition-all duration-300"
        /> */}
        <h1 className="text-md font-medium group-hover:translate-x-0.5 transition-all duration-300">
          {consts.appName}.
        </h1>
      </Link>

      <Link href="/" className="pl-2 hidden items-center gap-2 group lg:flex">
        {/* <FaTasks
          aria-hidden="true"
          className="text-primary group-hover:-rotate-12 transition-all duration-300"
        /> */}
        <h1 className="text-md font-medium group-hover:translate-x-0.5 transition-all duration-300">
          {consts.appName}.
        </h1>
      </Link>

      <NavigationMenu className="gap-2 w-full flex justify-between items-center hidden lg:flex">
        <NavigationMenuList className=" gap-3 justify-between ">
          {links.map((link) => (
            <NavigationMenuItem key={link.title}>
              <Link href={link.link} className="hidden lg:inline-flex">
                <Button variant="ghost">{link.title}</Button>
              </Link>
            </NavigationMenuItem>
          ))}
        </NavigationMenuList>
      </NavigationMenu>

      <div className="flex items-center gap-2">
        <CombinedToggle />
        <Link href="/signin" className="hidden lg:inline-flex">
          <Button>{t("signin")}</Button>
        </Link>
      </div>
    </div>
  );
}

const ListItem = React.forwardRef<
  React.ElementRef<typeof Link>,
  React.ComponentPropsWithoutRef<typeof Link>
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <Link
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
        </Link>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";
