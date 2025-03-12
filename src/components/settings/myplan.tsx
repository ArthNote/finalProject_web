import { useLocale, useTranslations } from "next-intl";
import React, { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { CreditCardIcon, HelpCircle, Rocket, Trash } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  cancelSubscription,
  changeBillingMode,
  getSubscription,
} from "@/lib/api/subscriptions";
import { ErrorState } from "../error_state";
import EmptyState from "../empty_state";
import ChoosePlan from "./choosePlan";
import ChangePlan from "./changePlan";
import { formatDate } from "@/lib/dateFormate";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "../ui/dialog";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Label } from "../ui/label";
import { toast } from "@/hooks/use-toast";
import AlertDialogDelete from "../alert-dialog-delete";
import BillingInfo from "./billing_info";
import { PlanSkeleton } from "./plan-skeleton";

const MyPlanTab = () => {
  const t = useTranslations("settings.plan");
  const { data } = authClient.useSession();
  const locale = useLocale() as "en" | "fr";
  const [changePlanDialogOpen, setChangePlanDialogOpen] = useState(false);
  const [billingDialogOpen, setBillingDialogOpen] = useState(false);

  const queryClient = useQueryClient();

  const {
    data: subscription,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["subscription"],
    queryFn: getSubscription,
    refetchOnWindowFocus: true,
  });

  // Initialize with undefined and update when subscription data is available
  const [billingPreference, setBillingPreference] = useState<"auto" | "manual">(
    "auto"
  );

  // Update billingPreference when subscription data changes
  useEffect(() => {
    if (subscription?.data) {
      setBillingPreference(subscription.data.autoRenew ? "auto" : "manual");
    }
  }, [subscription?.data]);

  const { mutate: updateBilling, isPending: isUpdating } = useMutation({
    mutationFn: changeBillingMode,
    onSuccess: () => {
      toast({
        title: t("manage.billing.toast.success.title"),
        description: t("manage.billing.toast.success.description"),
        variant: "default",
      });
      setBillingDialogOpen(false);
      queryClient.invalidateQueries({ queryKey: ["subscription"] });
    },
    onError: (error) => {
      toast({
        title: t("manage.billing.toast.error.title"),
        description:
          t("manage.billing.toast.error.description") + " " + error.message,
        variant: "destructive",
      });
    },
  });

  const { mutate: cancelSub, isPending: isCancelling } = useMutation({
    mutationFn: cancelSubscription,
    onSuccess: (data) => {
      // toast({
      //   title: t("manage.cancel.toast.success.title"),
      //   description: t("manage.cancel.toast.success.description"),
      //   variant: "default",
      // });
      window.location.href = data.link!;
      setBillingDialogOpen(false);
    },
    onError: (error) => {
      toast({
        title: t("manage.cancel.toast.error.title"),
        description:
          t("manage.cancel.toast.error.description") + " " + error.message,
        variant: "destructive",
      });
    },
  });

  if (isLoading) {
    return <PlanSkeleton />;
  }

  if (error && subscription?.success === false) {
    return ErrorState({
      title: t("errorState.title"),
      description: t("errorState.description"),
      action: t("errorState.action"),
      retryAction: () => refetch(),
    });
  }

  if (subscription?.success && !subscription?.data) {
    return <ChoosePlan />;
  }

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
              <p className="font-medium">
                {t(`currentSubscription.${subscription?.data!.plan}`)}
              </p>
              <p className="text-sm text-muted-foreground">
                {"$" +
                  subscription?.data!.price +
                  "/" +
                  subscription?.data!.billing}{" "}
                •{" "}
                {subscription?.data!.status === "active"
                  ? t("currentSubscription.renews", {
                      date: formatDate(
                        subscription!.data!.periodEnd as Date,
                        "medium",
                        locale
                      ),
                    })
                  : t("currentSubscription.freeTrial", {
                      date: formatDate(
                        subscription!.data!.periodEnd as Date,
                        "medium",
                        locale
                      ),
                    })}{" "}
              </p>
            </div>
            <Button
              variant="outline"
              onClick={() => setChangePlanDialogOpen(true)}
            >
              <Rocket className="mr-2 h-4 w-4" />
              {t("currentSubscription.changePlan")}
            </Button>
          </div>
          <Separator />
          {/* <div className="space-y-4">
            <h4 className="text-sm font-medium">{t("features.title")}</h4>
            <div className="grid gap-2">
              {[{ label: t("features.unlimited"), value: "✓" },
                { label: t("features.team"), value: t("features.values.members") },
                { label: t("features.storage"), value: t("features.values.storage") },
                { label: t("features.ai"), value: t("features.values.credits") },].map((feature) => (
                <div
                  key={feature.label}
                  className="flex justify-between text-sm"
                >
                  <span className="text-muted-foreground">{feature.label}</span>
                  <span className="font-medium">{feature.value}</span>
                </div>
              ))}

            </div>
          </div> */}
        </div>
      </div>

      {/* <Separator className="my-6" /> */}

      {/* Payment & Billing Information */}
      <BillingInfo />

      <Separator className="my-6" />

      {/* Manage Subscription */}
      <div className="space-y-6">
        <div className="grid gap-6 lg:grid-cols-3 pl-1">
          {/* Billing Section */}
          <div className="flex flex-col h-full">
            <div className="space-y-4">
              <h4 className="text-base font-medium">
                {t("manage.billing.title")}
              </h4>
              <p className="text-sm text-muted-foreground">
                {t("manage.billing.description")}
              </p>
            </div>
            <div className="mt-auto pt-4">
              <Button
                variant="outline"
                className="w-full"
                onClick={() => setBillingDialogOpen(true)}
              >
                <CreditCardIcon />
                {t("manage.billing.update")}
              </Button>
            </div>
          </div>

          {/* Support Section */}
          <div className="flex flex-col h-full">
            <div className="space-y-4">
              <h4 className="text-base font-medium">
                {t("manage.support.title")}
              </h4>
              <p className="text-sm text-muted-foreground">
                {t("manage.support.description")}
              </p>
            </div>
            <div className="mt-auto pt-4">
              <Button variant="outline" className="w-full">
                <HelpCircle />
                {t("manage.support.contact")}
              </Button>
            </div>
          </div>

          {/* Cancel Section */}
          <div className="flex flex-col h-full">
            <div className="space-y-4">
              <h4 className="text-base font-medium">
                {t("manage.cancel.title")}
              </h4>
              <p className="text-sm text-muted-foreground">
                {t("manage.cancel.shortDescription")}
              </p>
            </div>
            <div className="mt-auto pt-4">
              <AlertDialogDelete
                title={t("manage.cancel.title")}
                description={t("manage.cancel.description")}
                deleteT={
                  isCancelling
                    ? t("manage.cancel.processing")
                    : t("manage.cancel.confirm")
                }
                cancel={t("manage.cancel.cancel")}
                onDelete={cancelSub}
                isDeleting={isCancelling}
              >
                <Button variant="destructive" className="w-full">
                  <Trash />
                  {t("manage.cancel.confirm")}
                </Button>
              </AlertDialogDelete>
            </div>
          </div>
        </div>
      </div>

      {/* Change Plan Dialog */}
      <Dialog
        open={changePlanDialogOpen}
        onOpenChange={setChangePlanDialogOpen}
      >
        <DialogContent className="sm:max-w-[90vw] md:max-w-[800px] lg:max-w-[1000px] max-h-[90vh] overflow-y-auto p-4 sm:p-6 gap-10">
          <DialogHeader>
            <DialogTitle>{t("changePlan.title")}</DialogTitle>
            <DialogDescription>{t("changePlan.description")}</DialogDescription>
          </DialogHeader>
          <ChangePlan
            onClose={() => setChangePlanDialogOpen(false)}
            currentPlan={subscription?.data!.plan}
            currentBilling={subscription?.data!.billing}
            subId={subscription?.data!.stripeSubscriptionId!}
          />
        </DialogContent>
      </Dialog>

      {/* Billing Preferences Dialog */}
      <Dialog
        open={billingDialogOpen}
        onOpenChange={(open) => {
          setBillingDialogOpen(open);
          // Reset to current subscription value when dialog closes
          if (!open && subscription?.data) {
            setBillingPreference(
              subscription.data.autoRenew ? "auto" : "manual"
            );
          }
        }}
      >
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>{t("manage.billing.title")}</DialogTitle>
            <DialogDescription>
              {t("manage.billing.description")}
            </DialogDescription>
          </DialogHeader>
          <form>
            <RadioGroup
              value={billingPreference}
              onValueChange={(value) =>
                setBillingPreference(value as "auto" | "manual")
              }
              name="billing-preference"
              className="gap-4 my-6 grid"
              defaultValue={subscription?.data?.autoRenew ? "auto" : "manual"}
            >
              {[
                {
                  value: "auto",
                  id: "dialog-automatic-billing",
                  title: t("manage.billing.auto.label"),
                  description: t("manage.billing.auto.description"),
                  isDefault: subscription?.data?.autoRenew ? true : false,
                },
                {
                  value: "manual",
                  id: "dialog-manual-billing",
                  title: t("manage.billing.manual.label"),
                  description: t("manage.billing.manual.description"),
                  isDefault: subscription?.data?.autoRenew ? false : true,
                },
              ].map((option) => (
                <div key={option.id} className="group">
                  <Label
                    htmlFor={option.id}
                    className={`border rounded-lg p-4 cursor-pointer relative flex flex-col gap-1.5 transition-all hover:border-primary/30
                    ${
                      billingPreference === option.value
                        ? "border-primary bg-primary/5"
                        : "hover:bg-muted/30"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="font-medium text-base flex items-center gap-2">
                        <div
                          className={`w-4 h-4 rounded-full border ${
                            billingPreference === option.value
                              ? "border-primary"
                              : "border-input"
                          } flex items-center justify-center`}
                        >
                          {billingPreference === option.value && (
                            <div className="w-2 h-2 rounded-full bg-primary" />
                          )}
                        </div>
                        <div className="flex items-center">
                          {option.title}
                          {option.isDefault && (
                            <span className="text-xs text-muted-foreground ml-2 bg-muted px-1.5 py-0.5 rounded">
                              {t("manage.billing.default")}
                            </span>
                          )}
                        </div>
                      </div>
                      <RadioGroupItem
                        value={option.value}
                        id={option.id}
                        className="sr-only"
                        disabled={isUpdating}
                      />
                    </div>
                    <p className="text-sm text-muted-foreground ml-6">
                      {option.description}
                    </p>
                  </Label>
                </div>
              ))}
            </RadioGroup>

            <div className="flex justify-end gap-3 mt-6">
              <DialogClose asChild>
                <Button type="button" variant="outline" disabled={isUpdating}>
                  {t("manage.billing.cancel")}
                </Button>
              </DialogClose>

              <Button
                type="button"
                disabled={isUpdating}
                onClick={() => updateBilling({ mode: billingPreference })}
              >
                {isUpdating
                  ? t("manage.billing.saving")
                  : t("manage.billing.save")}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MyPlanTab;
