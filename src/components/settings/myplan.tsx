import { useTranslations } from "next-intl";
import React from "react";
import { Button } from "../ui/button";
import { CreditCardIcon, Rocket, CheckIcon } from "lucide-react";

const MyPlanTab = () => {
  const t = useTranslations("settings.plan");

  return (
    <div className="py-8 px-10">
      <div className="grid gap-12">
        <section className="space-y-6">
          <div>
            <h2 className="text-2xl font-medium">{t("title")}</h2>
            <p className="text-muted-foreground mt-2">{t("description")}</p>
          </div>

          {/* Current Subscription Details */}
          <div className="rounded-lg bg-muted/40 p-6 space-y-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h3 className="text-lg font-medium">{t("currentSubscription.teamPlan")}</h3>
                <p className="text-muted-foreground mt-1">
                  {t("currentSubscription.renewalInfo")}
                </p>
              </div>
              <Button variant="outline" size="lg">
                {t("currentSubscription.changePlan")}
              </Button>
            </div>

            <div className="space-y-4">
              <h4 className="text-lg font-medium">{t("features.title")}</h4>
              <div className="grid gap-3">
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
                    className="flex items-center justify-between px-4 py-2 hover:bg-background rounded-lg transition-colors"
                  >
                    <span className="text-muted-foreground">{feature.label}</span>
                    <span className="font-medium flex items-center gap-2">
                      {feature.value === "✓" ? (
                        <CheckIcon className="h-4 w-4 text-primary" />
                      ) : (
                        feature.value
                      )}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Payment & Billing Information */}
        <section className="space-y-6">
          <h2 className="text-2xl font-medium">{t("payment.title")}</h2>
          <div className="rounded-lg bg-muted/40 p-6 space-y-8">
            <div className="group hover:bg-background rounded-lg p-4 transition-colors">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-background rounded-md">
                    <CreditCardIcon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-medium">•••• 4242</p>
                    <p className="text-sm text-muted-foreground">
                      {t("payment.expires", { date: "12/25" })}
                    </p>
                  </div>
                </div>
                <Button variant="outline">
                  {t("payment.update")}
                </Button>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-lg font-medium px-4">
                {t("payment.billingHistory")}
              </h4>
              <div className="space-y-2">
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
                    className="flex items-center justify-between px-4 py-3 hover:bg-background rounded-lg transition-colors"
                  >
                    <span className="text-muted-foreground">{invoice.date}</span>
                    <div className="flex items-center gap-4">
                      <span className="font-medium">{invoice.amount}</span>
                      <Button variant="ghost" size="sm">
                        {t("payment.download")}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Manage Subscription */}
        <section className="space-y-6">
          <h2 className="text-2xl font-medium">{t("manage.title")}</h2>
          <div className="rounded-lg bg-muted/40 p-6 space-y-4">
            <div className="flex flex-col gap-3">
              <Button size="lg" variant="outline" className="justify-start">
                <Rocket className="mr-2 h-5 w-5" />
                {t("manage.upgrade")}
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="justify-start text-destructive hover:text-destructive"
              >
                {t("manage.cancel")}
              </Button>
            </div>
          </div>
        </section>

        {/* Promotions & Support */}
        <section className="grid gap-8 md:grid-cols-2">
          <div className="space-y-6">
            <h2 className="text-2xl font-medium">{t("promotions.title")}</h2>
            <div className="rounded-lg bg-muted/40 p-6 space-y-4">
              <p className="text-muted-foreground">
                {t("promotions.yearlyPromo")}
              </p>
              <Button size="lg" variant="outline" className="w-full">
                {t("promotions.switchYearly")}
              </Button>
            </div>
          </div>

          <div className="space-y-6">
            <h2 className="text-2xl font-medium">{t("support.title")}</h2>
            <div className="rounded-lg bg-muted/40 p-6 space-y-4">
              <p className="text-muted-foreground">
                {t("support.description")}
              </p>
              <Button size="lg" variant="outline" className="w-full">
                {t("support.contact")}
              </Button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default MyPlanTab;
