"use client";

import { motion } from "motion/react";
import { useTranslations } from "next-intl";
import { Card, CardContent } from "@/components/ui/card";
import {
  Brain,
  Edit3,
  Trophy,
  Laptop,
  KeyRound,
  BarChart3,
} from "lucide-react";

const FeatureSection = () => {
  const t = useTranslations("HomePage.features");

  const features = [
    { icon: Brain, key: "ai" },
    { icon: Edit3, key: "smart" },
    { icon: Trophy, key: "gamified" },
    { icon: Laptop, key: "sync" },
    { icon: KeyRound, key: "auth" },
    { icon: BarChart3, key: "insights" },
  ];

  return (
    <section id="features" className="container mx-auto py-24 relative">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
        className="text-center mb-16 relative"
      >
        <div className="inline-block">
          <span className="block text-sm font-medium text-primary/80 mb-3 tracking-wider uppercase">
            {t("subtitle")}
          </span>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight relative inline-block">
            {t("title")}
            <div className="absolute -bottom-2 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
          </h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            {t("description")}
          </p>
        </div>
      </motion.div>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 relative">
        {features.map((feature, index) => (
          <motion.div
            key={feature.key}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            viewport={{ once: true }}
            className="relative group/card flex"
          >
            <div className="absolute -inset-0.5 rounded-xl bg-gradient-to-br from-primary/5 to-primary/5 opacity-0 group-hover/card:opacity-100 blur-xl transition-all duration-500" />

            <Card className="w-full transition-all duration-500 hover:-translate-y-1 group">
              <CardContent className="p-6 relative group-hover:scale-[1.01] transition-transform duration-500">
                <div className="flex flex-col gap-4">
                  <div className="p-3 bg-primary/5 rounded-lg w-fit transition-all duration-500 relative overflow-hidden group-hover:bg-primary/10">
                    <feature.icon className="w-6 h-6 text-primary relative z-10 transition-transform duration-500 group-hover:scale-110" />
                  </div>

                  <h3 className="text-xl font-semibold">
                    {t(`${feature.key}.title`)}
                  </h3>

                  <p className="text-muted-foreground">
                    {t(`${feature.key}.description`)}
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default FeatureSection;
