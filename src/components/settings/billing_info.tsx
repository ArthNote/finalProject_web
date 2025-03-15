import { CreditCardIcon } from "lucide-react";
import React from "react";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { useLocale, useTranslations } from "next-intl";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  changePaymentMethod,
  finalizeInvoice,
  getInvoices,
  getPaymentMethod,
} from "@/lib/api/subscriptions";
import { ErrorState } from "../error_state";
import EmptyState from "../empty_state";
import { PiInvoice } from "react-icons/pi";
import { formatDate } from "@/lib/dateFormate";
import { Badge } from "../ui/badge";
import { Link } from "@/i18n/navigation";
import { toast } from "@/hooks/use-toast";
import { Skeleton } from "../ui/skeleton";

// Create a BillingInfoSkeleton component within the same file
const BillingInfoSkeleton = () => {
  return (
    <div className="space-y-6">
      <Skeleton className="h-6 w-32" />
      <div className="space-y-4 pl-1">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Skeleton className="h-10 w-10 rounded" />
            <div>
              <div className="flex items-center gap-2">
                <Skeleton className="h-5 w-16" />
              </div>
              <Skeleton className="h-4 w-24 mt-1" />
            </div>
          </div>
          <Skeleton className="h-9 w-24" />
        </div>
        <Separator />
        <div>
          <Skeleton className="h-5 w-36 mb-3" />
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-5 w-16" />
                </div>
                <div className="flex items-center gap-3">
                  <Skeleton className="h-4 w-12" />
                  <Skeleton className="h-7 w-24" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const BillingInfo = () => {
  const t = useTranslations("settings.plan");
  const locale = useLocale() as "en" | "fr";
  const queryClient = useQueryClient();

  const {
    data: invoices,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["invoices"],
    queryFn: getInvoices,
    refetchOnWindowFocus: true,
  });

  const {
    data: card,
    isLoading: isLoadingCard,
    error: cardError,
    refetch: refetchCard,
  } = useQuery({
    queryKey: ["paymentMethod"],
    queryFn: getPaymentMethod,
    refetchOnWindowFocus: true,
  });

  function openLink(link: string) {
    window.open(link + "&locale=" + locale, "_blank", "noopener,noreferrer");
  }

  const { mutate: finalize, isPending: isFinalizing } = useMutation({
    mutationFn: finalizeInvoice,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["invoices"] });
      if (data.data) {
        openLink(data.data);
      }
    },
    onError: (error) => {
      toast({
        title: t("toast.error.title"),
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const { mutate: change, isPending: isChanging } = useMutation({
    mutationFn: changePaymentMethod,
    onSuccess: (data) => {
      if (data.link) {
        window.open(data.link, "_blank", "noopener,noreferrer");
      }
    },
    onError: (error) => {
      toast({
        title: t("toast.error.title"),
        description: error.message,
        variant: "destructive",
      });
    },
  });

  if (isLoading || isLoadingCard) {
    return <BillingInfoSkeleton />;
  }

  if (error && invoices?.success === false) {
    return ErrorState({
      title: t("errorStateInvoices.title"),
      description: t("errorStateInvoices.description"),
      action: t("errorStateInvoices.action"),
      retryAction: () => refetch(),
    });
  }

  if (invoices?.success && !invoices.data) {
    return (
      <EmptyState
        title={t("noInvoices.title")}
        description={t("noInvoices.description")}
        action={t("noInvoices.action")}
        icon={<PiInvoice className="h-4 w-4" />}
        actionHandler={refetch}
      />
    );
  }

  // Function to format credit card expiration date
  const formatExpiration = (
    month: number | string,
    year: number | string
  ): string => {
    // Ensure month is two digits with leading zero if needed
    const formattedMonth = String(month).padStart(2, "0");

    // Extract last two digits of the year
    const formattedYear = String(year).slice(-2);

    return `${formattedMonth}/${formattedYear}`;
  };

  return (
    <div className="space-y-6">
      <h3 className="text-base font-medium">{t("payment.title")}</h3>
      <div className="space-y-4 pl-1">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-muted rounded">
              {card?.data?.brand === "visa" ? (
                <div className="text-blue-600 font-bold text-xs">VISA</div>
              ) : card?.data?.brand === "mastercard" ? (
                <div className="text-orange-600 font-bold text-xs">MC</div>
              ) : (
                <CreditCardIcon className="h-4 w-4" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-medium">••••</span>
                <span>{card?.data?.last4}</span>
              </div>
              <p className="text-sm text-muted-foreground">
                {t("payment.expires", {
                  date: formatExpiration(
                    card?.data?.month || "",
                    card?.data?.year || ""
                  ),
                })}
              </p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={() => change()}>
            {t("payment.update")}
          </Button>
        </div>
        <Separator />
        <div>
          <h4 className="text-sm font-medium mb-3">
            {t("payment.billingHistory")}
          </h4>
          <div className="space-y-3">
            {invoices?.data!.map((invoice) => (
              <div
                key={invoice.id}
                className="flex items-center justify-between text-sm"
              >
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">
                    {formatDate(invoice.created, "short", locale)}
                  </span>
                  <Badge variant={invoice.paid ? "success" : "destructive"}>
                    {invoice.paid ? t("payment.paid") : t("payment.unpaid")}
                  </Badge>
                </div>
                <div className="flex items-center gap-3">
                  <span>${(invoice.amount / 100).toFixed(2)}</span>
                  {invoice.paid ? (
                    <Link href={invoice.invoicePdf!} target="_blank">
                      <Button variant="ghost" size="sm" className="h-7 w-24">
                        {t("payment.download")}
                      </Button>
                    </Link>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-7 w-24"
                      onClick={
                        invoice.invoiceUrl
                          ? () => openLink(invoice.invoiceUrl!)
                          : () => finalize(invoice.id)
                      }
                    >
                      {isFinalizing ? (
                        <span className="animate-spin">...</span>
                      ) : (
                        t("payment.pay")
                      )}
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BillingInfo;
