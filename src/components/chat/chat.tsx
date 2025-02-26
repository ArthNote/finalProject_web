"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  MessageSquare,
  Search,
  PlusCircle,
  ChevronLeft,
  Users,
  Paperclip,
  Image,
  FileText,
  Mic,
  MoreVertical,
  ChevronRight,
} from "lucide-react";

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
  {
    id: "4",
    title: "Productivity Tips",
    lastMessage: "Try the Pomodoro technique for better focus.",
    timestamp: "1w ago",
    isGroup: false,
    unreadCount: 1,
  },
];

type Message = {
  id: string;
  content: string;
  sender: string;
  timestamp: string;
};

const initialMessages: Record<string, Message[]> = {
  "1": [
    {
      id: "1",
      content: "Hey team, let's brainstorm for the new project!",
      sender: "Alice",
      timestamp: "10:00 AM",
    },
    {
      id: "2",
      content: "Great idea! I have some thoughts to share.",
      sender: "Bob",
      timestamp: "10:05 AM",
    },
    {
      id: "3",
      content: "I've prepared a document with initial concepts.",
      sender: "Charlie",
      timestamp: "10:10 AM",
    },
  ],
  "2": [
    {
      id: "1",
      content: "Hi, can you help me prioritize my tasks?",
      sender: "You",
      timestamp: "2:00 PM",
    },
    {
      id: "2",
      content: "Of course! Let's go through your list together.",
      sender: "AI Assistant",
      timestamp: "2:02 PM",
    },
  ],
  "3": [
    {
      id: "1",
      content: "Weekly planning session starts in 10 minutes!",
      sender: "David",
      timestamp: "9:50 AM",
    },
    {
      id: "2",
      content: "I'll be there. Bringing my project updates.",
      sender: "Eva",
      timestamp: "9:52 AM",
    },
    {
      id: "3",
      content: "Great, see you all soon.",
      sender: "Frank",
      timestamp: "9:55 AM",
    },
  ],
  "4": [
    {
      id: "1",
      content: "Do you have any productivity tips to share?",
      sender: "You",
      timestamp: "11:00 AM",
    },
    {
      id: "2",
      content: "Have you tried the Pomodoro technique?",
      sender: "AI Assistant",
      timestamp: "11:02 AM",
    },
  ],
};

