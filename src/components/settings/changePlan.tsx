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
import { useTransition } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { changePlan } from "@/lib/api/subscriptions";
import { useRouter } from "@/i18n/navigation";

interface PlanCardProps {
  plan: "individual" | "team" | "free";
  icon: LucideIcon;
  featured?: boolean;
  selected?: boolean;
  onSelect: () => void;
}

interface ChangePlanProps {
  onClose: () => void;
  currentPlan?: string;
  currentBilling?: string;
  subId: string;
}

const ChangePlan = ({
  onClose,
  currentPlan = "individual",
  currentBilling = "monthly",
  subId,
}: ChangePlanProps) => {
  const t = useTranslations("HomePage.pricing");
  const tT = useTranslations("settings.plan");
  const { toast } = useToast();
  // const [isSubmitting, startTransition] = useTransition();
  const queryClient = useQueryClient();
  const locale = useLocale() as "en" | "fr";
  const router = useRouter();

  // State for the selected plan and billing cycle
  const [selectedPlan, setSelectedPlan] = useState(
    currentPlan as "individual" | "team" | "free"
  );
  const [billingCycle, setBillingCycle] = useState(
    currentBilling as "monthly" | "yearly"
  );

  const handleSelectPlan = (plan: string) => {
    setSelectedPlan(plan as "individual" | "team" | "free");
  };

  const handleSelectBilling = (billing: string) => {
    setBillingCycle(billing as "monthly" | "yearly");
  };

  const { mutate, isPending } = useMutation({
    mutationFn: changePlan,
    onSuccess: () => {
      toast({
        title: tT("changePlan.toast.success.title"),
        description: tT("changePlan.toast.success.description"),
      });
      queryClient.invalidateQueries({ queryKey: ["subscription"] });
      router.push("/success?type=planChanged");
    },
    onError: (error) => {
      toast({
        title: tT("changePlan.toast.error.title"),
        description:
          tT("changePlan.toast.error.description") + " " + error.message,
        variant: "destructive",
      });
      onClose();
    },
  });

  const handleConfirmSelection = async () => {
    // Don't do anything if the selected plan and billing cycle are the same as the current ones
    if (selectedPlan === currentPlan && billingCycle === currentBilling) {
      onClose();
      return;
    }

    const indiMonth =
      selectedPlan === "individual" && billingCycle === "monthly";
    const indiYear = selectedPlan === "individual" && billingCycle === "yearly";
    const teamMonth = selectedPlan === "team" && billingCycle === "monthly";
    const teamYear = selectedPlan === "team" && billingCycle === "yearly";

    mutate({
      subscriptionId: subId,
      price: indiMonth
        ? 10
        : indiYear
        ? 96
        : teamMonth
        ? 25
        : teamYear
        ? 240
        : 0,
      billing: billingCycle === "monthly" ? "month" : "year",
    });

    // startTransition(async () => {
    //   const { error } = await authClient.subscription.upgrade({
    //     plan: selectedPlan,
    //     successUrl: `${process.env.NEXT_PUBLIC_FRONTEND_URL}/${locale}/success?type=planChanged`,
    //     uiMode: "hosted",
    //     cancelUrl: `${process.env.NEXT_PUBLIC_FRONTEND_URL}/${locale}/settings?tab=myplan`,
    //     annual: billingCycle === "yearly",
    //   });

    //   if (error) {
    //     toast({
    //       title: tT("changePlan.toast.error.title"),
    //       description:
    //         tT("changePlan.toast.error.description") + " " + error.message,
    //       variant: "destructive",
    //     });
    //     return;
    //   }

    //   toast({
    //     title: tT("changePlan.toast.success.title"),
    //     description: tT("changePlan.toast.success.description"),
    //   });

    //   onClose();
    // });
  };

  const PlanCard = ({
    plan,
    icon: Icon,
    featured = false,
    selected = false,
    onSelect,
  }: PlanCardProps) => {
    const isFree = plan === "free";

    const PriceDisplay = () => {
      if (isFree) {
        return (
          <div className="mt-4 flex items-center gap-1.5">
            <span className="text-xl font-medium">{t("plans.free.price")}</span>
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
    <div className="space-y-4 max-w-full">
      <Tabs
        value={billingCycle}
        onValueChange={handleSelectBilling}
        className="w-full"
      >
        <TabsList className="grid w-full max-w-[200px] grid-cols-2 h-10 rounded-4xl">
          <TabsTrigger
            value="monthly"
            className="text-xs sm:text-sm px-1 sm:px-3 rounded-4xl"
            disabled={isPending}
          >
            {t("billing.monthly")}
          </TabsTrigger>
          <TabsTrigger
            value="yearly"
            className="relative text-xs sm:text-sm px-1 sm:px-3 rounded-4xl"
            disabled={isPending}
          >
            {t("billing.yearly")}
            <span className="absolute -top-5 rounded-full bg-primary/10 px-1.5 sm:px-2 py-0.5 text-[10px] sm:text-xs font-medium text-primary whitespace-nowrap">
              {t("billing.saveText")}
            </span>
          </TabsTrigger>
        </TabsList>
      </Tabs>

      <RadioGroup
        value={selectedPlan}
        onValueChange={handleSelectPlan}
        className="grid gap-3 sm:gap-4 grid-cols-1  lg:grid-cols-3"
      >
        <PlanCard
          plan="free"
          icon={Users}
          selected={selectedPlan === "free"}
          onSelect={isPending ? () => {} : () => handleSelectPlan("free")}
        />
        <PlanCard
          plan="individual"
          icon={Rocket}
          featured
          selected={selectedPlan === "individual"}
          onSelect={isPending ? () => {} : () => handleSelectPlan("individual")}
        />
        <PlanCard
          plan="team"
          icon={Building}
          selected={selectedPlan === "team"}
          onSelect={isPending ? () => {} : () => handleSelectPlan("team")}
        />
      </RadioGroup>

      <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-4 pt-4">
        <Button variant="outline" onClick={onClose} disabled={isPending}>
          {tT("changePlan.cancel")}
        </Button>
        <Button
          onClick={handleConfirmSelection}
          disabled={
            isPending ||
            (selectedPlan === currentPlan &&
              (billingCycle === currentBilling ||
                (billingCycle === "yearly" && currentBilling === "year") ||
                (billingCycle === "monthly" && currentBilling === "month")))
          }
        >
          {isPending ? tT("changePlan.processing") : tT("changePlan.confirm")}
        </Button>
      </div>
    </div>
  );
};

export default ChangePlan;
