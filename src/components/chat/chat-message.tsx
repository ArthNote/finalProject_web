import React from "react";
import { useLocale, useTranslations } from "next-intl";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { Copy, Reply, Trash2, FileText } from "lucide-react";
import { formatDate } from "@/lib/dateFormate";

interface ChatMessageProps {
  sender: string;
  content: string;
  time: string | number | Date;
  isSender?: boolean;
  onReply?: () => void;
  onDelete?: () => void;
  status?: "sent" | "delivered" | "read";
  type?: "text" | "file" | "image";
  fileType?: string;
  fileName?: string;
  fileSize?: string;
}

const ChatMessage: React.FC<ChatMessageProps> = ({
  sender,
  content,
  time,
  isSender = false,
  onReply,
  onDelete,
  status,
  type = "text",
  fileType,
  fileName,
  fileSize,
}) => {
  const t = useTranslations("chat");

  const renderFileContent = () => {
    return (
      <div className="flex items-center gap-2 bg-background/50 p-2 rounded-md">
        <div className="bg-primary/10 p-2 rounded">
          <FileText size={24} className="text-primary" />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-medium truncate">{fileName}</p>
          <p className="text-xs text-muted-foreground">{fileSize}</p>
        </div>
      </div>
    );
  };

  const renderMessageStatus = () => {
    if (!isSender || !status) return null;

    return (
      <span className="text-xs ml-2 opacity-70">
        {t(`message.status.${status}`)}
      </span>
    );
  };
  const locale = useLocale() as "en" | "fr";

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
  };

  const formattedTime = formatDate(time, "relative", locale);

  return (
    <div className={`mb-4 ${isSender ? "flex justify-end" : "flex"}`}>
      <ContextMenu>
        <ContextMenuTrigger asChild>
          <div
            className={`p-3 rounded-lg inline-block max-w-[85%] sm:max-w-[75%] ${
              isSender
                ? "bg-primary text-primary-foreground"
                : "bg-slate-100 text-slate-900"
            }`}
          >
            <div className={`font-medium text-sm`}>
              {isSender ? t("you") : sender}
            </div>
            <div className="break-words">
              {type === "file" ? renderFileContent() : content}
            </div>
            <div
              className={`text-xs mt-1 text-right flex items-center justify-end gap-1 ${
                isSender ? "opacity-70" : "text-slate-500"
              }`}
            >
              {(time as Date).toLocaleTimeString(locale, {
                hour: "2-digit",
                minute: "2-digit",
              })}
              {/* {renderMessageStatus()} */}
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
