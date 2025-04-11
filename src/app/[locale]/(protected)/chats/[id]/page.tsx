"use client";

import React, { useRef, useState, useEffect, useLayoutEffect } from "react";
import { useParams } from "next/navigation";
import { useRouter } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardFooter,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Send,
  Paperclip,
  Image as ImageIcon,
  FileText,
  Mic,
  MoreVertical,
  Trash,
  Edit,
  Users,
  ChevronLeft,
  Search,
  Pin,
  Phone,
  Video,
  Volume2,
  Archive,
  Star,
  AtSign,
  Smile,
  UserPlus,
  Settings,
  SidebarClose,
  MessageSquare,
  Slash,
  AlertCircle,
  Plus,
  X,
  Loader2,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import ChatMessage from "@/components/chat/chat-message";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { authClient } from "@/lib/auth-client";
import {
  getChatById,
  updateChat,
  updateChatMembers,
  deleteChat,
  sendMessage,
} from "@/lib/api/chats";
import { getMessages } from "@/lib/api/messages";
import {
  Chat,
  SingleChatResponse,
  Message,
  UpdateChatMembersData,
} from "@/types/chat";
import { CreateMessageData } from "@/types/message";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getFriends } from "@/lib/api/friends";
import { useToast } from "@/hooks/use-toast";
import AlertDialogDelete from "@/components/alert-dialog-delete";
import useSocket from "@/hooks/use-socket";

