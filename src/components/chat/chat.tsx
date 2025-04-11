"use client";

import React, { useState } from "react";
import { useRouter } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  PlusCircle,
  Users,
  User,
  Search,
  Filter,
  MessageSquare,
  Hash,
  UserX,
  X,
  Group,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { getFriends } from "@/lib/api/friends";
import { createChat, getChats } from "@/lib/api/chats";
import { Friend, FriendResponse, SearchUserResult } from "@/types/friend";
import { Chat } from "@/types/chat";
import { authClient } from "@/lib/auth-client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { GroupFormData } from "@/lib/api/chats";
import { Checkbox } from "@/components/ui/checkbox";

// Add this helper function near the top of the file
function isFriendArray(data: FriendResponse["data"]): data is Friend[] {
  return Array.isArray(data);
}

// Add group form schema
const groupFormSchema = z.object({
  name: z.string().min(1, "Group name is required"),
  participantIds: z.array(z.string()).min(1, "Select at least one participant"),
});

export default function ChatComponent() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [friendSelectionOpen, setFriendSelectionOpen] = useState(false);
  const [friendSearch, setFriendSearch] = useState("");
  const [groupDialogOpen, setGroupDialogOpen] = useState(false);
  const [groupParticipantSearch, setGroupParticipantSearch] = useState("");
  const t = useTranslations("chats");
  const { data } = authClient.useSession();
  const queryClient = useQueryClient();

  const {
    data: friendsResponse,
    isLoading: isLoadingFriends,
    error: friendsError,
  } = useQuery({
    queryKey: ["friends"],
    queryFn: getFriends,
  });

  const { mutate: startChat, isPending: isStartingChat } = useMutation({
    mutationFn: (friendId: string) =>
      createChat({
        participantIds: [friendId],
        type: "individual",
      }),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["chats"] });
      if (data.data && "id" in data.data) {
        handleChatSelect(data.data.id);
      }
      setFriendSelectionOpen(false);
    },
  });

  const friends =
    friendsResponse?.data && isFriendArray(friendsResponse.data)
      ? friendsResponse.data
      : [];
  const getOtherUser = (friend: Friend) => {
    const myUserId = data?.user.id;
    return friend.sender.id === myUserId ? friend.receiver : friend.sender;
  };

  const filteredFriends = friends.filter((friend) => {
    const otherUser = getOtherUser(friend);
    return (
      otherUser.username.toLowerCase().includes(friendSearch.toLowerCase()) ||
      otherUser.email.toLowerCase().includes(friendSearch.toLowerCase())
    );
  });

  const filteredGroupParticipants = friends.filter((friend) => {
    const otherUser = getOtherUser(friend);
    return (
      otherUser.username
        .toLowerCase()
        .includes(groupParticipantSearch.toLowerCase()) ||
      otherUser.email
        .toLowerCase()
        .includes(groupParticipantSearch.toLowerCase())
    );
  });

  function handleChatSelect(chatId: string) {
    router.push(`/chats/chat-${chatId}`);
  }

  function handleTypeSelect(type: string) {
    setSelectedType(type === "direct" ? "individual" : type);
  }

  const getStatusColor = (status: string) =>
    status === "online" ? "bg-green-500" : "bg-gray-400";

  // Add chat query
  const {
    data: chatsResponse,
    isLoading: isLoadingChats,
    error: chatsError,
  } = useQuery({
    queryKey: ["chats"],
    queryFn: getChats,
  });

  const chats = chatsResponse?.data ?? [];

  // Update filteredChats to handle both search and type filtering
  const filteredChats = chats.filter((chat) => {
    // Type filter
    if (selectedType !== "all") {
      if (selectedType === "individual" && chat.type !== "individual")
        return false;
      if (selectedType === "group" && chat.type !== "group") return false;
    }

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();

      // For group chats, search in group name
      if (chat.type === "group" && chat.name) {
        if (chat.name.toLowerCase().includes(query)) return true;
      }

      // Search in participant usernames
      const participantMatch = chat.participants.some(
        (p) =>
          p.user.id !== data?.user.id && // Don't match current user
          (p.user.username.toLowerCase().includes(query) ||
            p.user.email.toLowerCase().includes(query))
      );

      // Search in last message if exists
      const messageMatch = chat.messages[0]?.content
        ?.toLowerCase()
        .includes(query);

      return participantMatch || messageMatch || false;
    }

    return true;
  });

  // Helper function to get chat display name
  const getChatDisplayName = (chat: Chat) => {
    if (chat.type === "group") return chat.name;
    const otherParticipant = chat.participants.find(
      (p) => p.user.id !== data?.user.id
    );
    return otherParticipant?.user.username ?? "Unknown User";
  };

  // Group creation form
  const groupForm = useForm<GroupFormData>({
    resolver: zodResolver(groupFormSchema),
    defaultValues: {
      name: "",
      participantIds: [],
    },
  });

  // Add create group mutation
  const { mutate: createGroupChat, isPending: isCreatingGroup } = useMutation({
    mutationFn: (data: GroupFormData) =>
      createChat({
        participantIds: data.participantIds,
        type: "group",
        name: data.name,
      }),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["chats"] });
      if (data.data && "id" in data.data) {
        handleChatSelect(data.data.id);
      }
      setGroupDialogOpen(false);
      groupForm.reset();
    },
  });

  // Group form submit handler
  const onCreateGroup = (data: GroupFormData) => {
    createGroupChat(data);
  };

  // Add this function before the return statement
  const handleParticipantToggle = React.useCallback(
    (participantId: string) => {
      const currentIds = groupForm.getValues("participantIds");
      const isSelected = currentIds.includes(participantId);

      if (isSelected) {
        groupForm.setValue(
          "participantIds",
          currentIds.filter((id) => id !== participantId)
        );
      } else {
        groupForm.setValue("participantIds", [...currentIds, participantId]);
      }
    },
    [groupForm]
  );

  return (
    <main className="h-[calc(100vh-5rem)] ">
      <Card className="flex h-full overflow-hidden">
        {/* Mobile and Desktop Layout */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Header */}
          <header className="p-3 sm:p-4 md:p-6 border-b">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
              <div>
                <h1 className="text-xl sm:text-2xl font-semibold">
                  {t("title")}
                </h1>
                <p className="text-sm text-muted-foreground">{t("subtitle")}</p>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="w-full sm:w-auto">
                    <PlusCircle className="h-4 w-4 mr-2" />
                    {t("newChat")}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem
                    onClick={() => setFriendSelectionOpen(true)}
                  >
                    <MessageSquare className="mr-2 h-4 w-4" />
                    {t("newChatOptions.individual")}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setGroupDialogOpen(true)}>
                    <Users className="mr-2 h-4 w-4" />
                    {t("newChatOptions.group")}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                <Input
                  placeholder={t("searchPlaceholder")}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none -mx-3 px-3 sm:mx-0 sm:px-0">
                <Button
                  variant={selectedType === "all" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => handleTypeSelect("all")}
                  className="flex-none"
                >
                  <Hash className="h-4 w-4 mr-2" />
                  {t("filters.all")}
                </Button>
                <Button
                  variant={selectedType === "individual" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => handleTypeSelect("direct")}
                  className="flex-none"
                >
                  <MessageSquare className="h-4 w-4 mr-2" />
                  {t("filters.direct")}
                </Button>
                <Button
                  variant={selectedType === "group" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => handleTypeSelect("group")}
                  className="flex-none"
                >
                  <Users className="h-4 w-4 mr-2" />
                  {t("filters.groups")}
                </Button>
                {/* <Button
                  variant={selectedType === "team" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => handleTypeSelect("team")}
                  className="flex-none"
                >
                  <Users className="h-4 w-4 mr-2" />
                  {t("filters.teams")}
                </Button> */}
                <Separator
                  orientation="vertical"
                  className="h-5 block lg:hidden"
                />
                <Button
                  variant={selectedType === "contacts" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => handleTypeSelect("contacts")}
                  className="flex-none flex lg:hidden"
                >
                  <User className="h-4 w-4 mr-2" />
                  {t("filters.contacts")}
                  <Badge variant="secondary" className="ml-2 h-5 min-w-[20px]">
                    {friends.length}
                  </Badge>
                </Button>
              </div>
            </div>
          </header>

          {/* Main Content Area */}
          <div className="overflow-y-auto flex-1">
            {selectedType === "contacts" ? (
              <div className="overflow-y-auto p-4">
                {isLoadingFriends ? (
                  <div className="space-y-3">
                    {Array(5)
                      .fill(null)
                      .map((_, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-3 p-3 rounded-lg border"
                        >
                          <Skeleton className="h-10 w-10 rounded-full" />
                          <div className="space-y-2 flex-1">
                            <Skeleton className="h-4 w-32" />
                            <Skeleton className="h-3 w-16" />
                          </div>
                          <Skeleton className="h-8 w-8 rounded-md" />
                        </div>
                      ))}
                  </div>
                ) : friendsError ? (
                  <div className="text-center py-8 text-muted-foreground">
                    {t("contacts.error")}
                  </div>
                ) : friends.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    {t("contacts.empty")}
                  </div>
                ) : (
                  <div className="space-y-2">
                    {friends.map((friend) => {
                      const otherUser = getOtherUser(friend);
                      return (
                        <div
                          key={friend.id}
                          onClick={() => handleChatSelect(`user-${friend.id}`)}
                          className="flex items-center gap-3 p-3 rounded-lg border hover:bg-accent cursor-pointer"
                        >
                          <div className="relative">
                            <Avatar className="h-10 w-10">
                              <AvatarImage
                                src={otherUser.image}
                                alt={otherUser.username}
                              />
                              <AvatarFallback className="bg-primary/10 text-primary">
                                {otherUser.username.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <span
                              className={cn(
                                "absolute bottom-0 right-0 h-3 w-3 rounded-full ring-2 ring-background",
                                getStatusColor(friend.status || "offline")
                              )}
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-baseline justify-between">
                              <p className="font-medium truncate">
                                {otherUser.username}
                              </p>
                            </div>
                            <p className="text-sm text-muted-foreground truncate">
                              {otherUser.email}
                            </p>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 flex-none"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleChatSelect(`user-${friend.id}`);
                            }}
                          >
                            <MessageSquare className="h-4 w-4" />
                          </Button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            ) : (
              <div className="overflow-y-auto">
                {isLoadingChats ? (
                  <div className="space-y-3 p-3">
                    {Array(5)
                      .fill(null)
                      .map((_, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-3 p-3 rounded-lg border animate-pulse"
                        >
                          <Skeleton className="h-12 w-12 rounded-full" />
                          <div className="space-y-2 flex-1">
                            <Skeleton className="h-4 w-32" />
                            <Skeleton className="h-3 w-48" />
                          </div>
                        </div>
                      ))}
                  </div>
                ) : chatsError ? (
                  <div className="text-center py-8 text-muted-foreground">
                    Error loading chats
                  </div>
                ) : filteredChats.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No chats found
                  </div>
                ) : (
                  filteredChats.map((chat) => (
                    <div
                      key={chat.id}
                      onClick={() => handleChatSelect(chat.id)}
                      className="p-3 mx-2 my-1 flex items-center gap-3 rounded-lg hover:bg-accent cursor-pointer"
                    >
                      <div className="relative shrink-0">
                        <Avatar>
                          {chat.type !== "individual" ? (
                            <div className="h-full w-full bg-primary/10 text-primary flex items-center justify-center">
                              <Users className="h-5 w-5" />
                            </div>
                          ) : (
                            <AvatarImage
                              src={
                                chat.participants.find(
                                  (p) => p.user.id !== data?.user.id
                                )?.user.image
                              }
                              alt={getChatDisplayName(chat)}
                            />
                          )}
                          {chat.type !== "individual" ? null : (
                            <AvatarFallback className="bg-primary/10 text-primary">
                              {getChatDisplayName(chat)?.charAt(0) || "?"}
                            </AvatarFallback>
                          )}
                        </Avatar>
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between">
                          <span className="font-medium truncate">
                            {getChatDisplayName(chat)}
                          </span>
                          <span className="text-xs text-muted-foreground ml-2">
                            {new Date(chat.updatedAt).toLocaleTimeString(
                              undefined,
                              {
                                hour: "numeric",
                                minute: "2-digit",
                              }
                            )}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 mt-0.5">
                          <p className="text-sm text-muted-foreground truncate">
                            {chat.messages[0]?.content ?? "No messages yet"}
                          </p>
                          {/* Add unread count badge if needed */}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>

        {/* Desktop Contacts Sidebar */}
        {selectedType !== "contacts" && (
          <aside className="hidden lg:flex w-72 flex-col border-l">
            <div className="p-4 border-b">
              <h2 className="font-semibold">{t("contacts.title")}</h2>
              <p className="text-xs text-muted-foreground">
                {t("contacts.activeNow", {
                  count: friends.filter((f) => f.status === "online").length,
                })}
              </p>
            </div>
            <div className="overflow-y-auto flex-1">
              {isLoadingFriends
                ? Array(5)
                    .fill(null)
                    .map((_, index) => (
                      <div
                        key={index}
                        className="p-2 mx-2 my-1 flex items-center gap-3"
                      >
                        <Skeleton className="h-9 w-9 rounded-full flex-none" />
                        <div className="flex-1 space-y-2">
                          <Skeleton className="h-4 w-24" />
                          <Skeleton className="h-3 w-16" />
                        </div>
                      </div>
                    ))
                : friends.map((friend) => {
                    const otherUser = getOtherUser(friend);
                    return (
                      <div
                        key={friend.id}
                        onClick={() => handleChatSelect(`user-${friend.id}`)}
                        className="p-2 mx-2 my-1 flex items-center gap-3 rounded-lg hover:bg-accent cursor-pointer"
                      >
                        <div className="relative flex-none">
                          <Avatar className="h-9 w-9">
                            <AvatarImage
                              src={otherUser.image}
                              alt={otherUser.username}
                            />
                            <AvatarFallback className="bg-primary/10 text-primary">
                              {otherUser.username.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <span
                            className={cn(
                              "absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full ring-2 ring-background",
                              getStatusColor(friend.status || "offline")
                            )}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-baseline justify-between gap-2">
                            <span className="text-sm font-medium truncate">
                              {otherUser.username}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
            </div>
          </aside>
        )}

        {/* Friend Selection Dialog */}
        <Dialog
          open={friendSelectionOpen}
          onOpenChange={setFriendSelectionOpen}
        >
          <DialogContent className="sm:max-w-[425px] p-0">
            <DialogHeader className="px-6 py-4 border-b space-y-0">
              <DialogTitle className="text-lg font-semibold">
                Start a conversation
              </DialogTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Select a friend to start chatting
              </p>
              <div className="mt-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                  <Input
                    placeholder="Search by name or email..."
                    value={friendSearch}
                    onChange={(e) => setFriendSearch(e.target.value)}
                    className="pl-9 bg-background border-muted"
                  />
                </div>
              </div>
            </DialogHeader>

            {isLoadingFriends ? (
              <div className="p-6 space-y-4">
                {Array(3)
                  .fill(null)
                  .map((_, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-4 animate-pulse"
                    >
                      <Skeleton className="h-12 w-12 rounded-full flex-shrink-0" />
                      <div className="space-y-2 flex-1">
                        <Skeleton className="h-4 w-[140px]" />
                        <Skeleton className="h-3 w-[100px]" />
                      </div>
                      <Skeleton className="h-8 w-8 rounded-full flex-shrink-0" />
                    </div>
                  ))}
              </div>
            ) : filteredFriends.length === 0 ? (
              <div className="p-6 flex flex-col items-center justify-center h-[300px] text-center">
                <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-4">
                  <UserX className="h-6 w-6 text-muted-foreground" />
                </div>
                <h3 className="font-medium mb-1">No matches found</h3>
                <p className="text-sm text-muted-foreground">
                  {friendSearch
                    ? "Try a different search term"
                    : "You have no friends yet"}
                </p>
              </div>
            ) : (
              <ScrollArea className="max-h-[420px]">
                <div className="p-2">
                  {filteredFriends.map((friend) => {
                    const otherUser = getOtherUser(friend);
                    return (
                      <button
                        key={friend.id}
                        disabled={isStartingChat}
                        onClick={() => startChat(otherUser.id)}
                        className={cn(
                          "w-full flex items-center gap-4 p-3 rounded-lg",
                          "transition-colors duration-200",
                          "focus:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                          !isStartingChat && "hover:bg-accent",
                          isStartingChat && "opacity-50 cursor-not-allowed"
                        )}
                      >
                        <div className="relative flex-shrink-0">
                          <Avatar className="h-12 w-12">
                            <AvatarImage
                              src={otherUser.image}
                              alt={otherUser.username}
                            />
                            <AvatarFallback className="bg-gradient-to-br from-primary/10 to-primary/5 text-primary">
                              {otherUser.username[0].toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <span
                            className={cn(
                              "absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full ring-2 ring-background",
                              getStatusColor(friend.status || "offline")
                            )}
                          />
                        </div>
                        <div className="flex-1 min-w-0 text-left">
                          <p className="font-medium leading-none mb-1">
                            {otherUser.username}
                          </p>
                          <p className="text-sm text-muted-foreground truncate">
                            {otherUser.email}
                          </p>
                        </div>
                        <div className="flex-shrink-0 flex items-center gap-2">
                          {friend.status === "online" && (
                            <Badge
                              variant="outline"
                              className="border-green-500/20 text-green-500 bg-green-500/10"
                            >
                              {t("contacts.online")}
                            </Badge>
                          )}
                          <MessageSquare className="h-4 w-4 text-muted-foreground" />
                        </div>
                      </button>
                    );
                  })}
                </div>
              </ScrollArea>
            )}
          </DialogContent>
        </Dialog>

        {/* Group Creation Dialog */}
        <Dialog open={groupDialogOpen} onOpenChange={setGroupDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Create Group Chat</DialogTitle>
              <p className="text-sm text-muted-foreground">
                Create a new group and add participants
              </p>
            </DialogHeader>
            <form
              onSubmit={groupForm.handleSubmit(onCreateGroup)}
              className="space-y-6"
            >
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Group Name</label>
                  <Input
                    placeholder="Enter group name"
                    {...groupForm.register("name")}
                  />
                  {groupForm.formState.errors.name && (
                    <p className="text-sm text-destructive">
                      {groupForm.formState.errors.name.message}
                    </p>
                  )}
                </div>

                {/* Selected participants section */}
                {groupForm.watch("participantIds").length > 0 && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      Selected Participants
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {groupForm.watch("participantIds").map((id) => {
                        const friend = friends.find(
                          (f) => getOtherUser(f).id === id
                        );
                        if (!friend) return null;
                        const user = getOtherUser(friend);
                        return (
                          <Badge
                            key={id}
                            variant="secondary"
                            className="flex items-center gap-1 pl-1"
                          >
                            <Avatar className="h-4 w-4">
                              <AvatarImage
                                src={user.image}
                                alt={user.username}
                              />
                              <AvatarFallback>
                                {user.username[0]}
                              </AvatarFallback>
                            </Avatar>
                            <span>{user.username}</span>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="h-4 w-4 p-0 hover:bg-transparent"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                const currentIds =
                                  groupForm.getValues("participantIds");
                                groupForm.setValue(
                                  "participantIds",
                                  currentIds.filter((pid) => pid !== id)
                                );
                              }}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </Badge>
                        );
                      })}
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Add Participants
                  </label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                    <Input
                      placeholder="Search friends..."
                      value={groupParticipantSearch}
                      onChange={(e) =>
                        setGroupParticipantSearch(e.target.value)
                      }
                      className="pl-9"
                    />
                  </div>
                  <ScrollArea className="h-[200px] border rounded-md">
                    <div className="p-2 space-y-2">
                      {filteredGroupParticipants.length === 0 ? (
                        <p className="text-sm text-muted-foreground text-center py-4">
                          No friends found
                        </p>
                      ) : (
                        filteredGroupParticipants.map((friend) => {
                          const otherUser = getOtherUser(friend);
                          const participantId = otherUser.id;
                          const isSelected = groupForm
                            .watch("participantIds")
                            .includes(participantId);

                          return (
                            <div
                              key={friend.id}
                              className={cn(
                                "flex items-center gap-3 p-2 rounded-md cursor-pointer",
                                isSelected ? "bg-accent" : "hover:bg-muted"
                              )}
                            >
                              <div className="flex items-center gap-3 flex-1">
                                <Avatar className="h-8 w-8">
                                  <AvatarImage
                                    src={otherUser.image}
                                    alt={otherUser.username}
                                  />
                                  <AvatarFallback>
                                    {otherUser.username[0]}
                                  </AvatarFallback>
                                </Avatar>
                                <div className="min-w-0">
                                  <p className="text-sm font-medium">
                                    {otherUser.username}
                                  </p>
                                  <p className="text-xs text-muted-foreground truncate">
                                    {otherUser.email}
                                  </p>
                                </div>
                              </div>
                              <Checkbox
                                checked={isSelected}
                                onCheckedChange={() =>
                                  handleParticipantToggle(participantId)
                                }
                                className="data-[state=checked]:bg-primary"
                              />
                            </div>
                          );
                        })
                      )}
                    </div>
                  </ScrollArea>
                  {groupForm.formState.errors.participantIds && (
                    <p className="text-sm text-destructive">
                      {groupForm.formState.errors.participantIds.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex justify-end gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setGroupDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isCreatingGroup}>
                  {isCreatingGroup ? "Creating..." : "Create Group"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </Card>
    </main>
  );
}
