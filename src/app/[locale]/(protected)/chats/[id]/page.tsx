"use client";

import React, { useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card";
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

// Mock chat data (same as before)
const chatData = {
  chat1: {
    name: "Project Alpha",
    type: "group",
    description: "Team collaboration for Project Alpha development",
    members: [
      { id: 1, name: "John Doe", status: "online", role: "Admin" },
      { id: 2, name: "Sarah Wilson", status: "online", role: "Member" },
      { id: 3, name: "Mike Chen", status: "offline", role: "Member" },
      { id: 4, name: "Lisa Johnson", status: "idle", role: "Member" },
      { id: 5, name: "Alex Kim", status: "online", role: "Member" },
    ],
    messages: Array.from({ length: 15 }, (_, i) => ({
      id: i + 1,
      sender: i % 3 === 0 ? "John Doe" : i % 3 === 1 ? "You" : "Sarah Wilson",
      content: i % 3 === 0 
        ? "Here's another update for the team!"
        : i % 3 === 1 
        ? "Thanks for keeping us updated. Making good progress here."
        : "Great work everyone! Keep it up!",
      time: `${Math.floor(i / 2)}:${i % 2 === 0 ? "00" : "30"} ${i < 6 ? "PM" : "AM"}`,
      isSender: i % 3 === 1,
    })),
  },
};

export default function ChatPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const [newMessage, setNewMessage] = useState("");
  const messageEndRef = useRef<HTMLDivElement>(null);
  const chat = chatData[params.id as keyof typeof chatData];

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    // Handle sending message logic here
    setNewMessage("");
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="container py-6 h-[calc(100vh-4rem)]">
      <Card className="grid lg:grid-cols-[1fr,280px] h-full overflow-hidden">
        <div className="flex flex-col h-full">
          {/* Chat Header */}
          <CardHeader className="px-4 py-2 border-b space-y-0">
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

                <Avatar className="h-9 w-9">
                  <AvatarFallback>{chat?.name.charAt(0)}</AvatarFallback>
                </Avatar>

                <div className="ml-2">
                  <div className="flex items-center gap-2">
                    <h2 className="font-semibold">{chat?.name}</h2>
                    {chat?.type === "group" && (
                      <Badge variant="secondary" className="h-5">
                        {chat.members.length} members
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {chat?.members.filter((m) => m.status === "online").length} online
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <Button variant="ghost" size="icon">
                  <Phone className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon">
                  <Video className="h-4 w-4" />
                </Button>
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <Search className="h-4 w-4" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="right">
                    <div className="space-y-4">
                      <h2 className="font-semibold">Search in Conversation</h2>
                      <div className="relative">
                        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input className="pl-9" placeholder="Search messages..." />
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
                    <DropdownMenuItem>
                      <Pin className="mr-2 h-4 w-4" /> Pin Chat
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Star className="mr-2 h-4 w-4" /> Add to Favorites
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Volume2 className="mr-2 h-4 w-4" /> Mute Notifications
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <Archive className="mr-2 h-4 w-4" /> Archive Chat
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive">
                      <Trash className="mr-2 h-4 w-4" /> Delete Chat
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </CardHeader>

          {/* Messages Section */}
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {chat?.messages.map((message) => (
                <ChatMessage key={message.id} {...message} />
              ))}
              <div ref={messageEndRef} />
            </div>
          </ScrollArea>

          {/* Message Input */}
          <CardFooter className="p-4 border-t">
            <div className="flex items-center gap-2 w-full">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Paperclip className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" side="top">
                  <DropdownMenuItem>
                    <ImageIcon className="mr-2 h-4 w-4" /> Send Image
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <FileText className="mr-2 h-4 w-4" /> Send File
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Mic className="mr-2 h-4 w-4" /> Voice Message
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <Button variant="ghost" size="icon">
                <AtSign className="h-4 w-4" />
              </Button>

              <Button variant="ghost" size="icon">
                <Smile className="h-4 w-4" />
              </Button>

              <div className="flex-1 relative">
                <Input
                  placeholder="Type a message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSendMessage()}
                  className="pr-10"
                />
                <Button
                  size="icon"
                  className="absolute right-1 top-1/2 -translate-y-1/2"
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim()}
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardFooter>
        </div>

        {/* Right Sidebar - Info Panel */}
        <div className="hidden lg:block border-l">
          <CardHeader>
            <div className="text-center">
              <Avatar className="h-20 w-20 mx-auto">
                <AvatarFallback>{chat?.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <h3 className="mt-2 font-semibold text-lg">{chat?.name}</h3>
              <p className="text-sm text-muted-foreground">{chat?.description}</p>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h4 className="text-sm font-medium mb-2">Members</h4>
              <ScrollArea className="h-[300px]">
                <div className="space-y-2">
                  {chat?.members.map((member) => (
                    <div
                      key={member.id}
                      className="flex items-center justify-between p-2 rounded-lg hover:bg-accent"
                    >
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
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
              <h4 className="text-sm font-medium">Actions</h4>
              <div className="space-y-1">
                <Button variant="ghost" className="w-full justify-start">
                  <Edit className="mr-2 h-4 w-4" /> Edit Group Info
                </Button>
                <Button variant="ghost" className="w-full justify-start">
                  <UserPlus className="mr-2 h-4 w-4" /> Add Members
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start text-destructive"
                >
                  <Trash className="mr-2 h-4 w-4" /> Delete Group
                </Button>
              </div>
            </div>
          </CardContent>
        </div>
      </Card>
    </div>
  );
}
