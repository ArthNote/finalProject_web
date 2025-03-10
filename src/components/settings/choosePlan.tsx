import { Button } from "@/components/ui/button";
import { useLocale, useTranslations } from "next-intl";
import {
  Check,
  Rocket,
  Users,
  Building,
  Sparkles,
  LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState, useEffect, useTransition } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import { useRouter, useSearchParams } from "next/navigation";
import { start } from "repl";
import { authClient } from "@/lib/auth-client";

interface PlanCardProps {
  plan: "individual" | "team" | "enterprise";
  icon: LucideIcon;
  featured?: boolean;
  selected?: boolean;
  onSelect: () => void;
}

const ChoosePlan = () => {
  const t = useTranslations("HomePage.pricing");
  const tT = useTranslations("settings.plan");
  const { toast } = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isSubmitting, startTransition] = useTransition();
  const locale = useLocale() as "en" | "fr";

  // Get values from URL search params
  const selectedPlan = searchParams.get("plan") || "individual";
  const billingCycle =
    (searchParams.get("billing") as "monthly" | "yearly") || "monthly";

  const updateSearchParams = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set(key, value);
    router.push(`?${params.toString()}`, { scroll: false });
  };

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    let updated = false;

    if (!params.has("plan")) {
      params.set("plan", "individual");
      updated = true;
    }

    if (!params.has("billing")) {
      params.set("billing", "monthly");
      updated = true;
    }

    if (updated) {
      router.push(`?${params.toString()}`, { scroll: false });
    }
  }, [searchParams, router]);

  const handleSelectPlan = (plan: string) => {
    updateSearchParams("plan", plan);
  };

  const handleSelectBilling = (billing: string) => {
    updateSearchParams("billing", billing as string);
  };

  const handleConfirmSelection = async () => {
    startTransition(async () => {
      const { error } = await authClient.subscription.upgrade({
        plan: selectedPlan,
        successUrl: `${process.env.NEXT_PUBLIC_FRONTEND_URL}/${locale}/success?type=subscription`,
        uiMode: "hosted",
        cancelUrl: `${process.env.NEXT_PUBLIC_FRONTEND_URL}/${locale}/settings?tab=myplan&plan=${selectedPlan}&billing=${billingCycle}`,
        annual: billingCycle === "yearly",
      });

      if (error) {
        toast({
          title: tT("toast.error.title"),
          description: tT("toast.error.title") + " " + error.message,
          variant: "destructive",
        });
        return;
      }

      toast({
        title: tT("toast.success.title"),
        description: tT("toast.success.title"),
      });
    });
  };

  const PlanCard = ({
    plan,
    icon: Icon,
    featured = false,
    selected = false,
    onSelect,
  }: PlanCardProps) => {
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
      <div
        onClick={onSelect}
        className={cn(
          "relative rounded-xl border bg-card/50 p-8 transition-all duration-300 cursor-pointer",
          featured
            ? "border-primary shadow-lg dark:shadow-primary/10"
            : "hover:border-primary/50",
          selected && "ring-2 ring-primary ring-offset-2"
        )}
      >
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

            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold">
                {t(`plans.${plan}.title`)}
              </h3>
              <RadioGroupItem
                value={plan}
                id={plan}
                className="h-5 w-5"
                checked={selected}
              />
            </div>

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
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4">
        <h2 className="text-2xl font-bold">{tT("noSubscription.title")}</h2>
        <p className="text-muted-foreground">
          {tT("noSubscription.description")}
        </p>

        <Tabs
          value={billingCycle}
          onValueChange={handleSelectBilling}
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
      </div>

      <RadioGroup
        value={selectedPlan}
        onValueChange={handleSelectPlan}
        className="grid gap-6 md:grid-cols-1 xl:grid-cols-3"
      >
        <PlanCard
          plan="team"
          icon={Users}
          selected={selectedPlan === "team"}
          onSelect={() => handleSelectPlan("team")}
        />
        <PlanCard
          plan="individual"
          icon={Rocket}
          featured
          selected={selectedPlan === "individual"}
          onSelect={() => handleSelectPlan("individual")}
        />
        <PlanCard
          plan="enterprise"
          icon={Building}
          selected={selectedPlan === "enterprise"}
          onSelect={() => handleSelectPlan("enterprise")}
        />
      </RadioGroup>

      <div className="flex justify-end gap-4">
        <Button onClick={handleConfirmSelection} disabled={isSubmitting}>
          {isSubmitting ? tT("noSubscription.submitting") : tT("noSubscription.action")}
        </Button>
      </div>
    </div>
  );
};

export default ChoosePlan;
