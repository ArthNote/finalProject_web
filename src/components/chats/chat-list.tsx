"use client";

import * as React from "react";
import { Search } from "lucide-react";
import { useTranslations } from "next-intl";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import type { Chat } from "@/app/[locale]/(protected)/chats/types";
import { Button } from "@/components/ui/button";
import { CardHeader, CardContent } from "@/components/ui/card";

// Demo chats - replace with real data
const demoChats: Chat[] = [
  {
    id: "1",
    name: "Design Team",
    participants: [
      {
        id: "1",
        name: "Alice Smith",
        avatar: "https://github.com/shadcn.png",
        status: "online",
      },
      {
        id: "2",
        name: "Bob Johnson",
        status: "offline",
      },
    ],
    lastMessage: {
      id: "msg1",
      content: "We need to review the latest mockups",
      sender: {
        id: "1",
        name: "Alice Smith",
      },
      timestamp: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
    },
    unreadCount: 3,
  },
  {
    id: "2",
    name: "Project Planning",
    participants: [
      {
        id: "3",
        name: "Carol Wilson",
        status: "away",
      },
    ],
    lastMessage: {
      id: "msg2",
      content: "Let's schedule the meeting for tomorrow",
      sender: {
        id: "3",
        name: "Carol Wilson",
      },
      timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
    },
  },
];

interface ChatListProps {
  selectedChat: Chat | null;
  onChatSelect: (chat: Chat) => void;
}

export function ChatList({ selectedChat, onChatSelect }: ChatListProps) {
  const t = useTranslations("chat");
  const [search, setSearch] = React.useState("");

  const filteredChats = React.useMemo(() => {
    return demoChats.filter(
      (chat) =>
        chat.name.toLowerCase().includes(search.toLowerCase()) ||
        chat.participants.some((p) =>
          p.name.toLowerCase().includes(search.toLowerCase())
        )
    );
  }, [search]);

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 60) return t("timeAgo.minutes", { count: minutes });
    if (hours < 24) return t("timeAgo.hours", { count: hours });
    if (days < 7) return t("timeAgo.days", { count: days });
    return date.toLocaleDateString();
  };

  return (
    <>
      <CardHeader className="p-3 border-b shrink-0">
        <div className="relative">
          <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder={t("search")}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8"
          />
        </div>
      </CardHeader>
      <CardContent className="p-0 overflow-hidden flex-1">
        <ScrollArea className="h-full">
          <div className="flex flex-col gap-0.5 p-2">
            {filteredChats.map((chat) => (
              <Button
                key={chat.id}
                variant="ghost"
                className={cn(
                  "flex h-auto items-center gap-2 p-2 w-full justify-start relative",
                  selectedChat?.id === chat.id && "bg-muted"
                )}
                onClick={() => onChatSelect(chat)}
              >
                <Avatar className="h-10 w-10 shrink-0">
                  <AvatarImage src={chat.participants[0].avatar} />
                  <AvatarFallback>{chat.name[0]}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col items-start gap-1 overflow-hidden">
                  <div className="flex w-full items-center gap-1">
                    <span className="font-medium">{chat.name}</span>
                    {chat.unreadCount ? (
                      <span className="ml-auto shrink-0 rounded-full bg-primary px-2 py-0.5 text-xs font-medium text-primary-foreground">
                        {chat.unreadCount}
                      </span>
                    ) : null}
                  </div>
                  {chat.lastMessage && (
                    <div className="flex w-full items-center gap-1 text-xs text-muted-foreground">
                      <span className="truncate">
                        {chat.lastMessage.content}
                      </span>
                      <span className="ml-auto shrink-0">
                        {formatTime(chat.lastMessage.timestamp)}
                      </span>
                    </div>
                  )}
                </div>
              </Button>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </>
  );
}
