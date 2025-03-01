"use client";

import React, { useState } from "react";
import { useRouter } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  PlusCircle,
  Users,
  User,
  Search,
  Filter,
  MessageSquare,
  Hash,
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";

const contacts = [
  { id: 1, name: "Sarah Wilson", status: "online", avatar: null },
  { id: 2, name: "Mike Chen", status: "online", avatar: null },
  { id: 3, name: "Alex Kim", status: "offline", avatar: null },
  { id: 4, name: "Emma Thompson", status: "online", avatar: null },
  { id: 5, name: "James Rodriguez", status: "offline", avatar: null },
  { id: 6, name: "Lisa Wang", status: "offline", avatar: null },
  { id: 7, name: "David Park", status: "online", avatar: null },
  { id: 8, name: "Sophie Martin", status: "offline", avatar: null },
];

const recentChats = [
  {
    id: "1",
    name: "Project Alpha",
    type: "group",
    lastMessage: "Meeting at 3 PM tomorrow",
    timestamp: "2:30 PM",
    unread: 3,
    members: 5,
  },
  {
    id: "2",
    name: "Sarah Wilson",
    type: "direct",
    lastMessage: "Could you review the design?",
    timestamp: "11:20 AM",
    unread: 1,
  },
  {
    id: "3",
    name: "Development Team",
    type: "team",
    lastMessage: "New deployment completed",
    timestamp: "Yesterday",
    unread: 0,
    members: 8,
  },
  {
    id: "4",
    name: "Marketing Group",
    type: "group",
    lastMessage: "Campaign updates for Q1",
    timestamp: "Yesterday",
    unread: 2,
    members: 6,
  },
  {
    id: "5",
    name: "Mike Chen",
    type: "direct",
    lastMessage: "Thanks for the help!",
    timestamp: "2 days ago",
    unread: 0,
  },
];

export default function ChatComponent() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const t = useTranslations("chats");

  function handleChatSelect(chatId: string) {
    router.push(`/chats/${chatId}`);
  }

  function handleTypeSelect(type: string) {
    setSelectedType(type);
  }

  const getStatusColor = (status: string) =>
    status === "online" ? "bg-green-500" : "bg-gray-400";

  const filteredChats = recentChats.filter(
    (chat) => selectedType === "all" || chat.type === selectedType
  );

  const onlineCount = contacts.filter((c) => c.status === "online").length;
  const contactsCount = contacts.length;

  return (
    <main className="h-[calc(100vh-5rem)] ">
      <Card className="flex h-full overflow-hidden">
        {/* Mobile and Desktop Layout */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Header */}
          <header className="p-3 sm:p-4 md:p-6 border-b">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
              <div>
                <h1 className="text-xl sm:text-2xl font-semibold">{t("title")}</h1>
                <p className="text-sm text-muted-foreground">
                  {t("subtitle")}
                </p>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="w-full sm:w-auto">
                    <PlusCircle className="h-4 w-4 mr-2" />
                    {t("newChat")}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem>
                    <MessageSquare className="mr-2 h-4 w-4" />
                    {t("newChatOptions.individual")}
                  </DropdownMenuItem>
                  <DropdownMenuItem>
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
                  variant={selectedType === "direct" ? "default" : "ghost"}
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
                <Button
                  variant={selectedType === "team" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => handleTypeSelect("team")}
                  className="flex-none"
                >
                  <Users className="h-4 w-4 mr-2" />
                  {t("filters.teams")}
                </Button>
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
                    {contactsCount}
                  </Badge>
                </Button>
              </div>
            </div>
          </header>

          {/* Main Content Area */}
          <div className="overflow-y-auto flex-1">
            {selectedType === "contacts" ? (
              // Contacts View
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12"></TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead className="text-right">Status</TableHead>
                      <TableHead className="w-12 text-right">
                        <MessageSquare className="h-4 w-4 ml-auto" />
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {contacts.map((contact) => (
                      <TableRow
                        key={contact.id}
                        onClick={() => handleChatSelect(`user-${contact.id}`)}
                        className="cursor-pointer hover:bg-accent"
                      >
                        <TableCell className="p-2">
                          <div className="relative">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback className="bg-primary/10 text-primary">
                                {contact.name.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <span
                              className={cn(
                                "absolute bottom-0 right-0 h-2 w-2 rounded-full ring-2 ring-background",
                                getStatusColor(contact.status)
                              )}
                            />
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">
                          {contact.name}
                        </TableCell>
                        <TableCell
                          className={cn(
                            "text-right text-xs capitalize",
                            contact.status === "online"
                              ? "text-green-500"
                              : "text-muted-foreground/70"
                          )}
                        >
                          {t(`contacts.${contact.status}`)}
                        </TableCell>
                        <TableCell className="p-2 text-right">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                          >
                            <MessageSquare className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              // Chat List View
              <div className="overflow-y-auto">
                {filteredChats.map((chat) => (
                  <div
                    key={chat.id}
                    onClick={() => handleChatSelect(chat.id)}
                    className="p-3 mx-2 my-1 flex items-center gap-3 rounded-lg hover:bg-accent cursor-pointer"
                  >
                    <div className="relative shrink-0">
                      <Avatar>
                        {chat.type !== "direct" ? (
                          <div className="h-full w-full bg-primary/10 text-primary flex items-center justify-center">
                            <Hash className="h-5 w-5" />
                          </div>
                        ) : (
                          <AvatarFallback className="bg-primary/10 text-primary">
                            {chat.name.charAt(0)}
                          </AvatarFallback>
                        )}
                      </Avatar>
                      {chat.type !== "direct" && (
                        <div className="absolute -bottom-0.5 -right-0.5 bg-background rounded-full p-0.5 shadow-sm border">
                          <Users className="h-3 w-3 text-muted-foreground" />
                        </div>
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-medium truncate">
                          {chat.name}
                        </span>
                        <span className="text-xs text-muted-foreground ml-2">
                          {chat.timestamp}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <p className="text-sm text-muted-foreground truncate">
                          {chat.lastMessage}
                        </p>
                        {chat.unread > 0 && (
                          <Badge
                            variant="default"
                            className="h-5 min-w-[20px] flex items-center justify-center px-1 rounded-full flex-none"
                          >
                            {chat.unread}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
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
                {t("contacts.activeNow", { count: onlineCount })}
              </p>
            </div>
            <div className="overflow-y-auto flex-1">
              {contacts.map((contact) => (
                <div
                  key={contact.id}
                  onClick={() => handleChatSelect(`user-${contact.id}`)}
                  className="p-2 mx-2 my-1 flex items-center gap-3 rounded-lg hover:bg-accent cursor-pointer"
                >
                  <div className="relative flex-none">
                    <Avatar className="h-9 w-9">
                      <AvatarFallback className="bg-primary/10 text-primary">
                        {contact.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <span
                      className={cn(
                        "absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full ring-2 ring-background",
                        getStatusColor(contact.status)
                      )}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline justify-between gap-2">
                      <span className="text-sm font-medium truncate">
                        {contact.name}
                      </span>
                      <span
                        className={cn(
                          "text-xs capitalize",
                          contact.status === "online"
                            ? "text-green-500"
                            : "text-muted-foreground/70"
                        )}
                      >
                        {t(`contacts.${contact.status}`)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </aside>
        )}
      </Card>
    </main>
  );
}
