import { useTranslations } from "next-intl";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageSquare, Search, PlusCircle, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {Link} from "@/i18n/routing";

type Chat = {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: string;
  isGroup: boolean;
  unreadCount: number;
  members?: string[];
};

const initialChats: Chat[] = [
  {
    id: "1",
    title: "Project Brainstorming",
    lastMessage: "Let's schedule a follow-up meeting.",
    timestamp: "2h ago",
    isGroup: true,
    unreadCount: 3,
    members: ["Alice", "Bob", "Charlie"],
  },
  {
    id: "2",
    title: "Task Prioritization",
    lastMessage: "I've updated the priority levels as suggested.",
    timestamp: "1d ago",
    isGroup: false,
    unreadCount: 0,
  },
  {
    id: "3",
    title: "Weekly Planning",
    lastMessage: "Don't forget to add the new project to your schedule.",
    timestamp: "2d ago",
    isGroup: true,
    unreadCount: 5,
    members: ["David", "Eva", "Frank"],
  },
];

export default function ChatsPage() {
  const t = useTranslations("chats");

  return (
    <div className="container py-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">{t("title")}</h1>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          {t("newChat")}
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input className="pl-8" placeholder={t("searchPlaceholder")} />
      </div>

      <ScrollArea className="h-[calc(100vh-12rem)]">
        <div className="grid gap-4">
          {initialChats.map((chat) => (
            <Link href={`/chats/${chat.id}`} key={chat.id}>
              <Card className="p-4 hover:bg-accent transition-colors cursor-pointer">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {chat.isGroup ? (
                      <Users className="h-5 w-5 text-primary" />
                    ) : (
                      <MessageSquare className="h-5 w-5 text-primary" />
                    )}
                    <div>
                      <h3 className="font-semibold">{chat.title}</h3>
                      <p className="text-sm text-muted-foreground line-clamp-1">
                        {chat.lastMessage}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className="text-xs text-muted-foreground">
                      {chat.timestamp}
                    </span>
                    {chat.unreadCount > 0 && (
                      <Badge variant="destructive">
                        {chat.unreadCount}
                      </Badge>
                    )}
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
