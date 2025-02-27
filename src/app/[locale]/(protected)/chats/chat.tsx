"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PlusCircle, Send, Paperclip, Image, FileText, Mic } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import ChatMessage from "@/components/chat/chat-message";

const ChatComponent = () => {
  const [selectedChat, setselectedChat] = useState("");
  return (
    <div>
      <Card className="w-full">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Chat</CardTitle>
            <CardDescription>Your conversations</CardDescription>
          </div>
          <Button className="flex items-center gap-2">
            <PlusCircle size={16} />
            New Chat
          </Button>
        </CardHeader>
        <CardContent className="flex flex-row min-h-[500px]">
          {/* Left section - Chats list (visible on all screens) */}
          <div className="w-full md:w-1/3 pr-2">
            <div className="mb-4">
              <Input placeholder="Search chats..." />
            </div>
            <div className="space-y-2">
              {/* Chat list items would go here */}
              <div
                className="p-2 hover:bg-slate-100 rounded-md cursor-pointer"
                onClick={() => setselectedChat("chat1")}
              >
                Chat 1
              </div>
              <div
                className="p-2 hover:bg-slate-100 rounded-md cursor-pointer"
                onClick={() => setselectedChat("chat2")}
              >
                Chat 2
              </div>
              <div
                className="p-2 hover:bg-slate-100 rounded-md cursor-pointer"
                onClick={() => setselectedChat("chat3")}
              >
                Chat 3
              </div>
            </div>
          </div>

          {/* More visible separator */}
          <div className="hidden md:block border-l-1 border-gray-300 mx-2 self-stretch"></div>

          {/* Right section - Hidden on small screens */}
          <div className="hidden md:flex md:w-2/3 pl-2 items-center justify-center">
            {selectedChat ? (
              <div className="w-full h-full flex flex-col">
                <div className="font-semibold text-lg py-2 border-b">
                  {selectedChat === "chat1" ? "Chat 1" : 
                   selectedChat === "chat2" ? "Chat 2" : 
                   selectedChat === "chat3" ? "Chat 3" : "New Chat"}
                </div>
                <div className="flex-grow overflow-auto p-4">
                  {/* Using the ChatMessage component */}
                  <ChatMessage
                    sender="John Doe"
                    content="Hello there!"
                    time="10:30 AM"
                  />
                  <ChatMessage
                    sender="You"
                    content="Hi! How can I help you today?"
                    time="10:32 AM"
                    isSender={true}
                  />
                </div>

                <div className="border-t p-2">
                  <div className="flex gap-2 items-center">
                    {/* Attachment button with options */}
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <Paperclip size={20} />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent side="top" align="start" className="w-40 p-2">
                        <div className="space-y-1">
                          <Button variant="ghost" size="sm" className="w-full justify-start text-sm h-8">
                            <Image size={14} className="mr-2" /> Photo
                          </Button>
                          <Button variant="ghost" size="sm" className="w-full justify-start text-sm h-8">
                            <FileText size={14} className="mr-2" /> Document
                          </Button>
                          <Button variant="ghost" size="sm" className="w-full justify-start text-sm h-8">
                            <Mic size={14} className="mr-2" /> Audio
                          </Button>
                        </div>
                      </PopoverContent>
                    </Popover>
                    
                    <Input placeholder="Type a message..." className="flex-grow" />
                    
                    {/* Send icon button */}
                    <Button size="icon">
                      <Send size={18} />
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center text-muted-foreground">
                <p className="text-lg">No chat selected</p>
                <p className="text-sm">
                  Select a conversation or start a new one
                </p>
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <p className="text-sm text-muted-foreground">Connected</p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ChatComponent;
