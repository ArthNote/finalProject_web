"use client";

import { useTranslations } from "next-intl";
import { motion } from "motion/react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Wifi, WifiOff, Bell, LayoutGrid, Download } from "lucide-react";
import Image from "next/image";
import { FaAppStoreIos, FaGooglePlay } from "react-icons/fa";

const MobileAppSection = () => {
  const t = useTranslations("HomePage.mobileApp");

  const features = [
    { icon: Wifi, key: "sync" },
    { icon: WifiOff, key: "offline" },
    { icon: Bell, key: "notification" },
    { icon: LayoutGrid, key: "widgets" },
  ];

  return (
    <section className="container mx-auto py-24">
      <div className="grid lg:grid-cols-2 gap-12 items-center">
        {/* Content */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="space-y-8"
        >
          {/* Header */}
          <div>
            <span className="block text-sm font-medium text-primary/80 mb-3 tracking-wider uppercase">
              {t("subtitle")}
            </span>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight relative inline-block">
              {t("title")}
              <div className="absolute -bottom-2 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
            </h2>
            <p className="mt-4 text-lg text-muted-foreground max-w-xl">
              {t("description")}
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid sm:grid-cols-2 gap-4">
            {features.map((Feature) => (
              <Card key={Feature.key} className="p-4 border border-primary/10">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-primary/5 rounded-lg">
                    <Feature.icon className="w-5 h-5 text-primary" />
                  </div>
                  <span className="font-medium">
                    {t(`features.${Feature.key}`)}
                  </span>
                </div>
              </Card>
            ))}
          </div>

          {/* Download Section */}
          <div className="space-y-4">
            {/* Store Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                variant="outline"
                size="lg"
                className="flex items-center gap-2 hover:bg-primary hover:text-primary-foreground"
                asChild
              >
                <a href="#" target="_blank" rel="noopener noreferrer">
                  <FaGooglePlay />
                  {t("download.android")}
                </a>
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="flex items-center gap-2 hover:bg-primary hover:text-primary-foreground"
                asChild
              >
                <a href="#" target="_blank" rel="noopener noreferrer">
                  <FaAppStoreIos/>
                  {t("download.ios")}
                </a>
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="flex items-center gap-2 hover:bg-primary hover:text-primary-foreground"
                asChild
              >
                <a href="/app/taskflow.apk" target="_blank" rel="noopener noreferrer">
                  <Download className="w-4 h-4" />
                  {t("download.direct.button")}
                </a>
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Mobile Device Preview */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="relative h-[600px]"
        >
          {/* Phone Frame */}
          <div className="absolute inset-y-0 right-0 w-72 mx-auto">
            <div className="relative w-full h-full">
              {/* Phone Border */}
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-primary/5 rounded-[3rem] border-2 border-primary/10" />

              {/* Screen Content */}
              <div className="absolute inset-2 bg-background rounded-[2.8rem] overflow-hidden">
                {/* App UI Mockup */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-primary/5">
                  {/* Status Bar */}
                  <div className="h-12 px-6 flex items-center justify-between border-b border-primary/10">
                    <span className="text-sm font-medium">TaskFlow</span>
                    <div className="flex items-center gap-2">
                      <Wifi className="w-4 h-4" />
                      <span className="text-sm">4G</span>
                    </div>
                  </div>

                  {/* App Content */}
                  <div className="p-4 space-y-4">
                    {[...Array(4)].map((_, i) => (
                      <div
                        key={i}
                        className="h-20 rounded-lg bg-gradient-to-r from-primary/5 to-primary/10 animate-pulse"
                        style={{ animationDelay: `${i * 0.2}s` }}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Notch */}
              <div className="absolute top-4 inset-x-0 mx-auto w-32 h-6 bg-foreground rounded-full" />
            </div>
          </div>

          {/* Floating Elements */}
          <div className="absolute inset-0">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="absolute size-8 rounded-lg bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/10"
                style={{
                  top: `${20 + Math.random() * 60}%`,
                  left: `${20 + Math.random() * 40}%`,
                  transform: `rotate(${Math.random() * 45}deg)`,
                  animation: `float ${
                    3 + Math.random() * 2
                  }s ease-in-out infinite`,
                  animationDelay: `${i * 0.5}s`,
                }}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default MobileAppSection;