export function ChatPage() {
  const [chats, setChats] = useState<Chat[]>(initialChats);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [isChatListVisible, setIsChatListVisible] = useState(true);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isMobileView, setIsMobileView] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth < 768);
    };
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const filteredChats = chats.filter(
    (chat) =>
      chat.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      chat.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleNewChat = () => {
    const newChat: Chat = {
      id: (chats.length + 1).toString(),
      title: "New Chat",
      lastMessage: "Start a new conversation",
      timestamp: "Just now",
      isGroup: false,
      unreadCount: 0,
    };
    setChats([newChat, ...chats]);
    setSelectedChatId(newChat.id);
  };

  const toggleChatList = () => {
    setIsChatListVisible(!isChatListVisible);
    if (isMobileView && selectedChatId) {
      setSelectedChatId(null);
    }
  };

  const handleChatSelect = (chatId: string) => {
    setSelectedChatId(chatId);
    setMessages(initialMessages[chatId] || []);
    setChats(
      chats.map((chat) =>
        chat.id === chatId ? { ...chat, unreadCount: 0 } : chat
      )
    );
    if (isMobileView) {
      setIsChatListVisible(false);
    }
  };

  const handleSend = () => {
    if (input.trim() && selectedChatId) {
      const newMessage: Message = {
        id: (messages.length + 1).toString(),
        content: input,
        sender: "You",
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
      setMessages([...messages, newMessage]);
      setInput("");

      // Update last message in chat list
      setChats(
        chats.map((chat) =>
          chat.id === selectedChatId
            ? {
                ...chat,
                lastMessage:
                  input.slice(0, 30) + (input.length > 30 ? "..." : ""),
                timestamp: "Just now",
              }
            : chat
        )
      );
    }
  };

  const selectedChat = chats.find((chat) => chat.id === selectedChatId);

  return (
    <Card className="h-full flex flex-col md:flex-row">
      <CardContent
        className={`${
          isChatListVisible ? "w-full md:w-1/3" : "w-0"
        } p-4 border-r transition-all duration-300 overflow-hidden ${
          !isChatListVisible ? "px-0" : ""
        }`}
      >
        {isChatListVisible && (
          <>
            <div className="flex space-x-2 mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                <Input
                  className="pl-8"
                  placeholder="Search chats..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button onClick={handleNewChat}>
                <PlusCircle className="mr-2 h-4 w-4" />
                New Chat
              </Button>
            </div>
            <ScrollArea className="h-[calc(100vh-200px)]">
              {filteredChats.map((chat) => (
                <div
                  key={chat.id}
                  className={`p-2 mb-2 cursor-pointer hover:bg-accent rounded-md ${
                    selectedChatId === chat.id ? "bg-accent" : ""
                  }`}
                  onClick={() => handleChatSelect(chat.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      {chat.isGroup ? (
                        <Users className="h-5 w-5 mr-2 text-primary" />
                      ) : (
                        <MessageSquare className="h-5 w-5 mr-2 text-primary" />
                      )}
                      <div>
                        <h3 className="font-semibold">{chat.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          {chat.lastMessage}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="text-xs text-muted-foreground">
                        {chat.timestamp}
                      </span>
                      {chat.unreadCount > 0 && (
                        <Badge variant="destructive" className="mt-1">
                          {chat.unreadCount}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </ScrollArea>
          </>
        )}
      </CardContent>
      <CardContent
        className={`flex-1 p-4 flex flex-col ${
          isChatListVisible ? "md:w-2/3" : "w-full"
        }`}
      >
        <div className="flex items-center space-x-4 mb-4">
          <Button variant="ghost" size="icon" onClick={toggleChatList}>
            {isChatListVisible ? (
              <ChevronLeft className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </Button>
          <div className="flex-1">
            <h2 className="text-xl font-bold">{selectedChat?.title}</h2>
            {selectedChat?.isGroup && (
              <p className="text-sm text-muted-foreground">
                {selectedChat.members?.join(", ")}
              </p>
            )}
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Rename Chat</DropdownMenuItem>
              <DropdownMenuItem>Mute Notifications</DropdownMenuItem>
              <DropdownMenuItem>Leave Chat</DropdownMenuItem>
              <DropdownMenuItem className="text-red-600">
                Delete Chat
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        {selectedChatId ? (
          <>
            <ScrollArea className="flex-1 pr-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex mb-4 ${
                    message.sender === "You" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`rounded-lg px-4 py-2 max-w-[70%] ${
                      message.sender === "You"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted"
                    }`}
                  >
                    {selectedChat?.isGroup && message.sender !== "You" && (
                      <p className="text-xs font-semibold mb-1">
                        {message.sender}
                      </p>
                    )}
                    <p>{message.content}</p>
                    <span className="text-xs text-muted-foreground block mt-1">
                      {message.timestamp}
                    </span>
                  </div>
                </div>
              ))}
            </ScrollArea>
            <Separator className="my-4" />
            <div className="flex items-center space-x-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Paperclip className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" side="top">
                  <DropdownMenuItem>
                    <Image className="mr-2 h-4 w-4" />
                    <span>Image</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <FileText className="mr-2 h-4 w-4" />
                    <span>Document</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Mic className="mr-2 h-4 w-4" />
                    <span>Audio</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Input
                className="flex-1"
                placeholder="Type your message..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSend()}
              />
              <Button onClick={handleSend}>Send</Button>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-center text-muted-foreground">
              Select a chat or start a new conversation
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
