"use client";
import React, { useState, useTransition } from "react";
import ChangePasswordDialog from "./change_password_dialog";
import ConnectCredentialDialog from "./connect_credential_dialog";
import TwoFactorDialog from "./two_factor_dialog"; // Import the Two Factor Auth Dialog
import DisableTwoFactorDialog from "./disable_two_factor_dialog"; // Import the Disable Two Factor Auth Dialog
import { Switch } from "../ui/switch";
import { Button } from "../ui/button";
import { useToast } from "@/hooks/use-toast";
import { useLocale, useTranslations } from "next-intl";
import {
  FaGoogle,
  FaDiscord,
  FaFacebookF,
  FaGithub,
  FaMicrosoft,
  FaLinkedin,
  FaTwitter,
} from "react-icons/fa";
import { PiPasswordBold } from "react-icons/pi";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { authClient } from "@/lib/auth-client";
import { Skeleton } from "@/components/ui/skeleton";
import { deleteAccount, linkCredentials } from "@/lib/api/users";
import { cn } from "@/lib/utils";
import { SecuritySkeleton } from "./account-skeletons";

const AccountSecurity = () => {
  const { toast } = useToast();
  const t = useTranslations("settings.account");
  const tValidation = useTranslations();
  const [isPending, startTransition] = useTransition();
  const [pendingProvider, setPendingProvider] = useState<string | null>(null);
  const [credentialDialogOpen, setCredentialDialogOpen] = useState(false);
  const [twoFactorDialogOpen, setTwoFactorDialogOpen] = useState(false); // State for enable 2FA dialog
  const [disableTwoFactorDialogOpen, setDisableTwoFactorDialogOpen] =
    useState(false); // State for disable 2FA dialog
  const locale = useLocale() as "en" | "fr";
  const { data: session, isPending: sessionPending } = authClient.useSession();

  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["accounts"],
    queryFn: async () => {
      return authClient.listAccounts();
    },
  });

  // If either session is loading or accounts are loading, show skeleton

  // Count connected accounts
  const connectedAccountsCount = data?.data?.length || 0;

  const { mutate: removeAccount, isPending: isDeleting } = useMutation({
    mutationFn: deleteAccount,
    onSuccess: (co) => {
      toast({
        title: t("toast.disconnected.success.title"),
        description: t("toast.disconnected.success.description"),
      });
      setPendingProvider(null);
      queryClient.invalidateQueries({ queryKey: ["accounts"] });
    },
    onError: (error) => {
      toast({
        title: t("toast.disconnected.error.title"),
        description:
          t("toast.disconnected.error.description") + " " + error.message,
      });
      setPendingProvider(null);
    },
  });

  const { mutate: linkCredential, isPending: isLinking } = useMutation({
    mutationFn: linkCredentials,
    onSuccess: () => {
      toast({
        title: t("toast.connected.success.title"),
        description: t("toast.connected.success.description"),
      });
      setPendingProvider(null);
      setCredentialDialogOpen(false);
      queryClient.invalidateQueries({ queryKey: ["accounts"] });
    },
    onError: (error) => {
      toast({
        title: t("toast.connected.error.title"),
        description:
          t("toast.connected.error.description") + " " + error.message,
      });
      setPendingProvider(null);
      setCredentialDialogOpen(false);
    },
  });

  if (sessionPending || isLoading) {
    return <SecuritySkeleton />;
  }

  const providers = [
    { name: "Google", Icon: FaGoogle, value: "google" },
    { name: "Discord", Icon: FaDiscord, value: "discord" },
    { name: "Credentials", Icon: PiPasswordBold, value: "credential" },
    { name: "GitHub", Icon: FaGithub, value: "github" },
    { name: "LinkedIn", Icon: FaLinkedin, value: "linkedin" },
    { name: "Twitter", Icon: FaTwitter, value: "twitter" },
  ];

  type ProviderType = "google" | "discord" | "github" | "linkedin" | "twitter";

  const renderProviderSkeletons = () => {
    return Array(6)
      .fill(0)
      .map((_, i) => (
        <div
          key={`skeleton-${i}`}
          className="flex items-center justify-between p-3 border rounded-lg"
        >
          <div className="flex items-center gap-2">
            <Skeleton className="h-5 w-5 rounded-full" />
            <div>
              <Skeleton className="h-4 w-24 mb-1" />
              <Skeleton className="h-3 w-16" />
            </div>
          </div>
          <Skeleton className="h-8 w-24" />
        </div>
      ));
  };

  const handleConnectProvider = async (provider: ProviderType) => {
    setPendingProvider(provider);
    startTransition(async () => {
      const { error } = await authClient.linkSocial({
        provider: provider,
        callbackURL: `${process.env.NEXT_PUBLIC_FRONTEND_URL}/en/dashboard`,
      });

      if (error) {
        toast({
          title: t("toast.connected.error.title"),
          description:
            t("toast.connected.error.description", {
              provider: provider,
            }) +
            " " +
            error.message,
        });
      } else {
        toast({
          title: t("toast.connected.success.title"),
          description: t("toast.connected.success.description", {
            provider: provider,
          }),
        });

        queryClient.invalidateQueries({ queryKey: ["accounts"] });
      }
      setPendingProvider(null);
    });
  };

  const handleCredentialConnect = (username: string, password: string) => {
    setPendingProvider("credential");
    linkCredential({ username, password });
  };

  function handle2faSwitch() {
    // If 2FA is already enabled, we should show the disable dialog
    if (session?.user.twoFactorEnabled) {
      setDisableTwoFactorDialogOpen(true);
    } else {
      // Check if the user has password credentials enabled
      const hasCredentialsProvider = data?.data?.some(
        (account) => account.provider === "credential"
      );

      if (!hasCredentialsProvider) {
        toast({
          title: t("security.twoFactor.requiresCredential.title"),
          description: t("security.twoFactor.requiresCredential.description"),
          variant: "destructive",
        });
        return;
      } else {
        setTwoFactorDialogOpen(true);
      }
    }
  }

  async function handleVerifyEmail() {
    await authClient.sendVerificationEmail({
      email: session?.user.email!,
    });
    toast({
      title: t("security.verification.toast.sent.title"),
      description: t("security.verification.toast.sent.description"),
    });
  }

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-medium mb-1">{t("security.title")}</h3>
        <p className="text-sm text-muted-foreground">
          {t("security.description")}
        </p>
      </div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b pb-6">
        <div>
          <h4 className="text-sm font-medium">
            {t("security.password.title")}
          </h4>
          <p className="text-sm text-muted-foreground">
            {t("security.password.description")}
          </p>
        </div>
        <ChangePasswordDialog />
      </div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b pb-6">
        <div>
          <h4 className="text-sm font-medium">
            {t("security.verification.title")}
          </h4>
          <p className="text-sm text-muted-foreground">
            {t("security.verification.description")}
          </p>
        </div>
        <Button
          variant={session?.user.emailVerified ? "default" : "outline"}
          onClick={session?.user.emailVerified ? () => {} : handleVerifyEmail}
        >
          {session?.user.emailVerified
            ? t("security.verification.verified")
            : t("security.verification.verify")}
        </Button>
      </div>
      <div className="flex justify-between items-center border-b pb-6">
        <div>
          <h4 className="text-sm font-medium">
            {t("security.twoFactor.title")}
          </h4>
          <p className="text-sm text-muted-foreground">
            {t("security.twoFactor.description")}
          </p>
        </div>
        <Switch
          checked={session?.user.twoFactorEnabled || false}
          onCheckedChange={handle2faSwitch}
          disabled={isPending}
        />
      </div>
      <div>
        <h4 className="text-sm font-medium mb-4">
          {t("security.connectedAccounts.title")}
        </h4>
        <div className="grid gap-4 grid-cols-1 lg:grid-cols-3">
          {isLoading
            ? renderProviderSkeletons()
            : providers.map((provider) => {
                // Check if the provider is connected
                const connectedAccount = data?.data?.find(
                  (account) => account?.provider === provider.value
                );
                const isConnected = Boolean(connectedAccount);
                const isProviderPending = pendingProvider === provider.value;

                // Determine if this disconnect button should be disabled
                const isLastAccount =
                  isConnected && connectedAccountsCount === 1;

                return (
                  <div
                    key={provider.name}
                    className="flex items-center justify-between p-3 border rounded-lg transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <provider.Icon className="h-5 w-5" />
                      <div>
                        <p className="text-sm font-medium">{provider.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {isConnected
                            ? isLastAccount
                              ? t("security.connectedAccounts.connected") +
                                " " +
                                t("security.connectedAccounts.primary")
                              : t("security.connectedAccounts.connected")
                            : t("security.connectedAccounts.notConnected")}
                        </p>
                      </div>
                    </div>

                    <Button
                      variant={isConnected ? "destructive" : "outline"}
                      size="sm"
                      disabled={
                        isLoading ||
                        isPending ||
                        isDeleting ||
                        isLinking ||
                        isLastAccount
                      }
                      onClick={
                        isConnected
                          ? () => setPendingProvider(provider.value)
                          : provider.value === "credential"
                          ? () => setCredentialDialogOpen(true)
                          : () =>
                              handleConnectProvider(
                                provider.value as ProviderType
                              )
                      }
                    >
                      {isConnected ? (
                        isProviderPending ? (
                          <div className="mr-1 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                        ) : (
                          t("security.connectedAccounts.disconnect")
                        )
                      ) : (isProviderPending &&
                          provider.value === "credential") ||
                        (isProviderPending &&
                          provider.value === pendingProvider) ? (
                        <></>
                      ) : (
                        t("security.connectedAccounts.connect")
                      )}
                    </Button>
                  </div>
                );
              })}
        </div>
      </div>

      {/* Dialogs */}
      <ConnectCredentialDialog
        isOpen={credentialDialogOpen}
        onOpenChange={setCredentialDialogOpen}
        onConnect={handleCredentialConnect}
        isPending={isLinking}
        username={session?.user?.username || ""}
      />

      <TwoFactorDialog
        isOpen={twoFactorDialogOpen}
        onOpenChange={setTwoFactorDialogOpen}
      />

      <DisableTwoFactorDialog
        isOpen={disableTwoFactorDialogOpen}
        onOpenChange={setDisableTwoFactorDialogOpen}
      />
    </div>
  );
};

export default AccountSecurity;
