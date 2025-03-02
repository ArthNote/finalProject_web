import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import {
  UserIcon,
  Loader2Icon,
  Mail as GoogleIcon,
  Apple as AppleIcon,
  Facebook as FacebookIcon,
  Github as GithubIcon,
  LayoutGrid as MicrosoftIcon,
  Twitter as TwitterIcon,
} from "lucide-react";
import { useState, useCallback } from "react";
import { useTranslations } from "next-intl";

export default function AccountTab() {
  const { toast } = useToast();
  const t = useTranslations("settings.account");

  const [formData, setFormData] = useState({
    name: "",
    username: "",
  });
  const [isSaving, setIsSaving] = useState(false);
  const [providers, setProviders] = useState([
    { name: "Google", connected: true, Icon: GoogleIcon },
    { name: "Apple", connected: false, Icon: AppleIcon },
    { name: "Facebook", connected: false, Icon: FacebookIcon },
    { name: "GitHub", connected: true, Icon: GithubIcon },
    { name: "Microsoft", connected: false, Icon: MicrosoftIcon },
    { name: "Twitter", connected: false, Icon: TwitterIcon },
  ]);

  const handleProviderConnection = useCallback(
    (providerName: string) => {
      setProviders((prev) =>
        prev.map((provider) => {
          if (provider.name === providerName) {
            const newState = !provider.connected;
            toast({
              title: newState
                ? t("toast.provider.connected.title", { provider: providerName })
                : t("toast.provider.disconnected.title", { provider: providerName }),
              description: newState
                ? t("toast.provider.connected.description", { provider: providerName })
                : t("toast.provider.disconnected.description", { provider: providerName }),
            });
            return { ...provider, connected: newState };
          }
          return provider;
        })
      );
    },
    [toast, t]
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleAvatarUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      toast({
        title: t("toast.avatar.success.title"),
        description: t("toast.avatar.success.description"),
      });
    }
  };

  const handlePasswordChange = () => {
    toast({
      title: t("security.password.title"),
      description: t("security.password.description"),
    });
  };

  const handleProfileSave = async () => {
    setIsSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    toast({
      title: t("profile.title"),
      description: t("profile.description"),
    });
    setIsSaving(false);
  };

  const handleDeleteAccount = () => {
    toast({
      title: t("deleteAccount.title"),
      description: t("deleteAccount.description"),
      variant: "destructive",
    });
  };

  return (
    <div className="py-8 px-10">
      <div className="grid gap-12">
        {/* Profile Section */}
        <section className="space-y-6">
          <div>
            <h2 className="text-2xl font-medium">{t("title")}</h2>
            <p className="text-muted-foreground mt-2">{t("profile.description")}</p>
          </div>

          <div className="rounded-lg bg-muted/40 p-6">
            <div className="grid gap-8 md:grid-cols-[200px_1fr]">
              <div className="flex flex-col items-center gap-4">
                <Avatar className="h-32 w-32">
                  <AvatarImage src="" alt={t("profile.title")} />
                  <AvatarFallback>
                    <UserIcon className="h-16 w-16" />
                  </AvatarFallback>
                </Avatar>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => document.getElementById("avatar-upload")?.click()}
                >
                  {t("profile.changePhoto")}
                </Button>
                <Input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  id="avatar-upload"
                  onChange={handleAvatarUpload}
                />
              </div>

              <div className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <Label className="text-base" htmlFor="name">{t("profile.name")}</Label>
                    <Input
                      id="name"
                      placeholder={t("profile.name")}
                      className="mt-2"
                      value={formData.name}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div>
                    <Label className="text-base" htmlFor="email">{t("profile.email")}</Label>
                    <Input
                      id="email"
                      type="email"
                      value="user@example.com"
                      disabled
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label className="text-base" htmlFor="username">{t("profile.username")}</Label>
                    <Input
                      id="username"
                      placeholder={t("profile.username")}
                      className="mt-2"
                      value={formData.username}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                <div className="flex justify-end">
                  <Button
                    size="lg"
                    onClick={handleProfileSave}
                    disabled={isSaving}
                  >
                    {isSaving ? (
                      <>
                        <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                        {t("profile.saving")}
                      </>
                    ) : (
                      t("profile.save")
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Security Section */}
        <section className="space-y-6">
          <h2 className="text-2xl font-medium">{t("security.title")}</h2>
          <div className="rounded-lg bg-muted/40 p-6 space-y-6">
            <div className="group hover:bg-background rounded-lg p-4 transition-colors">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h4 className="text-lg font-medium">{t("security.password.title")}</h4>
                  <p className="text-muted-foreground">{t("security.password.description")}</p>
                </div>
                <Button onClick={handlePasswordChange}>
                  {t("security.password.button")}
                </Button>
              </div>
            </div>

            <div className="group hover:bg-background rounded-lg p-4 transition-colors">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h4 className="text-lg font-medium">{t("security.twoFactor.title")}</h4>
                  <p className="text-muted-foreground">{t("security.twoFactor.description")}</p>
                </div>
                <Switch />
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-lg font-medium px-4">{t("security.connectedAccounts.title")}</h4>
              <div className="grid gap-4 grid-cols-1 lg:grid-cols-3">
                {providers.map((provider) => (
                  <div
                    key={provider.name}
                    className="group hover:bg-background rounded-lg p-4 transition-colors border"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <provider.Icon className="h-5 w-5 text-primary" />
                        <div>
                          <p className="font-medium">{provider.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {provider.connected
                              ? t("security.connectedAccounts.connected")
                              : t("security.connectedAccounts.notConnected")}
                          </p>
                        </div>
                      </div>
                      <Button
                        variant={provider.connected ? "destructive" : "outline"}
                        size="sm"
                        onClick={() => handleProviderConnection(provider.name)}
                      >
                        {provider.connected
                          ? t("security.connectedAccounts.disconnect")
                          : t("security.connectedAccounts.connect")}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Sessions Section */}
        <section className="space-y-6">
          <h2 className="text-2xl font-medium">{t("sessions.title")}</h2>
          <div className="rounded-lg bg-muted/40 p-6 space-y-4">
            <div className="group hover:bg-background rounded-lg p-4 transition-colors border">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">{t("sessions.device.current")}</p>
                  <p className="text-sm text-muted-foreground">Windows • Chrome • Paris, France</p>
                </div>
                <Button variant="secondary" size="sm" disabled>
                  {t("sessions.current")}
                </Button>
              </div>
            </div>
            <div className="group hover:bg-background rounded-lg p-4 transition-colors border">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">{t("sessions.device.mobile")}</p>
                  <p className="text-sm text-muted-foreground">iOS • Safari • London, UK</p>
                </div>
                <Button variant="outline" size="sm">
                  {t("sessions.logout")}
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Delete Account Section */}
        <section className="space-y-6">
          <h2 className="text-2xl font-medium text-destructive">{t("deleteAccount.title")}</h2>
          <div className="rounded-lg bg-destructive/10 p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <p className="text-muted-foreground">{t("deleteAccount.description")}</p>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive">{t("deleteAccount.button")}</Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>{t("deleteAccount.confirmTitle")}</AlertDialogTitle>
                    <AlertDialogDescription>
                      {t("deleteAccount.confirmDescription")}
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>{t("deleteAccount.cancel")}</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleDeleteAccount}
                      className="bg-destructive text-destructive-foreground"
                    >
                      {t("deleteAccount.confirm")}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
