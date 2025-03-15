"use client";

import React, { useRef, useState, useEffect } from "react";
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
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import ChatMessage from "@/components/chat/chat-message";

interface Message {
  id: number;
  sender: string;
  content: string;
  time: string;
  isSender: boolean;
  status?: "sent" | "delivered" | "read";
  type?: "text" | "file";
  fileType?: string;
  fileName?: string;
  fileSize?: string;
}

interface Member {
  id: number;
  name: string;
  status: "online" | "offline" | "idle";
  role: string;
}

interface Chat {
  name: string;
  type: "group" | "individual";
  unreadCount?: number;
  status?: "online" | "offline";
  lastSeen?: string;
  description: string;
  members: Member[];
  messages: Message[];
}

// Mock chat data
const chatData: Record<string, Chat> = {
  "1": {
    name: "Project Alpha",
    type: "group",
    unreadCount: 3,
    description: "Team collaboration for Project Alpha development",
    members: [
      { id: 1, name: "John Doe", status: "online", role: "Admin" },
      { id: 2, name: "Sarah Wilson", status: "online", role: "Member" },
      { id: 3, name: "Mike Chen", status: "offline", role: "Member" },
      { id: 4, name: "Lisa Johnson", status: "offline", role: "Member" },
      { id: 5, name: "Alex Kim", status: "online", role: "Member" },
    ],
    messages: [
      {
        id: 1,
        sender: "John Doe",
        content:
          "Hey team! Just pushed the latest UI updates to the staging environment. Could everyone take a look and provide feedback?",
        time: "9:00 AM",
        isSender: false,
      },
      {
        id: 2,
        sender: "Sarah Wilson",
        content:
          "On it! I'll review the changes and test for responsiveness across different devices.",
        time: "9:02 AM",
        isSender: false,
      },
      {
        id: 3,
        sender: "You",
        content:
          "Thanks John! I noticed the new animations are much smoother. Great work on optimizing those transitions! 🚀",
        time: "9:05 AM",
        isSender: true,
      },
      {
        id: 4,
        sender: "Mike Chen",
        content:
          "Quick question - are we using the new design system components for the modals? Some of them look different from our documentation.",
        time: "9:10 AM",
        isSender: false,
      },
      {
        id: 5,
        sender: "John Doe",
        content:
          "Good catch Mike! We're in the process of updating all modals to the new spec. I've created a Jira ticket to track the remaining ones.",
        time: "9:12 AM",
        isSender: false,
      },
      {
        id: 6,
        sender: "You",
        content:
          "I can help with the modal updates. I'm free this afternoon to work on it. 💪",
        time: "9:15 AM",
        isSender: true,
      },
    ],
  },
  "2": {
    name: "Sarah Wilson",
    type: "individual",
    status: "online",
    lastSeen: "2 minutes ago",
    description: "UI/UX Designer",
    members: [
      { id: 1, name: "Sarah Wilson", status: "online", role: "Member" },
    ],
    messages: [
      {
        id: 1,
        sender: "Sarah Wilson",
        content:
          "Hi! I've just finished the design mockups for the new feature.",
        time: "10:00 AM",
        isSender: false,
        status: "read",
      },
      {
        id: 2,
        sender: "You",
        content: "Great! Can you share them with me?",
        time: "10:02 AM",
        isSender: true,
        status: "read",
      },
      {
        id: 3,
        sender: "Sarah Wilson",
        content: "Sure! Here they are:",
        time: "10:05 AM",
        isSender: false,
        status: "read",
      },
      {
        id: 4,
        sender: "Sarah Wilson",
        content: "[Design Mockup.fig]",
        time: "10:05 AM",
        isSender: false,
        type: "file",
        fileType: "fig",
        fileName: "Design Mockup.fig",
        fileSize: "2.4 MB",
        status: "read",
      },
      {
        id: 5,
        sender: "You",
        content: "These look amazing! The color scheme works really well.",
        time: "10:10 AM",
        isSender: true,
        status: "delivered",
      },
    ],
  },
  "3": {
    name: "Mike Chen",
    type: "individual",
    status: "offline",
    lastSeen: "1 hour ago",
    description: "Backend Developer",
    members: [{ id: 1, name: "Mike Chen", status: "offline", role: "Member" }],
    messages: [],
  },
};