export default function ChatPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const [newMessage, setNewMessage] = useState("");
  const [error, setError] = useState<boolean>(false);
  const messageEndRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isAtBottom, setIsAtBottom] = useState(true);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const t = useTranslations("chat");

  const queryClient = useQueryClient();
  const chatId = params.id.replace("chat-", "");
  const { data: session } = authClient.useSession();

  const { data: chatResponse, isLoading } = useQuery<SingleChatResponse>({
    queryKey: ["chat", chatId],
    queryFn: () => getChatById(chatId),
    enabled: !!chatId,
  });

  const { data: messagesResponse } = useQuery({
    queryKey: ["messages", chatId],
    queryFn: () => getMessages(chatId),
    enabled: !!chatId,
  });

  const chat = chatResponse?.data
    ? {
        ...chatResponse.data,
        messages:
          messagesResponse?.data?.messages || chatResponse.data.messages || [],
      }
    : undefined;

  const editChatMutation = useMutation({
    mutationFn: (name: string) => updateChat(chatId, { name }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["chat", chatId] });
    },
  });

  useSocket();

  const deleteChatMutation = useMutation({
    mutationFn: () => deleteChat(chatId),
    onSuccess: () => {
      toast({
        title: t("details.deleteGroup.success.title"),
        description: t("details.deleteGroup.success.description"),
      });
      queryClient.invalidateQueries({ queryKey: ["chats"] });
      router.push("/chats");
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: t("details.deleteGroup.error.title"),
        description: t("details.deleteGroup.error.description"),
      });
    },
  });

  const [groupName, setGroupName] = useState(chatResponse?.data?.name || "");
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const handleGroupNameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (groupName !== chatResponse?.data?.name) {
      editChatMutation.mutate(groupName, {
        onSuccess: () => {
          setIsEditDialogOpen(false);
        },
      });
    }
  };

  useEffect(() => {
    if (chatResponse?.data?.name) {
      setGroupName(chatResponse.data.name);
    }
  }, [chatResponse?.data?.name]);

  useLayoutEffect(() => {
    const viewport = scrollContainerRef.current?.querySelector(
      "[data-radix-scroll-area-viewport]"
    );
    if (!viewport) return;

    // Always use requestAnimationFrame to ensure DOM is ready
    requestAnimationFrame(() => {
      if (
        isInitialLoad &&
        (messagesResponse?.data?.messages || chatResponse?.data?.messages)
      ) {
        viewport.scrollTop = viewport.scrollHeight;
        setIsInitialLoad(false);
      } else if (isAtBottom) {
        viewport.scrollTop = viewport.scrollHeight;
      }
    });
  }, [
    messagesResponse?.data?.messages,
    chatResponse?.data?.messages,
    isInitialLoad,
    isAtBottom,
  ]);

  const otherUser =
    chat?.type === "individual"
      ? chat.participants.find((p) => p.user.id !== session?.user.id)?.user
      : null;

  const getChatDisplayName = () => {
    if (!chat) return "";
    if (chat.type === "group") return chat.name;
    return otherUser?.username || "Unknown User";
  };

  const getAvatarFallback = () => {
    const name = getChatDisplayName();
    return name!.charAt(0).toUpperCase();
  };

  const handleMessageInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewMessage(e.target.value);
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    try {
      const messageContent = newMessage.trim();
      setNewMessage(""); // Clear input immediately

      const messageData: CreateMessageData = {
        content: messageContent,
        type: "text",
      };

      // Create optimistic message
      const optimisticMessage: Message = {
        id: `temp-${Date.now()}`,
        content: messageContent,
        type: "text",
        senderId: session!.user.id,
        sender: {
          id: session!.user.id,
          username: session!.user.username!,
          email: session!.user.email!,
          image: session!.user.image!,
        },
        createdAt: new Date().toISOString(),
        status: "sent",
      };

      // Add optimistic update
      queryClient.setQueryData(["messages", chatId], (old: any) => ({
        ...old,
        data: {
          ...old?.data,
          messages: [...(old?.data?.messages || []), optimisticMessage],
        },
      }));

      // Force immediate scroll to bottom when sending
      requestAnimationFrame(() => {
        const viewport = scrollContainerRef.current?.querySelector(
          "[data-radix-scroll-area-viewport]"
        );
        if (viewport) {
          viewport.scrollTop = viewport.scrollHeight;
          setIsAtBottom(true);
        }
      });

      const response = await sendMessage(chatId, messageData);

      if (!response.success) {
        // Remove optimistic message on error
        queryClient.setQueryData(["messages", chatId], (old: any) => ({
          ...old,
          data: {
            ...old?.data,
            messages: old?.data?.messages.filter(
              (m: Message) => m.id !== optimisticMessage.id
            ),
          },
        }));
        throw new Error("Failed to send message");
      }
    } catch (error) {
      console.error("Error sending message:", error);
      toast({
        variant: "destructive",
        title: t("error.title"),
        description: t("error.description"),
      });
    }
  };

  const mapMessageToProps = (message: Message) => ({
    sender: message.sender.username,
    content: message.content,
    time: new Date(message.createdAt),
    isSender: message.senderId === session?.user.id,
    status: message.status,
    type: message.type,
    fileType: message.type === "file" ? "default" : undefined,
    fileName: message.fileName,
    fileSize: message.fileSize?.toString(),
  });

  const [isManageMembersOpen, setIsManageMembersOpen] = useState(false);
  const [memberSearch, setMemberSearch] = useState("");
  const [selectedMembers, setSelectedMembers] = useState<Set<string>>(
    new Set()
  );

  const { data: friendsResponse } = useQuery({
    queryKey: ["friends"],
    queryFn: getFriends,
  });

  const { toast } = useToast();

  const updateMembersMutation = useMutation({
    mutationFn: (data: UpdateChatMembersData) =>
      updateChatMembers(chatId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["chat", chatId] });
      toast({
        title: t("details.manageMembers.success.title"),
        description: t("details.manageMembers.success.description"),
      });
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: t("details.manageMembers.error.title"),
        description: t("details.manageMembers.error.description"),
      });
    },
  });

  const handleUpdateRole = (userId: string, role: "admin" | "member") => {
    updateMembersMutation.mutate({
      roleUpdates: [
        {
          userId,
          role,
        },
      ],
    });
  };

  const handleRemoveMember = (userId: string) => {
    updateMembersMutation.mutate({
      removeMembers: [userId],
    });
  };

  const handleAddMember = (userId: string) => {
    updateMembersMutation.mutate({
      addMembers: [userId],
    });
  };

  const getAvailableFriends = () => {
    if (!friendsResponse?.data || !Array.isArray(friendsResponse.data) || !chat)
      return [];

    const memberIds = new Set(chat.participants.map((p) => p.user.id));
    return friendsResponse.data.filter((friend) => {
      if (!("sender" in friend)) return false;
      const otherUser =
        friend.sender.id === session?.user.id ? friend.receiver : friend.sender;
      return (
        !memberIds.has(otherUser.id) &&
        (otherUser.username
          .toLowerCase()
          .includes(memberSearch.toLowerCase()) ||
          otherUser.email.toLowerCase().includes(memberSearch.toLowerCase()))
      );
    });
  };

  if (error) {
    return (
      <div className="flex h-[calc(100vh-5rem)] items-center justify-center">
        <div className="text-center">
          <h2 className="text-lg font-semibold">{t("states.error.title")}</h2>
          <p className="text-muted-foreground mb-4">
            {t("states.error.description")}
          </p>
          <Button onClick={() => setError(false)}>
            {t("states.error.retry")}
          </Button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex h-[calc(100vh-5rem)] gap-4">
        <div className="flex-1">
          <Card className="h-full">
            <CardHeader className="border-b space-y-0">
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-4 w-24 mt-1" />
            </CardHeader>
            <CardContent className="p-4 space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className={`flex items-start gap-2 ${
                    i % 2 === 0 ? "" : "justify-end"
                  }`}
                >
                  {i % 2 === 0 && <Skeleton className="h-8 w-8 rounded-full" />}
                  <div
                    className={`space-y-2 ${i % 2 === 0 ? "w-1/2" : "w-1/3"}`}
                  >
                    <Skeleton className="h-4" />
                    <Skeleton className="h-4 w-2/3" />
                  </div>
                  {i % 2 !== 0 && <Skeleton className="h-8 w-8 rounded-full" />}
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
        <div className="w-[320px] hidden lg:block">
          <Card className="h-full">
            <CardHeader className="border-b">
              <Skeleton className="h-20 w-20 rounded-full mx-auto" />
              <div className="space-y-2 text-center">
                <Skeleton className="h-6 w-32 mx-auto" />
                <Skeleton className="h-4 w-48 mx-auto" />
              </div>
            </CardHeader>
            <CardContent className="p-4 space-y-4">
              <Skeleton className="h-4 w-24" />
              <div className="space-y-2">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <Skeleton className="h-8 w-8 rounded-full" />
                    <div className="space-y-1 flex-1">
                      <Skeleton className="h-4" />
                      <Skeleton className="h-3 w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-5rem)] gap-4">
      <div className="flex-1 flex ">
        <Card className="flex-1 flex flex-col ">
          <CardHeader className="px-4 py-3 border-b space-y-0 bg-card">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => router.push("/chats")}
                  className="lg:hidden"
                >
                  <ChevronLeft className="h-5 w-5" />
                </Button>

                <Avatar className="h-9 w-9 hidden md:block">
                  {chat?.type === "group" ? (
                    <div className="h-full w-full bg-primary/10 text-primary flex items-center justify-center">
                      <Users className="h-5 w-5" />
                    </div>
                  ) : (
                    <>
                      <AvatarImage
                        src={otherUser?.image}
                        alt={getChatDisplayName()}
                      />
                      <AvatarFallback>{getAvatarFallback()}</AvatarFallback>
                    </>
                  )}
                </Avatar>

                <div className="ml-2">
                  <div className="flex items-center gap-2">
                    <h2 className="font-semibold">{getChatDisplayName()}</h2>
                    {chat?.type === "group" && (
                      <Badge
                        variant="secondary"
                        className="h-5 hidden md:block"
                      >
                        {t("status.membersCount", {
                          count: chat.participants.length,
                        })}
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {chat?.participants.length || 0} {t("status.online")}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <Sheet>
                  <SheetTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="hidden md:flex"
                    >
                      <Search className="h-4 w-4" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="right">
                    <div className="space-y-4">
                      <h2 className="font-semibold">
                        {t("details.search.title")}
                      </h2>
                      <div className="relative">
                        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          className="pl-9"
                          placeholder={t("details.search.placeholder")}
                        />
                      </div>
                    </div>
                  </SheetContent>
                </Sheet>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <Sheet>
                      <SheetTrigger asChild>
                        <DropdownMenuItem
                          className="md:hidden flex"
                          onSelect={(e) => {
                            e.preventDefault();
                          }}
                        >
                          <Search className="mr-2 h-4 w-4" />{" "}
                          {t("details.search.title")}
                        </DropdownMenuItem>
                      </SheetTrigger>
                      <SheetContent side="right">
                        <div className="space-y-4">
                          <h2 className="font-semibold">
                            {t("details.search.title")}
                          </h2>
                          <div className="relative">
                            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                              className="pl-9"
                              placeholder={t("details.search.placeholder")}
                            />
                          </div>
                        </div>
                      </SheetContent>
                    </Sheet>
                    <DropdownMenuItem>
                      <Pin className="mr-2 h-4 w-4" />{" "}
                      {t("details.actions.pinChat")}
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Star className="mr-2 h-4 w-4" />{" "}
                      {t("details.actions.addToFavorites")}
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Volume2 className="mr-2 h-4 w-4" />{" "}
                      {t("details.actions.muteNotifications")}
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <Archive className="mr-2 h-4 w-4" />{" "}
                      {t("details.actions.archiveChat")}
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive">
                      {chat?.type === "group" ? (
                        <>
                          <Trash className="mr-2 h-4 w-4" />{" "}
                          {t("details.actions.deleteGroup")}
                        </>
                      ) : (
                        <>
                          <AlertCircle className="mr-2 h-4 w-4" />
                          {t("details.actions.reportUser")}
                        </>
                      )}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <Sheet>
                  <SheetTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="flex lg:hidden"
                    >
                      <SidebarClose className="h-4 w-4" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent
                    side="right"
                    className="flex flex-col h-full p-0"
                  >
                    <div className="p-4 border-b">
                      <h3 className="text-lg font-semibold">
                        {chat?.type === "group"
                          ? t("details.groupDetails")
                          : t("details.chatDetails")}
                      </h3>
                    </div>
                    <ScrollArea className="flex-1">
                      <div className="px-4 py-2">
                        <div className="text-center pb-4 border-b">
                          <Avatar className="h-16 w-16 mx-auto">
                            {chat?.type === "group" ? (
                              <div className="h-full w-full bg-primary/10 text-primary flex items-center justify-center">
                                <Users className="h-8 w-8" />
                              </div>
                            ) : (
                              <>
                                <AvatarImage
                                  src={otherUser?.image}
                                  alt={getChatDisplayName()}
                                />
                                <AvatarFallback>
                                  {getAvatarFallback()}
                                </AvatarFallback>
                              </>
                            )}
                          </Avatar>
                          <h3 className="mt-2 font-semibold text-lg">
                            {getChatDisplayName()}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {chat?.type === "group"
                              ? t("details.groupInfo")
                              : otherUser?.email}
                          </p>
                        </div>
                        <div className="py-4 space-y-4">
                          <div className="py-4 space-y-4">
                            <div>
                              <h4 className="text-sm font-medium mb-2 mt-4">
                                {chat?.type === "group"
                                  ? t("details.members")
                                  : t("details.participants")}
                              </h4>
                              <div className="space-y-2">
                                {chat?.participants.map((participant) => (
                                  <div
                                    key={participant.user.id}
                                    className="flex items-center justify-between p-2 rounded-lg hover:bg-accent"
                                  >
                                    <div className="flex items-center gap-2">
                                      <Avatar className="h-8 w-8">
                                        <AvatarImage
                                          src={participant.user.image}
                                          alt={participant.user.username}
                                        />
                                        <AvatarFallback>
                                          {participant.user.username.charAt(0)}
                                        </AvatarFallback>
                                      </Avatar>
                                      <div>
                                        <p className="text-sm font-medium">
                                          {participant.user.username}
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                          {participant.role}
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>

                            <div className="space-y-2">
                              <h4 className="text-sm font-medium">
                                {t("details.actions.title")}
                              </h4>
                              <div className="space-y-1">
                                {chat?.type === "group" ? (
                                  <>
                                    <Dialog
                                      open={isEditDialogOpen}
                                      onOpenChange={setIsEditDialogOpen}
                                    >
                                      <DialogTrigger asChild>
                                        <Button
                                          variant="ghost"
                                          className="w-full justify-start"
                                        >
                                          <Edit className="mr-2 h-4 w-4" />{" "}
                                          {t("details.actions.editGroup")}
                                        </Button>
                                      </DialogTrigger>
                                      <DialogContent>
                                        <DialogHeader>
                                          <DialogTitle>
                                            {t("details.edit.title")}
                                          </DialogTitle>
                                        </DialogHeader>
                                        <form
                                          onSubmit={handleGroupNameSubmit}
                                          className="space-y-4"
                                        >
                                          <div className="space-y-2">
                                            <label
                                              htmlFor="name"
                                              className="text-sm font-medium"
                                            >
                                              {t("details.edit.groupName")}
                                            </label>
                                            <Input
                                              id="name"
                                              value={groupName}
                                              onChange={(e) =>
                                                setGroupName(e.target.value)
                                              }
                                            />
                                          </div>
                                          {editChatMutation.isError && (
                                            <p className="text-sm text-destructive">
                                              {t("details.edit.error")}
                                            </p>
                                          )}
                                          <div className="flex justify-end gap-2">
                                            <Button
                                              variant="outline"
                                              type="button"
                                              onClick={() =>
                                                setGroupName(chat?.name || "")
                                              }
                                            >
                                              {t("details.edit.cancel")}
                                            </Button>
                                            <Button
                                              type="submit"
                                              disabled={
                                                !groupName.trim() ||
                                                groupName === chat?.name ||
                                                editChatMutation.isPending
                                              }
                                            >
                                              {editChatMutation.isPending
                                                ? t("details.edit.saving")
                                                : t("details.edit.save")}
                                            </Button>
                                          </div>
                                        </form>
                                      </DialogContent>
                                    </Dialog>
                                    <Button
                                      variant="ghost"
                                      className="w-full justify-start"
                                      onClick={() =>
                                        setIsManageMembersOpen(true)
                                      }
                                    >
                                      <Users className="mr-2 h-4 w-4" />{" "}
                                      {t("details.actions.manageMembers")}
                                    </Button>
                                    <AlertDialogDelete
                                      title={t("details.deleteGroup.title")}
                                      description={t(
                                        "details.deleteGroup.description"
                                      )}
                                      cancel={t("details.deleteGroup.cancel")}
                                      deleteT={t("details.deleteGroup.confirm")}
                                      onDelete={() =>
                                        deleteChatMutation.mutate()
                                      }
                                      isDeleting={deleteChatMutation.isPending}
                                    >
                                      <Button
                                        variant="ghost"
                                        className="w-full justify-start text-destructive"
                                      >
                                        <Trash className="mr-2 h-4 w-4" />{" "}
                                        {t("details.actions.deleteGroup")}
                                      </Button>
                                    </AlertDialogDelete>
                                  </>
                                ) : (
                                  <>
                                    <Button
                                      variant="ghost"
                                      className="w-full justify-start"
                                    >
                                      <Volume2 className="mr-2 h-4 w-4" />
                                      {t("details.actions.muteNotifications")}
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      className="w-full justify-start"
                                    >
                                      <Archive className="mr-2 h-4 w-4" />
                                      {t("details.actions.archiveChat")}
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      className="w-full justify-start"
                                    >
                                      <Slash className="mr-2 h-4 w-4" />
                                      {t("details.actions.blockUser")}
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      className="w-full justify-start text-destructive"
                                    >
                                      <AlertCircle className="mr-2 h-4 w-4" />
                                      {t("details.actions.reportUser")}
                                    </Button>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </ScrollArea>
                  </SheetContent>
                </Sheet>
              </div>
            </div>
          </CardHeader>

          <ScrollArea
            className="flex-1 overflow-hidden [&_[data-radix-scroll-area-viewport]]:scroll-smooth [&_[data-radix-scroll-area-viewport]]:will-change-transform [&_[data-radix-scroll-area-viewport]]:translate-z-0"
            ref={scrollContainerRef}
            onScroll={(e) => {
              const target = e.currentTarget;
              const viewport = target.querySelector(
                "[data-radix-scroll-area-viewport]"
              );
              if (!viewport) return;

              const threshold = 50;
              const distanceFromBottom =
                viewport.scrollHeight -
                viewport.scrollTop -
                viewport.clientHeight;
              setIsAtBottom(distanceFromBottom < threshold);
            }}
          >
            <div className="flex flex-col min-h-[100%] p-4 relative">
              {!chat?.messages || chat.messages.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center p-6">
                  <div className="p-4 rounded-full bg-primary/10">
                    <MessageSquare className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="mt-4 text-lg font-semibold">
                    {t("states.empty.title")}
                  </h3>
                  <p className="text-muted-foreground">
                    {t("states.empty.description")}
                  </p>
                </div>
              ) : (
                <div className="flex-1 space-y-4 min-h-fit relative [&>*]:scroll-mt-4 [&>*]:transition-[transform,opacity] [&>*]:duration-200">
                  {chat.messages.map((message) => (
                    <ChatMessage
                      key={message.id}
                      {...mapMessageToProps(message)}
                    />
                  ))}
                  <div ref={messageEndRef} className="h-4" />
                  <Button
                    size="icon"
                    variant="secondary"
                    className={`absolute bottom-4 right-4 rounded-full shadow-lg transition-all duration-200 ${
                      isAtBottom
                        ? "opacity-0 translate-y-4 pointer-events-none"
                        : "opacity-100 translate-y-0"
                    }`}
                    onClick={() => {
                      const viewport =
                        scrollContainerRef.current?.querySelector(
                          "[data-radix-scroll-area-viewport]"
                        );
                      if (viewport) {
                        viewport.scrollTop = viewport.scrollHeight;
                        setIsAtBottom(true);
                      }
                    }}
                  >
                    <ChevronLeft className="h-4 w-4 -rotate-90" />
                  </Button>
                </div>
              )}
            </div>
          </ScrollArea>

          <CardFooter className="p-3 border-t bg-card">
            <div className="flex items-center gap-2 w-full bg-background rounded-lg p-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Paperclip className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" side="top">
                  <DropdownMenuItem>
                    <ImageIcon className="mr-2 h-4 w-4" />{" "}
                    {t("attachments.image")}
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <FileText className="mr-2 h-4 w-4" />{" "}
                    {t("attachments.file")}
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Mic className="mr-2 h-4 w-4" /> {t("attachments.voice")}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <div className="flex-1 flex items-center gap-2">
                <Input
                  placeholder={t("typeMessage")}
                  value={newMessage}
                  onChange={handleMessageInput}
                  onKeyDown={(e) =>
                    e.key === "Enter" && !e.shiftKey && handleSendMessage()
                  }
                  className="flex-1"
                />
                <Button
                  size="icon"
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim()}
                  className="shrink-0"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardFooter>
        </Card>
      </div>

      <div className="hidden lg:block w-[320px]">
        <Card className="flex flex-col h-full border rounded-xl overflow-hidden">
          <CardHeader className="border-b">
            <div className="text-center">
              <Avatar className="h-20 w-20 mx-auto">
                {chat?.type === "group" ? (
                  <div className="h-full w-full bg-primary/10 text-primary flex items-center justify-center">
                    <Users className="h-10 w-10" />
                  </div>
                ) : (
                  <>
                    <AvatarImage
                      src={otherUser?.image}
                      alt={getChatDisplayName()}
                    />
                    <AvatarFallback>{getAvatarFallback()}</AvatarFallback>
                  </>
                )}
              </Avatar>
              <h3 className="mt-2 font-semibold text-lg">
                {getChatDisplayName()}
              </h3>
              <p className="text-sm text-muted-foreground">
                {chat?.type === "group"
                  ? t("details.groupInfo")
                  : otherUser?.email}
              </p>
            </div>
          </CardHeader>
          <CardContent className="flex-1 space-y-6 overflow-auto">
            <div>
              <h4 className="text-sm font-medium mb-2 mt-4">
                {chat?.type === "group"
                  ? t("details.members")
                  : t("details.participants")}
              </h4>
              <ScrollArea className="h-[280px] pr-4">
                <div className="space-y-2">
                  {chat?.participants.map((participant) => (
                    <div
                      key={participant.user.id}
                      className="flex items-center justify-between p-2 rounded-lg hover:bg-accent"
                    >
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage
                            src={participant.user.image}
                            alt={participant.user.username}
                          />
                          <AvatarFallback>
                            {participant.user.username.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium">
                            {participant.user.username}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {participant.role}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>

            <div className="space-y-2">
              <h4 className="text-sm font-medium">
                {t("details.actions.title")}
              </h4>
              <div className="space-y-1">
                {chat?.type === "group" ? (
                  <>
                    <Dialog
                      open={isEditDialogOpen}
                      onOpenChange={setIsEditDialogOpen}
                    >
                      <DialogTrigger asChild>
                        <Button
                          variant="ghost"
                          className="w-full justify-start"
                        >
                          <Edit className="mr-2 h-4 w-4" />{" "}
                          {t("details.actions.editGroup")}
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>{t("details.edit.title")}</DialogTitle>
                        </DialogHeader>
                        <form
                          onSubmit={handleGroupNameSubmit}
                          className="space-y-4"
                        >
                          <div className="space-y-2">
                            <label
                              htmlFor="name"
                              className="text-sm font-medium"
                            >
                              {t("details.edit.groupName")}
                            </label>
                            <Input
                              id="name"
                              value={groupName}
                              onChange={(e) => setGroupName(e.target.value)}
                            />
                          </div>
                          {editChatMutation.isError && (
                            <p className="text-sm text-destructive">
                              {t("details.edit.error")}
                            </p>
                          )}
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="outline"
                              type="button"
                              onClick={() => setGroupName(chat?.name || "")}
                            >
                              {t("details.edit.cancel")}
                            </Button>
                            <Button
                              type="submit"
                              disabled={
                                !groupName.trim() ||
                                groupName === chat?.name ||
                                editChatMutation.isPending
                              }
                            >
                              {editChatMutation.isPending
                                ? t("details.edit.saving")
                                : t("details.edit.save")}
                            </Button>
                          </div>
                        </form>
                      </DialogContent>
                    </Dialog>
                    <Button
                      variant="ghost"
                      className="w-full justify-start"
                      onClick={() => setIsManageMembersOpen(true)}
                    >
                      <Users className="mr-2 h-4 w-4" />{" "}
                      {t("details.actions.manageMembers")}
                    </Button>
                    <AlertDialogDelete
                      title={t("details.deleteGroup.title")}
                      description={t("details.deleteGroup.description")}
                      cancel={t("details.deleteGroup.cancel")}
                      deleteT={t("details.deleteGroup.confirm")}
                      onDelete={() => deleteChatMutation.mutate()}
                      isDeleting={deleteChatMutation.isPending}
                    >
                      <Button
                        variant="ghost"
                        className="w-full justify-start text-destructive"
                      >
                        <Trash className="mr-2 h-4 w-4" />{" "}
                        {t("details.actions.deleteGroup")}
                      </Button>
                    </AlertDialogDelete>
                  </>
                ) : (
                  <>
                    <Button variant="ghost" className="w-full justify-start">
                      <Volume2 className="mr-2 h-4 w-4" />
                      {t("details.actions.muteNotifications")}
                    </Button>
                    <Button variant="ghost" className="w-full justify-start">
                      <Archive className="mr-2 h-4 w-4" />
                      {t("details.actions.archiveChat")}
                    </Button>
                    <Button variant="ghost" className="w-full justify-start">
                      <Slash className="mr-2 h-4 w-4" />
                      {t("details.actions.blockUser")}
                    </Button>
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-destructive"
                    >
                      <AlertCircle className="mr-2 h-4 w-4" />
                      {t("details.actions.reportUser")}
                    </Button>
                  </>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      <Dialog open={isManageMembersOpen} onOpenChange={setIsManageMembersOpen}>
        <DialogContent className="max-h-[90vh] flex flex-col gap-0">
          <DialogHeader>
            <DialogTitle>{t("details.manageMembers.title")}</DialogTitle>
            <DialogDescription>
              {t("details.manageMembers.description")}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 flex-1 overflow-hidden">
            <div className="relative mt-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              <Input
                placeholder={t("details.manageMembers.searchPlaceholder")}
                value={memberSearch}
                onChange={(e) => setMemberSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <ScrollArea className="flex-1 h-[50vh] border rounded-md">
              <div className="p-4 space-y-4">
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">
                    {t("details.manageMembers.currentMembers")}
                  </h4>
                  {chat?.participants.map((participant) => (
                    <div
                      key={participant.user.id}
                      className="flex items-center justify-between p-2 rounded-lg hover:bg-accent"
                    >
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage
                            src={participant.user.image}
                            alt={participant.user.username}
                          />
                          <AvatarFallback>
                            {participant.user.username.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium">
                            {participant.user.username}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {participant.user.email}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {participant.user.id !== session?.user.id && (
                          <>
                            <Select
                              value={participant.role}
                              onValueChange={(value) =>
                                handleUpdateRole(
                                  participant.user.id,
                                  value as "admin" | "member"
                                )
                              }
                              disabled={updateMembersMutation.isPending}
                            >
                              <SelectTrigger className="w-[110px]">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="admin">
                                  {t("details.manageMembers.admin")}
                                </SelectItem>
                                <SelectItem value="member">
                                  {t("details.manageMembers.member")}
                                </SelectItem>
                              </SelectContent>
                            </Select>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-destructive hover:text-destructive"
                              onClick={() =>
                                handleRemoveMember(participant.user.id)
                              }
                              disabled={updateMembersMutation.isPending}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <Separator />

                <div className="space-y-2">
                  <h4 className="text-sm font-medium">
                    {t("details.manageMembers.addMembers")}
                  </h4>
                  {getAvailableFriends().map((friend) => {
                    const otherUser =
                      "sender" in friend
                        ? friend.sender.id === session?.user.id
                          ? friend.receiver
                          : friend.sender
                        : friend;
                    return (
                      <div
                        key={friend.id}
                        className="flex items-center justify-between p-2 rounded-lg hover:bg-accent"
                      >
                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8">
                            <AvatarImage
                              src={otherUser.image}
                              alt={otherUser.username}
                            />
                            <AvatarFallback>
                              {otherUser.username.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-sm font-medium">
                              {otherUser.username}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {otherUser.email}
                            </p>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleAddMember(otherUser.id)}
                          disabled={updateMembersMutation.isPending}
                        >
                          {updateMembersMutation.isPending ? (
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          ) : (
                            <Plus className="h-4 w-4 mr-2" />
                          )}
                          {t("details.manageMembers.add")}
                        </Button>
                      </div>
                    );
                  })}
                </div>
              </div>
            </ScrollArea>
          </div>
          <DialogFooter className="pt-4">
            <Button
              variant="outline"
              onClick={() => setIsManageMembersOpen(false)}
            >
              {t("details.manageMembers.close")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
