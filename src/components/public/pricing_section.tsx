"use client";

import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import {
  Check,
  Rocket,
  Users,
  Building,
  Sparkles,
  LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "motion/react";
import { useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "@/i18n/routing";

interface PriceCardProps {
  plan: "individual" | "team" | "enterprise";
  icon: LucideIcon;
  featured?: boolean;
}

const PricingSection = () => {
  const t = useTranslations("HomePage.pricing");
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">(
    "monthly"
  );

  const PriceCard = ({
    plan,
    icon: Icon,
    featured = false,
  }: PriceCardProps) => {
    const isEnterprise = plan === "enterprise";

    const PriceDisplay = () => {
      if (isEnterprise) {
        return (
          <div className="mt-4 flex items-center gap-1.5">
            <span className="text-xl font-medium">
              {t("plans.enterprise.priceLabel")}
            </span>
          </div>
        );
      }

      const price =
        billingCycle === "monthly"
          ? t(`plans.${plan}.price`)
          : t(`plans.${plan}.yearlyPrice`);

      return (
        <div className="mt-4 flex flex-col gap-2">
          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl font-bold">{price}</span>
            <span className="text-sm text-muted-foreground font-medium">
              {billingCycle === "monthly" ? t("monthly") : t("yearly")}
            </span>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <div className="h-1 w-1 rounded-full bg-primary"></div>
            <span>{t("freeTrial.info")}</span>
          </div>
        </div>
      );
    };

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: featured ? 0.2 : 0, duration: 0.3 }}
        className={cn(
          "relative rounded-xl border bg-card/50 backdrop-blur-sm p-8 transition-all duration-300",
          featured
            ? "border-primary shadow-lg dark:shadow-primary/10"
            : "hover:border-primary/50"
        )}
      >
        {/* Free trial badge with credit card icon
        <div className="absolute -top-3 right-4 z-10">
          <div className="relative px-3 py-1 bg-primary/10 text-xs font-medium rounded-full flex items-center gap-1.5">
            <svg
              className="h-3 w-3 text-primary"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
              <line x1="1" y1="10" x2="23" y2="10" />
            </svg>
            {t("freeTrial.badge")}
          </div>
        </div> */}

        {featured && (
          <div className="absolute -top-3 left-0 right-0 mx-auto w-fit px-4 py-1 bg-primary rounded-full">
            <span className="text-xs font-medium text-primary-foreground flex items-center gap-1.5">
              <Sparkles className="h-3 w-3" />
              {t("popular")}
            </span>
          </div>
        )}

        <div className="flex flex-col h-full">
          <div>
            <div
              className={cn(
                "w-fit p-2.5 rounded-lg mb-4 transition-colors",
                featured ? "bg-primary/10" : "bg-secondary"
              )}
            >
              <Icon
                className={cn(
                  "w-5 h-5",
                  featured ? "text-primary" : "text-secondary-foreground"
                )}
              />
            </div>

            <h3 className="text-xl font-semibold">
              {t(`plans.${plan}.title`)}
            </h3>
            <p className="text-sm text-muted-foreground mt-1.5">
              {t(`plans.${plan}.highlight`)}
            </p>

            <PriceDisplay />
          </div>

          <div className="mt-6 space-y-3 flex-1">
            {Object.keys(t.raw(`plans.${plan}.features`)).map((featureKey) => (
              <div key={featureKey} className="flex gap-2.5 items-start group">
                <div
                  className={cn(
                    "rounded-full p-1 transition-colors",
                    featured
                      ? "bg-primary/10 text-primary"
                      : "bg-secondary text-secondary-foreground"
                  )}
                >
                  <Check className="h-3 w-3" />
                </div>
                <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                  {t(`plans.${plan}.features.${featureKey}`)}
                </span>
              </div>
            ))}
          </div>

          <Link
            href={
              plan === "enterprise"
                ? "/contact"
                : {
                    pathname: "/signup",
                    query: {
                      plan: plan,
                      billing: billingCycle,
                    },
                  }
            }
          >
            <Button
              className="mt-8 w-full transition-all duration-300 bg-primary hover:bg-primary/90 shadow-sm hover:shadow-lg"
              size="lg"
            >
              {plan === "enterprise" ? t("contactUs") : t("getStarted")}
            </Button>
          </Link>
        </div>
      </motion.div>
    );
  };

  return (
    <section id="pricing" className="relative pt-10 pb-20">
      <div className="container">
        <div className="text-center space-y-8 mb-16">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col items-center gap-4"
          >
            <div className="inline-block">
              {/* <span className="block text-sm font-medium text-primary/80 mb-3 tracking-wider uppercase">
                {t("subtitle")}
              </span> */}
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight relative inline-block">
                {t("title")}
                <div className="absolute -bottom-2 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
              </h2>
              <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
                {t("description")}
              </p>
            </div>

            <Tabs
              defaultValue="monthly"
              value={billingCycle}
              onValueChange={(v) => setBillingCycle(v as "monthly" | "yearly")}
              className="mt-4"
            >
              <TabsList className="grid w-full max-w-[320px] grid-cols-2 h-11 rounded-4xl">
                <TabsTrigger value="monthly" className="text-sm rounded-4xl">
                  {t("billing.monthly")}
                </TabsTrigger>
                <TabsTrigger
                  value="yearly"
                  className="relative text-sm rounded-4xl"
                >
                  {t("billing.yearly")}
                  <span className="absolute -top-6 rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary whitespace-nowrap">
                    {t("billing.saveText")}
                  </span>
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </motion.div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <PriceCard plan="individual" icon={Rocket} />
          <PriceCard plan="team" icon={Users} featured />
          <PriceCard plan="enterprise" icon={Building} />
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