export default function ChatPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<boolean>(false);
  const messageEndRef = useRef<HTMLDivElement>(null);
  const chat = chatData[params.id as keyof typeof chatData];
  const t = useTranslations("chat");

  // Add current user to members list for individual chats
  const currentUser: Member = {
    id: 0,
    name: "You",
    status: "online",
    role: "Member",
  };
  const members =
    chat?.type === "individual"
      ? [currentUser, ...chat.members]
      : chat?.members;

  // Simulate loading state
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    // Handle sending message logic here
    setNewMessage("");
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
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
      <div className="flex-1 flex">
        <Card className="flex-1 flex flex-col">
          {/* Chat Header */}
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
                  <AvatarFallback>{chat?.name.charAt(0)}</AvatarFallback>
                </Avatar>

                <div className="ml-2">
                  <div className="flex items-center gap-2">
                    <h2 className="font-semibold">{chat?.name}</h2>
                    {chat?.type === "group" && (
                      <Badge
                        variant="secondary"
                        className="h-5 hidden md:block"
                      >
                        {t("status.membersCount", { count: members?.length })}
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {members?.filter((m) => m.status === "online").length}{" "}
                    {t("status.online")}
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
                            <AvatarFallback>
                              {chat?.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <h3 className="mt-2 font-semibold text-lg">
                            {chat?.name}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {chat?.description}
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
                                {members?.map((member) => (
                                  <div
                                    key={member.id}
                                    className="flex items-center justify-between p-2 rounded-lg hover:bg-accent"
                                  >
                                    <div className="flex items-center gap-2">
                                      <Avatar className="h-8 w-8">
                                        <AvatarFallback>
                                          {member.name.charAt(0)}
                                        </AvatarFallback>
                                      </Avatar>
                                      <div>
                                        <p className="text-sm font-medium">
                                          {member.name}
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                          {member.role}
                                        </p>
                                      </div>
                                    </div>
                                    <div
                                      className={`h-2 w-2 rounded-full ${
                                        member.status === "online"
                                          ? "bg-green-500"
                                          : member.status === "idle"
                                          ? "bg-yellow-500"
                                          : "bg-gray-300"
                                      }`}
                                    />
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
                                    <Button
                                      variant="ghost"
                                      className="w-full justify-start"
                                    >
                                      <Edit className="mr-2 h-4 w-4" />{" "}
                                      {t("details.actions.editGroup")}
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      className="w-full justify-start"
                                    >
                                      <UserPlus className="mr-2 h-4 w-4" />{" "}
                                      {t("details.actions.addMembers")}
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      className="w-full justify-start text-destructive"
                                    >
                                      <Trash className="mr-2 h-4 w-4" />{" "}
                                      {t("details.actions.deleteGroup")}
                                    </Button>
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

          {/* Messages Section */}
          <ScrollArea className="flex-1 px-4 py-6">
            {chat?.messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center">
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
              <div className="space-y-8">
                {chat?.messages.map((message) => (
                  <ChatMessage key={message.id} {...message} />
                ))}
                <div ref={messageEndRef} className="h-4" />
              </div>
            )}
          </ScrollArea>

          {/* Message Input */}
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
                  onChange={(e) => setNewMessage(e.target.value)}
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

      {/* Right Sidebar - Info Panel */}
      <div className="hidden lg:block w-[320px]">
        <Card className="flex flex-col h-full border rounded-xl overflow-hidden">
          <CardHeader className="border-b">
            <div className="text-center">
              <Avatar className="h-20 w-20 mx-auto">
                <AvatarFallback>{chat?.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <h3 className="mt-2 font-semibold text-lg">{chat?.name}</h3>
              <p className="text-sm text-muted-foreground">
                {chat?.description}
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
                  {members?.map((member) => (
                    <div
                      key={member.id}
                      className="flex items-center justify-between p-2 rounded-lg hover:bg-accent"
                    >
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback>
                            {member.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium">{member.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {member.role}
                          </p>
                        </div>
                      </div>
                      <div
                        className={`h-2 w-2 rounded-full ${
                          member.status === "online"
                            ? "bg-green-500"
                            : member.status === "idle"
                            ? "bg-yellow-500"
                            : "bg-gray-300"
                        }`}
                      />
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
                    <Button variant="ghost" className="w-full justify-start">
                      <Edit className="mr-2 h-4 w-4" />{" "}
                      {t("details.actions.editGroup")}
                    </Button>
                    <Button variant="ghost" className="w-full justify-start">
                      <UserPlus className="mr-2 h-4 w-4" />{" "}
                      {t("details.actions.addMembers")}
                    </Button>
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-destructive"
                    >
                      <Trash className="mr-2 h-4 w-4" />{" "}
                      {t("details.actions.deleteGroup")}
                    </Button>
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
  );
}
