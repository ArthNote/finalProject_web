"use client";

import React, { useRef, useState, useEffect, useLayoutEffect } from "react";
import { useParams } from "next/navigation";
import { useRouter } from "@/i18n/navigation";
import { useLocale, useTranslations } from "next-intl";
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
  ArrowDown,
  CornerDownRight,
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
import { deleteMessage, getMessages, searchMessages } from "@/lib/api/messages";
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
import { formatDistance } from "date-fns";
import { fr, enUS } from "date-fns/locale";
import { formatDate } from "@/lib/utils/date";
import { SearchMessagesResponse } from "@/types/message";
import { UploadDialog } from "@/components/chat/upload-dialog";

interface ReplyToState {
  id: string;
  content: string;
  sender: string;
  type?: "text" | "file" | "image";
  fileName?: string;
}

export default function ChatPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const [newMessage, setNewMessage] = useState("");
  const [error, setError] = useState<boolean>(false);
  const messageEndRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const [isAtBottom, setIsAtBottom] = useState(true);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [isSearchSheetOpen, setIsSearchSheetOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const t = useTranslations("chat");
  const locale = useLocale() as "en" | "fr";
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [replyTo, setReplyTo] = useState<ReplyToState | null>(null);

  const queryClient = useQueryClient();
  const chatId = params.id.replace("chat-", "");
  const { data: session } = authClient.useSession();

  const { data: chatResponse, isLoading } = useQuery<SingleChatResponse>({
    queryKey: ["chat", chatId],
    queryFn: () => getChatById(chatId),
    enabled: !!chatId,
  });

  const { data: messagesResponse, isLoading: isMsgsLoading } = useQuery({
    queryKey: ["messages", chatId],
    queryFn: () => getMessages(chatId),
    enabled: !!chatId,
  });

  // Add near other queries, after messagesResponse
  const { data: searchResults, isLoading: isLoadingSearch } =
    useQuery<SearchMessagesResponse>({
      queryKey: ["messages", chatId, "search", searchQuery],
      queryFn: () => searchMessages(chatId, searchQuery),
      enabled: isSearching && searchQuery.length > 0,
    });

  const chat = chatResponse?.data
    ? {
        ...chatResponse.data,
        messages:
          messagesResponse?.data?.messages || chatResponse.data.messages || [],
      }
    : undefined;

  useEffect(() => {
    const container = bottomRef.current;
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  }, [messagesResponse, isMsgsLoading]);

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
        replyToId: replyTo?.id, // Add the reply ID if replying
      };

      // Clear the reply after sending
      if (replyTo) {
        setReplyTo(null);
      }

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
        // Add reply info if replying
        replyTo: replyTo
          ? {
              id: replyTo.id,
              content: replyTo.content,
              sender: {
                username: replyTo.sender,
              },
              type: replyTo.type,
            }
          : undefined,
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

  const deleteMessageMutation = useMutation({
    mutationFn: (messageId: string) => deleteMessage(messageId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["messages", chatId] });
      toast({
        title: t("message.deleteSuccess.title"),
        description: t("message.deleteSuccess.description"),
      });
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: t("message.deleteError.title"),
        description: t("message.deleteError.description"),
      });
    },
  });

  const handleDeleteMessage = (messageId: string) => {
    deleteMessageMutation.mutate(messageId);
  };

  // Add a function to handle message reply
  const handleReplyToMessage = (message: Message) => {
    setReplyTo({
      id: message.id,
      content: message.content,
      sender: message.sender.username,
      type: message.type,
      fileName: message.fileName,
    });

    // Focus the input field
    const inputField = document.querySelector(
      'input[placeholder="' + t("typeMessage") + '"]'
    ) as HTMLInputElement;
    if (inputField) {
      inputField.focus();
    }
  };

  // Navigate to a referenced message (for replies)
  const handleReplyReferenceClick = (referencedMessageId: string) => {
    scrollToMessage(referencedMessageId);
  };

  // Update the mapMessageToProps function
  const mapMessageToProps = (message: Message) => ({
    messageId: message.id,
    sender: message.sender.username,
    content: message.content,
    time: new Date(message.createdAt),
    isSender: message.senderId === session?.user.id,
    status: message.status,
    type: message.type,
    fileType: message.type === "file" ? "default" : undefined,
    fileName: message.fileName,
    fileSize: message.fileSize?.toString(),
    onDelete: () => handleDeleteMessage(message.id),
    onReply: () => handleReplyToMessage(message),
    onReplyClick: handleReplyReferenceClick, // Add this handler
    replyTo: message.replyTo
      ? {
          id: message.replyTo.id,
          content: message.replyTo.content,
          sender: message.replyTo.sender.username,
          type: message.replyTo.type,
        }
      : undefined,
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

  const scrollToMessage = (messageId: string) => {
    const viewport = scrollContainerRef.current?.querySelector(
      "[data-radix-scroll-area-viewport]"
    );
    const messageElement = viewport?.querySelector(`#message-${messageId}`);

    if (messageElement && viewport) {
      // Close search sheet
      setIsSearchSheetOpen(false);

      // Calculate position
      const viewportRect = viewport.getBoundingClientRect();
      const messageRect = messageElement.getBoundingClientRect();
      const relativeTop = messageRect.top - viewportRect.top;

      // Scroll and highlight
      viewport.scrollTo({
        top: viewport.scrollTop + relativeTop - viewportRect.height / 2,
        behavior: "smooth",
      });

      // Add highlight effect with a flash animation
      (messageElement as HTMLElement).style.backgroundColor = "var(--accent)";
      setTimeout(() => {
        (messageElement as HTMLElement).style.backgroundColor = "";
      }, 1500);
    }
  };

  // Update handleFileSelect to check file size
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log("File input changed event triggered");

    if (!e.target.files) {
      console.log("No files in event target");
      return;
    }

    console.log(
      "Files array:",
      Array.from(e.target.files).map((f) => f.name)
    );

    const file = e.target.files[0];
    if (!file) {
      console.log("No file selected");
      return;
    }

    console.log("Selected file:", {
      name: file.name,
      type: file.type,
      size: file.size,
    });

    // Increased to 40MB to stay under server limit
    const maxSize = 40 * 1024 * 1024; // 40MB
    if (file.size > maxSize) {
      console.log("File too large:", file.size);
      toast({
        variant: "destructive",
        title: t("error.upload.tooLarge.title"),
        description: t("error.upload.tooLarge.description", { size: "40MB" }),
      });
      return;
    }

    // Open dialog first, then set the file
    console.log("Opening upload dialog and setting file");
    setSelectedFile(file);
    setIsUploadDialogOpen(true);
  };

  // Add button handlers for file selection
  const handleImageButtonClick = () => {
    console.log("Image button clicked");
    if (imageInputRef.current) {
      console.log("Clicking image input");
      imageInputRef.current.click();
    }
  };

  const handleFileButtonClick = () => {
    console.log("File button clicked");
    if (fileInputRef.current) {
      console.log("Clicking file input");
      fileInputRef.current.click();
    }
  };

  // Update handleUpload function for better file handling
  const handleUpload = async () => {
    console.log("Starting upload...");
    if (!selectedFile) {
      console.log("No file to upload");
      return;
    }

    try {
      console.log("File to upload:", {
        name: selectedFile.name,
        type: selectedFile.type,
        size: selectedFile.size,
      });

      setIsUploading(true);

      // Create optimistic message with proper ID to track
      const optimisticId = `temp-${Date.now()}`;
      const optimisticMessage = {
        id: optimisticId,
        content: "Uploading...",
        type: selectedFile.type.startsWith("image/") ? "image" : "file",
        fileName: selectedFile.name,
        fileSize: selectedFile.size,
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
      queryClient.setQueryData(["messages", chatId], (old: any) => {
        const oldMessages = old?.data?.messages || [];
        return {
          ...old,
          data: {
            ...old?.data,
            messages: [...oldMessages, optimisticMessage],
          },
        };
      });

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

      // Convert file to base64
      console.log("Converting file to base64...");
      const reader = new FileReader();
      reader.readAsDataURL(selectedFile);

      reader.onerror = (error) => {
        console.error("Error reading file:", error);
        // Remove optimistic message on error
        queryClient.setQueryData(["messages", chatId], (old: any) => ({
          ...old,
          data: {
            ...old?.data,
            messages: old?.data?.messages.filter(
              (m: Message) => m.id !== optimisticId
            ),
          },
        }));

        toast({
          variant: "destructive",
          title: t("error.upload.title"),
          description: t("error.upload.description"),
        });
        setIsUploading(false);
      };

      reader.onload = async () => {
        try {
          console.log(
            "File converted to base64, length:",
            (reader.result as string).length
          );

          const base64 = reader.result as string;

          const messageData: CreateMessageData = {
            content: "",
            type: selectedFile.type.startsWith("image/") ? "image" : "file",
            fileName: selectedFile.name,
            fileSize: selectedFile.size,
            fileData: base64,
          };

          console.log("Sending message data:", {
            type: messageData.type,
            fileName: messageData.fileName,
            fileSize: messageData.fileSize,
            fileDataLength: messageData.fileData?.length,
          });

          const response = await sendMessage(chatId, messageData);
          console.log("Upload response:", response);

          if (!response.success) {
            throw new Error("Failed to upload file");
          }

          // Update UI with the real message
          queryClient.setQueryData(["messages", chatId], (old: any) => {
            const oldMessages = old?.data?.messages || [];
            // Replace the optimistic message with the real one
            return {
              ...old,
              data: {
                ...old?.data,
                messages: oldMessages
                  .filter((m: Message) => m.id !== optimisticId)
                  .concat(response.data),
              },
            };
          });

          setIsUploading(false);
          setIsUploadDialogOpen(false);
          setSelectedFile(null);
        } catch (error) {
          console.error("API error during upload:", error);

          // Remove optimistic message on error
          queryClient.setQueryData(["messages", chatId], (old: any) => ({
            ...old,
            data: {
              ...old?.data,
              messages: old?.data?.messages.filter(
                (m: Message) => m.id !== optimisticId
              ),
            },
          }));

          toast({
            variant: "destructive",
            title: t("error.upload.title"),
            description: t("error.upload.description"),
          });
          setIsUploading(false);
        }
      };
    } catch (error) {
      console.error("Error in upload process:", error);
      toast({
        variant: "destructive",
        title: t("error.upload.title"),
        description: t("error.upload.description"),
      });
      setIsUploading(false);
    }
  };

  const scrollToBottom = (event?: React.MouseEvent<HTMLButtonElement>) => {
    event?.preventDefault();
    const viewport = scrollContainerRef.current?.querySelector(
      "[data-radix-scroll-area-viewport]"
    );
    if (viewport) {
      viewport.scrollTop = viewport.scrollHeight;
      setIsAtBottom(true);
    }
  };

  return (
    <>
      <div className="flex h-[calc(100vh-5rem)] gap-4">
        <div className="flex-1 min-w-0">
          <Card className="h-full flex flex-col">
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
                  {/* Add scroll to bottom button here, before the search button */}
                  <Button variant="ghost" size="icon" onClick={scrollToBottom}>
                    <ArrowDown className="h-4 w-4" />
                  </Button>

                  <Sheet
                    open={isSearchSheetOpen}
                    onOpenChange={setIsSearchSheetOpen}
                  >
                    <SheetTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <Search className="h-4 w-4" />
                      </Button>
                    </SheetTrigger>
                    <SheetContent side="right">
                      <div className="space-y-4 h-full flex flex-col">
                        <div>
                          <h2 className="font-semibold mb-2">
                            {t("details.search.title")}
                          </h2>
                          <div className="relative">
                            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                              className="pl-9"
                              placeholder={t("details.search.placeholder")}
                              value={searchQuery}
                              onChange={(e) => {
                                setSearchQuery(e.target.value);
                                setIsSearching(true);
                              }}
                            />
                          </div>
                        </div>

                        <ScrollArea className="flex-1">
                          {isLoadingSearch ? (
                            <div className="space-y-4 p-2">
                              {Array(3)
                                .fill(null)
                                .map((_, i) => (
                                  <Skeleton
                                    key={i}
                                    className="h-[60px] w-full"
                                  />
                                ))}
                            </div>
                          ) : searchResults?.data ? (
                            <div className="space-y-4 p-2">
                              {searchResults.data.map((message) => (
                                <div
                                  key={message.id}
                                  className="p-3 rounded-lg border hover:bg-accent cursor-pointer"
                                  onClick={() => {
                                    scrollToMessage(message.id);
                                  }}
                                >
                                  <div className="flex items-center gap-2 mb-1">
                                    <span className="font-medium text-sm">
                                      {message.sender.username}
                                    </span>
                                    <span className="text-xs text-muted-foreground">
                                      {formatDate(
                                        message.createdAt,
                                        "relative",
                                        locale
                                      )}
                                    </span>
                                  </div>
                                  <p className="text-sm text-muted-foreground line-clamp-2">
                                    {message.content}
                                  </p>
                                </div>
                              ))}
                            </div>
                          ) : searchQuery ? (
                            <div className="text-center p-4 text-muted-foreground">
                              {t("states.empty.noResults")}
                            </div>
                          ) : null}
                        </ScrollArea>
                      </div>
                    </SheetContent>
                  </Sheet>

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
                                            {participant.user.username.charAt(
                                              0
                                            )}
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
                                        deleteT={t(
                                          "details.deleteGroup.confirm"
                                        )}
                                        onDelete={() =>
                                          deleteChatMutation.mutate()
                                        }
                                        isDeleting={
                                          deleteChatMutation.isPending
                                        }
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
              className="flex-1 overflow-hidden px-4"
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
              <div className="py-4">
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
                  <div className="space-y-4">
                    {chat.messages.map((message, index) => {
                      const currentIndex = index;
                      const previousMessage = chat.messages[index - 1];
                      const isSameSender =
                        previousMessage?.sender.id === message.sender.id;

                      return (
                        <ChatMessage
                          key={message.id}
                          showName={!isSameSender}
                          {...mapMessageToProps(message)}
                        />
                      );
                    })}
                  </div>
                )}
              </div>
            </ScrollArea>

            {/* Add floating button for mobile view that appears when not at bottom */}
            <div
              className={`fixed bottom-24 right-6 z-10 transition-opacity duration-200 ${
                isAtBottom ? "opacity-0 pointer-events-none" : "opacity-100"
              }`}
            >
              <Button
                size="icon"
                className="rounded-full shadow-md"
                onClick={scrollToBottom}
              >
                <ArrowDown className="h-4 w-4" />
              </Button>
            </div>

            <CardFooter className="p-3 border-t bg-card">
              {replyTo && (
                <div className="absolute left-0 right-0 -top-16 bg-background border-t p-2 flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <CornerDownRight className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">
                      {t("message.replyingTo")}
                    </span>
                    <span className="text-sm">{replyTo.sender}</span>
                    <span className="text-sm text-muted-foreground truncate max-w-[300px]">
                      {replyTo.content}
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setReplyTo(null)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}
              <div className="flex items-center gap-2 w-full bg-background rounded-lg p-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <Paperclip className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" side="top">
                    <DropdownMenuItem
                      onClick={handleImageButtonClick}
                      className="cursor-pointer"
                    >
                      <ImageIcon className="mr-2 h-4 w-4" />{" "}
                      {t("attachments.image")}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={handleFileButtonClick}
                      className="cursor-pointer"
                    >
                      <FileText className="mr-2 h-4 w-4" />{" "}
                      {t("attachments.file")}
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

      <UploadDialog
        file={selectedFile!}
        isOpen={isUploadDialogOpen}
        onClose={() => {
          setIsUploadDialogOpen(false);
          setSelectedFile(null);
        }}
        onUpload={handleUpload}
        isLoading={isUploading}
      />

      {/* Add hidden file inputs outside the dropdown */}
      <input
        ref={imageInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileSelect}
      />
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        onChange={handleFileSelect}
      />
    </>
  );
}
