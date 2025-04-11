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
import { toast } from "sonner";
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

// Mock data for team members
const initialMembers = [
  {
    id: 1,
    name: "Sarah Johnson",
    email: "sarah@example.com",
    role: "Owner",
    avatar: "SJ",
  },
  {
    id: 2,
    name: "Michael Chen",
    email: "michael@example.com",
    role: "Admin",
    avatar: "MC",
  },
  {
    id: 3,
    name: "Jessica Williams",
    email: "jessica@example.com",
    role: "Admin",
    avatar: "JW",
  },
  {
    id: 4,
    name: "David Miller",
    email: "david@example.com",
    role: "Member",
    avatar: "DM",
  },
  {
    id: 5,
    name: "Emily Davis",
    email: "emily@example.com",
    role: "Member",
    avatar: "ED",
  },
  {
    id: 6,
    name: "Ryan Wilson",
    email: "ryan@example.com",
    role: "Member",
    avatar: "RW",
  },
  {
    id: 7,
    name: "Olivia Brown",
    email: "olivia@example.com",
    role: "Member",
    avatar: "OB",
  },
];

const EmptyState = ({
  searchQuery,
  setInviteOpen,
}: {
  searchQuery: string;
  setInviteOpen: (open: boolean) => void;
}) => (
  <div className="flex flex-col items-center justify-center py-12 text-center">
    <Users className="h-8 w-8 text-muted-foreground mb-4" />
    {searchQuery ? (
      <>
        <h3 className="text-lg font-semibold">No members found</h3>
        <p className="text-muted-foreground">
          No team members match your search query
        </p>
      </>
    ) : (
      <>
        <h3 className="text-lg font-semibold">No team members yet</h3>
        <p className="text-muted-foreground">
          Start by inviting members to your team
        </p>
        <Button onClick={() => setInviteOpen(true)} className="mt-4">
          <UserPlus className="h-4 w-4 mr-2" />
          Invite Member
        </Button>
      </>
    )}
  </div>
);

const MembersManagement = () => {
  const [members, setMembers] = useState(initialMembers);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Filter members based on search query
  const filteredMembers = members.filter(
    (member) =>
      member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Mock function to handle member invite
  const handleInvite = (email: string) => {
    toast.success(`Invitation sent to ${email}`);
    setInviteOpen(false);
  };

  // Mock function to change role
  const handleRoleChange = (memberId: number, newRole: string) => {
    setMembers(
      members.map((member) =>
        member.id === memberId ? { ...member, role: newRole } : member
      )
    );
    toast.success("Member role updated successfully");
  };

  // Mock function to remove member
  const handleRemoveMember = (memberId: number) => {
    setMembers(members.filter((member) => member.id !== memberId));
    toast.success("Member removed from team");
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "Owner":
        return <ShieldAlert className="h-4 w-4 text-primary" />;
      case "Admin":
        return <ShieldCheck className="h-4 w-4 text-priority-medium" />;
      default:
        return <Shield className="h-4 w-4 text-muted-foreground" />;
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
          <div>
            <CardTitle>Team Members</CardTitle>
            <CardDescription>
              Manage your team members and their roles
            </CardDescription>
          </div>
          <Button onClick={() => setInviteOpen(true)}>
            <UserPlus className="h-4 w-4 mr-2" />
            Invite Member
          </Button>
        </div>
        <Input
          placeholder="Search members..."
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
                <TableHead>Member</TableHead>
                <TableHead>Role</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredMembers.map((member) => (
                <TableRow key={member.id}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <div className="h-8 w-8 rounded-full bg-muted items-center justify-center text-xs font-medium hidden md:flex">
                        {member.avatar}
                      </div>
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
                      <span className="hidden md:flex">{member.role}</span>
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
                        {member.role !== "Owner" && (
                          <>
                            <DropdownMenuItem
                              onClick={() =>
                                handleRoleChange(member.id, "Admin")
                              }
                            >
                              Make Admin
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() =>
                                handleRoleChange(member.id, "Member")
                              }
                            >
                              Make Member
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                          </>
                        )}
                        <DropdownMenuItem
                          onClick={() => handleRemoveMember(member.id)}
                          disabled={member.role === "Owner"}
                          className={
                            member.role === "Owner"
                              ? "cursor-not-allowed opacity-50"
                              : "text-destructive"
                          }
                        >
                          Remove from Team
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
