"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { MessageSquareMore } from "lucide-react";
import { type Chat } from "./types";
import { Card } from "@/components/ui/card";
import { ChatList } from "@/components/chats/chat-list";
import { ChatView } from "@/components/chats/chat-view";

export default function ChatsPage() {
  const t = useTranslations("chat");
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);

  return (
    <div className="flex h-[calc(100vh-var(--header-height))] gap-4 p-4">
      <Card className="w-[320px] flex flex-col">
        <ChatList onChatSelect={setSelectedChat} selectedChat={selectedChat} />
      </Card>
      <Card className="flex-1 flex flex-col">
        {selectedChat ? (
          <ChatView chat={selectedChat} />
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="flex flex-col items-center gap-2 text-center px-4">
              <div className="p-4 rounded-full bg-muted/50">
                <MessageSquareMore className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold">{t("selectChat")}</h3>
              <p className="text-sm text-muted-foreground">
                {t("selectChatDescription")}
              </p>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
