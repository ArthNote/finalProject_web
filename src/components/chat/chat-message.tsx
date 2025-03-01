import React from "react";
import { useTranslations } from "next-intl";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { Copy, Reply, Trash2 } from "lucide-react";

interface ChatMessageProps {
  sender: string;
  content: string;
  time: string;
  isSender?: boolean;
  onReply?: () => void;
  onDelete?: () => void;
}

const ChatMessage: React.FC<ChatMessageProps> = ({
  sender,
  content,
  time,
  isSender = false,
  onReply,
  onDelete,
}) => {
  const t = useTranslations("chat");

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
  };

  return (
    <div className={`mb-4 ${isSender ? "flex justify-end w-full" : ""}`}>
      <ContextMenu>
        <ContextMenuTrigger>
          <div
            className={`p-3 rounded-lg ${
              isSender
                ? "bg-primary text-primary-foreground max-w-[85%] sm:max-w-[75%] ml-auto"
                : "bg-slate-100 max-w-[85%] sm:max-w-[75%] w-fit"
            }`}
          >
            <div
              className={`font-medium text-sm ${
                isSender ? "" : "text-slate-700"
              }`}
            >
              {sender}
            </div>
            <div className="break-words">{content}</div>
            <div
              className={`text-xs mt-1 text-right ${
                isSender ? "opacity-70" : "text-slate-500"
              }`}
            >
              {time}
            </div>
          </div>
        </ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem
            onClick={handleCopy}
            className="flex gap-2 cursor-pointer"
          >
            <Copy size={16} /> {t("message.actions.copy")}
          </ContextMenuItem>
          <ContextMenuItem
            onClick={onReply}
            className="flex gap-2 cursor-pointer"
          >
            <Reply size={16} /> {t("message.actions.reply")}
          </ContextMenuItem>
          {isSender && (
            <ContextMenuItem
              onClick={onDelete}
              className="flex gap-2 cursor-pointer text-destructive"
            >
              <Trash2 size={16} /> {t("message.actions.delete")}
            </ContextMenuItem>
          )}
        </ContextMenuContent>
      </ContextMenu>
    </div>
  );
};

export default ChatMessage;
