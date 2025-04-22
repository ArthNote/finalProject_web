import React, { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  UserPlus,
  MoreHorizontal,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Users,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { InviteMemberDialog } from "../invite-member-dialog";
import { useTeam } from "../team-context";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useTranslations } from "next-intl";
import { authClient } from "@/lib/auth-client";
import { toast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";

const EmptyState = ({
  searchQuery,
  setInviteOpen,
}: {
  searchQuery: string;
  setInviteOpen: (open: boolean) => void;
}) => {
  const t = useTranslations("team.members");

  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <Users className="h-8 w-8 text-muted-foreground mb-4" />
      {searchQuery ? (
        <>
          <h3 className="text-lg font-semibold">{t("emptySearch.title")}</h3>
          <p className="text-muted-foreground">
            {t("emptySearch.description", {
              query: searchQuery,
            })}
          </p>
        </>
      ) : (
        <>
          <h3 className="text-lg font-semibold">{t("emptyState.title")}</h3>
          <p className="text-muted-foreground">{t("emptyState.description")}</p>
          <Button onClick={() => setInviteOpen(true)} className="mt-4">
            <UserPlus className="h-4 w-4 mr-2" />
            {t("emptyState.action")}
          </Button>
        </>
      )}
    </div>
  );
};

const MembersManagement = () => {
  const t = useTranslations("team.members");
  const [inviteOpen, setInviteOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { team, orgId } = useTeam();
  const queryClient = useQueryClient();

  // Filter members based on search query
  const filteredMembers = team.members.filter(
    (member) =>
      member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Mock function to handle member invite
  const handleInvite = async (email: string) => {
    await authClient.organization.inviteMember({
      email: email,
      role: "member",
      teamId: team.id,
      fetchOptions: {
        onSuccess(context) {
          toast({
            title: t("inviteDialog.toast.inviteSuccess.title"),
            description: t("inviteDialog.toast.inviteSuccess.description", {
              email: email,
            }),
          });
        },
        onError(context) {
          toast({
            title: t("inviteDialog.toast.inviteError.title"),
            description: t("inviteDialog.toast.inviteError.description", {
              email: email,
            }),
            variant: "destructive",
          });
        },
      },
    });
    setInviteOpen(false);
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "owner":
        return <ShieldAlert className="h-4 w-4 text-primary" />;
      case "admin":
        return <ShieldCheck className="h-4 w-4 text-priority-medium" />;
      default:
        return <Shield className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const handleRemoveMember = async (memberId: string) => {
    await authClient.organization.removeMember({
      memberIdOrEmail: memberId,
      organizationId: orgId,
      fetchOptions: {
        onSuccess(context) {
          toast({
            title: t("table.toast.removeSuccess.title"),
            description: t("table.toast.removeSuccess.description"),
          });

          queryClient.invalidateQueries({
            queryKey: ["team", `org-${orgId}`],
            type: "all",
          });
          queryClient.refetchQueries({
            queryKey: ["team", `org-${orgId}`],
            type: "all",
          });
        },
        onError(context) {
          toast({
            title: t("table.toast.removeError.title"),
            description: t("table.toast.removeError.description"),
            variant: "destructive",
          });
        },
      },
    });
  };

  // Mock function to handle role change
  const handleRoleChange = async (memberId: string, newRole: string) => {
    await authClient.organization.updateMemberRole({
      memberId: memberId,
      role: newRole as "member" | "admin",
      fetchOptions: {
        onSuccess(context) {
          toast({
            title: t("table.toast.roleUpdated.title"),
            description: t("table.toast.roleUpdated.description", {
              role: t(`table.roles.${newRole}`),
            }),
          });
          queryClient.invalidateQueries({
            queryKey: ["team", `org-${orgId}`],
            type: "all",
          });
          queryClient.refetchQueries({
            queryKey: ["team", `org-${orgId}`],
            type: "all",
          });
        },
        onError(context) {
          toast({
            title: t("table.toast.roleUpdateError.title"),
            description: t("table.toast.roleUpdateError.description"),
            variant: "destructive",
          });
        },
      },
    });
  };

  return (
    <Card>
      <CardHeader className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
          <div>
            <CardTitle>{t("title")}</CardTitle>
            <CardDescription>{t("description")}</CardDescription>
          </div>
          <Button onClick={() => setInviteOpen(true)}>
            <UserPlus className="h-4 w-4 mr-2" />
            {t("invite")}
          </Button>
        </div>
        <Input
          placeholder={t("searchPlaceholder")}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full sm:max-w-sm"
        />
      </CardHeader>
      <CardContent>
        {filteredMembers.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("table.member")}</TableHead>
                <TableHead>{t("table.role")}</TableHead>
                <TableHead className="text-right">
                  {t("table.actions")}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredMembers.map((member) => (
                <TableRow key={member.id}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <Avatar>
                        <AvatarImage src={member.avatar} />
                        <AvatarFallback className="hidden md:flex">
                          {member.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>

                      <div>
                        <p className="font-medium">{member.name}</p>
                        <p className="text-sm text-muted-foreground hidden md:flex">
                          {member.email}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-1">
                      {getRoleIcon(member.role)}
                      <span className="hidden md:flex">
                        {t(`table.roles.${member.role}`)}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {member.role !== "owner" && (
                          <>
                            <DropdownMenuItem
                              onClick={() =>
                                handleRoleChange(member.id, "admin")
                              }
                              disabled={member.role === "admin"}
                            >
                              {t("table.makeAdmin")}
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() =>
                                handleRoleChange(member.id, "member")
                              }
                              disabled={member.role === "member"}
                            >
                              {t("table.makeMember")}
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                          </>
                        )}
                        <DropdownMenuItem
                          onClick={() => handleRemoveMember(member.id)}
                          disabled={member.role === "owner"}
                          className={
                            member.role === "owner"
                              ? "cursor-not-allowed opacity-50"
                              : "text-destructive"
                          }
                        >
                          {t("table.remove")}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <EmptyState searchQuery={searchQuery} setInviteOpen={setInviteOpen} />
        )}
      </CardContent>
      <InviteMemberDialog
        open={inviteOpen}
        onOpenChange={setInviteOpen}
        onInvite={handleInvite}
      />
    </Card>
  );
};

export default MembersManagement;
