import { useTranslations } from "next-intl";
import React from "react";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { CreditCardIcon, Rocket } from "lucide-react";

const MyPlanTab = () => {
  const t = useTranslations("settings.plan");
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-medium tracking-tight">{t("title")}</h2>
        <p className="text-sm text-muted-foreground mt-2">{t("description")}</p>
      </div>

      {/* Current Subscription Details */}
      <div className="space-y-6">
        <h3 className="text-base font-medium">
          {t("currentSubscription.title")}
        </h3>
        <div className="space-y-6 pl-1">
          <div className="flex justify-between items-center">
            <div>
              <p className="font-medium">{t("currentSubscription.teamPlan")}</p>
              <p className="text-sm text-muted-foreground">
                {t("currentSubscription.renewalInfo")}
              </p>
            </div>
            <Button variant="outline">
              {t("currentSubscription.changePlan")}
            </Button>
          </div>
          <Separator />
          <div className="space-y-4">
            <h4 className="text-sm font-medium">{t("features.title")}</h4>
            <div className="grid gap-2">
              {[
                { label: t("features.unlimited"), value: "✓" },
                {
                  label: t("features.team"),
                  value: t("features.values.members"),
                },
                {
                  label: t("features.storage"),
                  value: t("features.values.storage"),
                },
                {
                  label: t("features.ai"),
                  value: t("features.values.credits"),
                },
              ].map((feature) => (
                <div
                  key={feature.label}
                  className="flex justify-between text-sm"
                >
                  <span className="text-muted-foreground">{feature.label}</span>
                  <span className="font-medium">{feature.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <Separator className="my-6" />

      {/* Payment & Billing Information */}
      <div className="space-y-6">
        <h3 className="text-base font-medium">{t("payment.title")}</h3>
        <div className="space-y-4 pl-1">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-muted rounded">
                <CreditCardIcon className="h-4 w-4" />
              </div>
              <div>
                <p className="font-medium">•••• 4242</p>
                <p className="text-sm text-muted-foreground">
                  {t("payment.expires", { date: "12/25" })}
                </p>
              </div>
            </div>
            <Button variant="ghost" size="sm">
              {t("payment.update")}
            </Button>
          </div>
          <Separator />
          <div>
            <h4 className="text-sm font-medium mb-3">
              {t("payment.billingHistory")}
            </h4>
            <div className="space-y-3">
              {[
                {
                  date: "Mar 1, 2025",
                  amount: "$49.00",
                  status: "Paid",
                },
                {
                  date: "Feb 1, 2025",
                  amount: "$49.00",
                  status: "Paid",
                },
                {
                  date: "Jan 1, 2025",
                  amount: "$49.00",
                  status: "Paid",
                },
              ].map((invoice) => (
                <div
                  key={invoice.date}
                  className="flex items-center justify-between text-sm"
                >
                  <span className="text-muted-foreground">{invoice.date}</span>
                  <div className="flex items-center gap-3">
                    <span>{invoice.amount}</span>
                    <Button variant="ghost" size="sm" className="h-7">
                      {t("payment.download")}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <Separator className="my-6" />

      {/* Manage Subscription */}
      <div className="space-y-6">
        <h3 className="text-base font-medium">{t("manage.title")}</h3>
        <div className="space-y-4 pl-1">
          <div className="flex flex-col gap-2">
            <Button variant="outline" className="justify-start">
              <Rocket className="mr-2 h-4 w-4" />
              {t("manage.upgrade")}
            </Button>
            <Button
              variant="outline"
              className="justify-start text-destructive hover:text-destructive"
            >
              {t("manage.cancel")}
            </Button>
          </div>
        </div>
      </div>

      <Separator className="my-6" />

      {/* Promotions & Support */}
      <div className="grid gap-10 md:grid-cols-2">
        <div className="space-y-6">
          <h3 className="text-base font-medium">
            {t("promotions.title")}
          </h3>
          <div className="space-y-4 pl-1">
            <p className="text-sm text-muted-foreground">
              {t("promotions.yearlyPromo")}
            </p>
            <Button variant="outline" className="w-full">
              {t("promotions.switchYearly")}
            </Button>
          </div>
        </div>

        <div className="space-y-6">
          <h3 className="text-base font-medium">{t("support.title")}</h3>
          <div className="space-y-4 pl-1">
            <p className="text-sm text-muted-foreground">
              {t("support.description")}
            </p>
            <Button variant="outline" className="w-full">
              {t("support.contact")}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyPlanTab;
