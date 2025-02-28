import React from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
  ContextMenuSeparator,
} from "@/components/ui/context-menu";
import { Copy, Reply, Trash, Forward } from "lucide-react";

interface ChatMessageProps {
  sender: string;
  content: string;
  time: string;
  isSender?: boolean;
  avatar?: string;
}

const ChatMessage: React.FC<ChatMessageProps> = ({
  sender,
  content,
  time,
  isSender = false,
  avatar,
}) => {
  return (
    <ContextMenu>
      <ContextMenuTrigger>
        <div className={`flex gap-3 ${isSender ? "flex-row-reverse" : ""}`}>
          {!isSender && (
            <Avatar className="h-8 w-8 flex-shrink-0">
              {avatar ? (
                <img src={avatar} alt={sender} className="rounded-full" />
              ) : (
                <AvatarFallback>{sender[0].toUpperCase()}</AvatarFallback>
              )}
            </Avatar>
          )}
          <div
            className={`group flex flex-col ${
              isSender ? "items-end" : "items-start"
            }`}
          >
            {!isSender && (
              <span className="text-sm font-medium mb-1">{sender}</span>
            )}
            <div
              className={`rounded-2xl px-4 py-2.5 max-w-[480px] ${
                isSender
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted"
              }`}
            >
              <p className="text-sm whitespace-pre-wrap break-words">{content}</p>
            </div>
            <span
              className={`text-xs mt-1 text-muted-foreground ${
                isSender ? "text-right" : ""
              }`}
            >
              {time}
            </span>
          </div>
        </div>
      </ContextMenuTrigger>
      <ContextMenuContent className="w-64">
        <ContextMenuItem>
          <Reply className="mr-2 h-4 w-4" />
          Reply
        </ContextMenuItem>
        <ContextMenuItem>
          <Forward className="mr-2 h-4 w-4" />
          Forward
        </ContextMenuItem>
        <ContextMenuItem>
          <Copy className="mr-2 h-4 w-4" />
          Copy Text
        </ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem className="text-destructive">
          <Trash className="mr-2 h-4 w-4" />
          Delete
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
};

export default ChatMessage;
