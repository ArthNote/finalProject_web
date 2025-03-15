"use client";

import { useTranslations } from "next-intl";
import { motion } from "motion/react";
import { Brain, Workflow, Focus, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";

const AboutUs = () => {
  const t = useTranslations("HomePage.aboutUs");

  return (
    <section id="about" className="relative py-24">
      <div className="container mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative"
        >
          <div className="text-center">
            <span className="block text-sm font-medium text-primary/80 mb-3 tracking-wider uppercase">
              {t("subtitle")}
            </span>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight relative inline-block">
              {t("mainTitle")}
              <div className="absolute -bottom-2 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
            </h2>
          </div>
          {/* <div className="text-center">
            <span className="inline-block px-4 py-1.5 mb-4 text-sm font-medium rounded-full text-primary bg-primary/5">
              {t("subtitle")}
            </span>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
              {t("mainTitle")}
            </h2>
          </div> */}
        </motion.div>

        {/* Main Content */}
        <div className="mt-16 max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left Column */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <div className="relative">
                <h3 className="text-2xl font-semibold mb-3">
                  {t("story.title")}
                </h3>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  {t("story.description")}
                </p>
              </div>
              <div className="relative">
                <h3 className="text-2xl font-semibold mb-3">
                  {t("vision.title")}
                </h3>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  {t("vision.description")}
                </p>
              </div>
            </motion.div>

            {/* Right Column */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="grid grid-cols-2 gap-4">
                {[
                  { icon: Brain, text: t("highlights.ai") },
                  { icon: Workflow, text: t("highlights.workflow") },
                  { icon: Focus, text: t("highlights.focus") },
                  { icon: Users, text: t("highlights.team") },
                ].map((item, index) => (
                  <div
                    key={index}
                    className="p-6 rounded-xl bg-background/50 backdrop-blur-sm border border-primary/5 hover:border-primary/20 transition-all duration-300 hover:bg-primary/[0.02] group"
                  >
                    <div className="p-3 rounded-lg bg-primary/5 w-fit mb-4 transition-all duration-300 group-hover:bg-primary/10">
                      <item.icon className="w-6 h-6 text-primary transition-transform duration-300 group-hover:scale-110" />
                    </div>
                    <p className="font-medium">{item.text}</p>
                  </div>
                ))}
              </div>

              {/* Decorative elements */}
              <div className="absolute -z-10 inset-0 blur-3xl opacity-20">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/30 via-transparent to-secondary/30" />
              </div>
            </motion.div>
          </div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-16 text-center"
          >
            <p className="text-xl mb-6">{t("cta")}</p>
            <Link href="/signup">
              <Button size="lg" className="rounded-full px-8">
                Get Started
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;
