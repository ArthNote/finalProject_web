import { Separator } from "@/components/ui/separator";
import { useTranslations } from "next-intl";
import ManageProfile from "./manage-profile";
import SessionManagement from "./session_managemnet";
import DeleteAccount from "./delete_account";
import AccountSecurity from "./security";
import { AccountTabSkeleton } from "./account-skeletons";
import { authClient } from "@/lib/auth-client";

export default function AccountTab() {
  const t = useTranslations("settings.account");
  const { isPending: isLoading } = authClient.useSession();

  if (isLoading) {
    return <AccountTabSkeleton />;
  }

  return (
    <div className="space-y-8">
      <h2 className="text-xl font-semibold tracking-tight">{t("title")}</h2>

      {/* Profile Information */}
      <ManageProfile />

      <Separator className="my-6" />

      {/* Password & Security */}
      <AccountSecurity />

      <Separator className="my-6" />

      {/* Session Management */}
      <SessionManagement />

      <Separator className="my-6" />

      {/* Delete Account */}
      <DeleteAccount />
    </div>
  );
}
