"use client";

import { useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, Users } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { searchUsers } from "@/lib/api/friends";
import { toast } from "@/hooks/use-toast";
import { useTranslations } from "next-intl";
import { SearchUserResult } from "@/types/friend";
import { id } from "date-fns/locale";

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
  const [searchResults, setSearchResults] = useState<SearchUserResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const t = useTranslations("team.members.inviteDialog");

  const searchUsersDebounced = useDebouncedCallback(async (query: string) => {
    if (!query || query.length < 2) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const response = await searchUsers(query);
      if (response.success && Array.isArray(response.data)) {
        setSearchResults(response.data as SearchUserResult[]);
      }
    } catch (error) {
      console.error("Error searching users:", error);
      toast({
        title: t("toast.errorSearch.title"),
        description: t("toast.errorSearch.description"),
        variant: "destructive",
      });
    } finally {
      setIsSearching(false);
    }
  }, 300);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t("title")}</DialogTitle>
          <DialogDescription>{t("description")}</DialogDescription>
        </DialogHeader>

        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={t("searchPlaceholder")}
            className="pl-8"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              searchUsersDebounced(e.target.value);
            }}
          />
        </div>

        <div className="mt-4 space-y-4 max-h-[300px] overflow-y-auto">
          {isSearching ? (
            <div className="text-center text-sm text-muted-foreground">
              {t("searching")}
            </div>
          ) : searchResults.length > 0 ? (
            <div className="space-y-2">
              {searchResults.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between p-2 hover:bg-muted rounded-md"
                >
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={user.image} />
                      <AvatarFallback>{user.username[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">{user.username}</p>
                      <p className="text-xs text-muted-foreground">
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
                    {t("invite")}
                  </Button>
                </div>
              ))}
            </div>
          ) : search ? (
            <div className="text-center text-sm text-muted-foreground">
              {t("noUsersFound")}
            </div>
          ) : (
            <div className="text-center text-sm text-muted-foreground">
              {t("searchUsers")}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
