"use client";

import { useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getInitials } from "@/lib/utils";
import { Search, Users } from "lucide-react";

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  hasTeam: boolean;
}

const mockUsers: User[] = [
  {
    id: "1",
    name: "Alice Johnson",
    email: "alice@example.com",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alice",
    hasTeam: false,
  },
  {
    id: "2",
    name: "Bob Smith",
    email: "bob@example.com",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Bob",
    hasTeam: true,
  },
  {
    id: "3",
    name: "Carol Williams",
    email: "carol@example.com",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Carol",
    hasTeam: false,
  },
  {
    id: "4",
    name: "David Brown",
    email: "david@example.com",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=David",
    hasTeam: true,
  },
];

interface InviteMemberDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onInvite: (email: string) => void;
}

export function InviteMemberDialog({
  open,
  onOpenChange,
  onInvite,
}: InviteMemberDialogProps) {
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<User[]>([]);

  const availableUsers = mockUsers.filter((user) => !user.hasTeam);

  const searchUsers = useDebouncedCallback(async (query: string) => {
    if (!query) {
      setUsers([]);
      return;
    }

    setLoading(true);
    try {
      // Simulate API call with mock data
      await new Promise((resolve) => setTimeout(resolve, 500)); // Fake delay
      const filtered = mockUsers.filter(
        (user) =>
          user.name.toLowerCase().includes(query.toLowerCase()) ||
          user.email.toLowerCase().includes(query.toLowerCase())
      );
      setUsers(filtered);
    } catch (error) {
      console.error("Failed to search users:", error);
    } finally {
      setLoading(false);
    }
  }, 300);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Invite Team Member</DialogTitle>
        </DialogHeader>
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by username or email..."
            className="pl-8"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              searchUsers(e.target.value);
            }}
          />
        </div>
        <div className="mt-4 space-y-4 max-h-[300px] overflow-y-auto">
          {!search && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Users className="h-4 w-4" />
                <span>Suggested users available to join your team</span>
              </div>
              <div className="space-y-2">
                {availableUsers.map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center justify-between p-2 hover:bg-muted rounded-md"
                  >
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={user.avatar} />
                        <AvatarFallback>
                          {getInitials(user.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">{user.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {user.email}
                        </p>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => {
                        onInvite(user.email);
                        onOpenChange(false);
                      }}
                    >
                      Invite
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
          {loading ? (
            <div className="text-center text-sm text-muted-foreground">
              Searching...
            </div>
          ) : users.length > 0 ? (
            users.map((user) => (
              <div
                key={user.id}
                className="flex items-center justify-between p-2 hover:bg-muted rounded-md"
              >
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={user.avatar} />
                    <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">{user.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                </div>
                <Button
                  size="sm"
                  disabled={user.hasTeam}
                  onClick={() => {
                    onInvite(user.email);
                    onOpenChange(false);
                  }}
                >
                  {user.hasTeam ? "Has Team" : "Invite"}
                </Button>
              </div>
            ))
          ) : search ? (
            <div className="text-center text-sm text-muted-foreground">
              No users found
            </div>
          ) : null}
        </div>
      </DialogContent>
    </Dialog>
  );
}
