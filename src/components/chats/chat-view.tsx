"use client";

import * as React from "react";
import { useTranslations } from "next-intl";
import { Send, SmilePlus } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import type { Chat, Message } from "@/app/[locale]/(protected)/chats/types";
import { cn } from "@/lib/utils";

// Demo messages - replace with real data
const demoMessages: Message[] = [
  {
    id: "1",
    content: "Hi team! 👋",
    sender: {
      id: "1",
      name: "Alice Smith",
      avatar: "https://github.com/shadcn.png",
    },
    timestamp: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
    status: "read",
  },
  {
    id: "2",
    content: "Hey Alice! How's the new design coming along?",
    sender: {
      id: "2",
      name: "Bob Johnson",
    },
    timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
    status: "read",
  },
  {
    id: "3",
    content:
      "I've just finished the initial mockups. I'll share them in a moment.",
    sender: {
      id: "1",
      name: "Alice Smith",
      avatar: "https://github.com/shadcn.png",
    },
    timestamp: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
    status: "delivered",
  },
];

interface ChatViewProps {
  chat: Chat;
}

export function ChatView({ chat }: ChatViewProps) {
  const t = useTranslations("chat");
  const [message, setMessage] = React.useState("");
  const [messages, setMessages] = React.useState(demoMessages);
  const scrollRef = React.useRef<HTMLDivElement>(null);

  const handleSend = () => {
    if (!message.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      content: message,
      sender: {
        id: "current-user", // Replace with actual user ID
        name: "You",
        avatar: "https://github.com/shadcn.png",
      },
      timestamp: new Date(),
      status: "sent",
    };

    setMessages([...messages, newMessage]);
    setMessage("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  React.useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <>
      <CardHeader className="px-4 py-2 border-b shrink-0">
        <h3 className="font-semibold text-lg">{chat.name}</h3>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          {chat.participants.map((participant, i) => (
            <React.Fragment key={participant.id}>
              <span
                className={cn(
                  participant.status === "online" && "text-green-500",
                  participant.status === "away" && "text-yellow-500"
                )}
              >
                {participant.name}
              </span>
              {i < chat.participants.length - 1 && ", "}
            </React.Fragment>
          ))}
        </div>
      </CardHeader>

      <CardContent className="flex-1 p-0 overflow-hidden">
        <ScrollArea className="h-full" ref={scrollRef}>
          <div className="flex flex-col gap-4 p-4">
            {messages.map((msg, i) => {
              const isCurrentUser = msg.sender.id === "current-user";
              const showAvatar =
                i === 0 || messages[i - 1].sender.id !== msg.sender.id;

              return (
                <div
                  key={msg.id}
                  className={cn(
                    "flex gap-3",
                    isCurrentUser && "flex-row-reverse"
                  )}
                >
                  {showAvatar && !isCurrentUser && (
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={msg.sender.avatar} />
                      <AvatarFallback>{msg.sender.name[0]}</AvatarFallback>
                    </Avatar>
                  )}
                  <div
                    className={cn(
                      "flex flex-col gap-1",
                      isCurrentUser && "items-end"
                    )}
                  >
                    {showAvatar && (
                      <span className="text-xs text-muted-foreground px-2">
                        {isCurrentUser ? t("you") : msg.sender.name}
                      </span>
                    )}
                    <div
                      className={cn(
                        "rounded-lg px-3 py-2 text-sm",
                        isCurrentUser
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted"
                      )}
                    >
                      {msg.content}
                    </div>
                    <span className="text-[10px] text-muted-foreground px-2">
                      {msg.timestamp.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                      {isCurrentUser && (
                        <span className="ml-1">
                          {msg.status === "sent" && "✓"}
                          {msg.status === "delivered" && "✓✓"}
                          {msg.status === "read" && (
                            <span className="text-blue-500">✓✓</span>
                          )}
                        </span>
                      )}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollArea>
      </CardContent>

      <CardFooter className="border-t p-3 shrink-0">
        <div className="flex gap-2 w-full">
          <Button
            variant="ghost"
            size="icon"
            className="shrink-0"
            onClick={() => {}} // TODO: Implement emoji picker
          >
            <SmilePlus className="h-5 w-5" />
          </Button>
          <Textarea
            placeholder={t("typeMessage")}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            className="min-h-0"
            rows={1}
          />
          <Button
            className="shrink-0"
            size="icon"
            onClick={handleSend}
            disabled={!message.trim()}
          >
            <Send className="h-5 w-5" />
          </Button>
        </div>
      </CardFooter>
    </>
  );
}
