"use client";

import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send } from "lucide-react";

type Message = {
  id: string;
  content: string;
  sender: "user" | "ai";
  timestamp: string;
};

export function ChatPage({ chatId }: { chatId: string }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Simulating fetching chat messages
    const fetchedMessages: Message[] = [
      {
        id: "1",
        content: "Hello! How can I assist you today?",
        sender: "ai",
        timestamp: "10:00 AM",
      },
      {
        id: "2",
        content: "I need help prioritizing my tasks for the week.",
        sender: "user",
        timestamp: "10:01 AM",
      },
      {
        id: "3",
        content:
          "I'd be happy to help you prioritize your tasks. Can you list the main tasks you have for this week?",
        sender: "ai",
        timestamp: "10:02 AM",
      },
    ];
    setMessages(fetchedMessages);
  }, []);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = () => {
    if (input.trim()) {
      const newMessage: Message = {
        id: (messages.length + 1).toString(),
        content: input,
        sender: "user",
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
      setMessages([...messages, newMessage]);
      setInput("");

      // Simulating AI response
      setTimeout(() => {
        const aiResponse: Message = {
          id: (messages.length + 2).toString(),
          content:
            "I understand you want to prioritize your tasks. Let's break them down and organize them based on urgency and importance.",
          sender: "ai",
          timestamp: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        };
        setMessages((prev) => [...prev, aiResponse]);
      }, 1000);
    }
  };

  return (
    <Card className="flex-1 flex flex-col">
      <CardHeader>
        <CardTitle>Chat {chatId}</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col">
        <ScrollArea className="flex-1 pr-4" ref={scrollAreaRef}>
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.sender === "ai" ? "justify-start" : "justify-end"
              } mb-4`}
            >
              <div
                className={`rounded-lg px-4 py-2 max-w-[70%] ${
                  message.sender === "ai"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted"
                }`}
              >
                <p>{message.content}</p>
                <span className="text-xs text-muted-foreground block mt-1">
                  {message.timestamp}
                </span>
              </div>
            </div>
          ))}
        </ScrollArea>
        <div className="flex items-center space-x-2 mt-4">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            onKeyPress={(e) => e.key === "Enter" && handleSend()}
          />
          <Button size="icon" onClick={handleSend}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
