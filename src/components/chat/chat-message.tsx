import React from "react";
import { useLocale, useTranslations } from "next-intl";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import {
  Copy,
  Reply,
  Trash2,
  FileText,
  CornerDownRight,
  Image as ImageIcon,
} from "lucide-react";
import { formatDate } from "@/lib/dateFormate";
import Image from "next/image";

interface ChatMessageProps {
  messageId: string;
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
  showName?: boolean;
  replyTo?: {
    id: string;
    content: string;
    sender: string;
    type?: "text" | "file" | "image";
    fileName?: string;
  };
  onReplyClick?: (messageId: string) => void; // New prop for handling reply click
}

const ChatMessage = React.forwardRef<HTMLDivElement, ChatMessageProps>(
  (
    {
      messageId,
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
      showName = true,
      replyTo,
      onReplyClick,
    },
    ref
  ) => {
    const t = useTranslations("chat");

    // For debugging
    React.useEffect(() => {
      if (type === "file") {
        console.log("Rendering file message:", {
          id: messageId,
          fileName,
          content,
          fileSize,
        });
      }
    }, [messageId, type, fileName, content, fileSize]);

    const renderContent = () => {
      switch (type) {
        case "image":
          return (
            <a
              href={content}
              target="_blank"
              rel="noopener noreferrer"
              className="block hover:opacity-90 transition-opacity"
            >
              <div className="relative w-full max-w-[300px] aspect-auto rounded-lg overflow-hidden">
                {content === "Uploading..." ? (
                  <div className="bg-primary/10 h-[200px] flex items-center justify-center">
                    <div className="animate-pulse flex flex-col items-center justify-center">
                      <FileText className="h-8 w-8 text-primary mb-2" />
                      <span className="text-sm">{t("upload.sending")}</span>
                    </div>
                  </div>
                ) : (
                  <Image
                    src={content}
                    alt={fileName || "Image"}
                    width={300}
                    height={200}
                    className="object-cover"
                    unoptimized
                  />
                )}
              </div>
            </a>
          );
        case "file":
          return (
            <a
              href={content === "Uploading..." ? "#" : content}
              target="_blank"
              rel="noopener noreferrer"
              className="block transition-colors"
              onClick={(e) => {
                if (content === "Uploading...") {
                  e.preventDefault();
                }
              }}
            >
              <div className="flex items-center gap-2 bg-background/50 p-2 rounded-md">
                <div className="bg-primary/10 p-2 rounded">
                  <FileText className="h-4 w-4 text-primary" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium truncate">{fileName}</p>
                  <p className="text-xs text-muted-foreground">
                    {content === "Uploading..."
                      ? t("upload.sending")
                      : formatFileSize(fileSize)}
                  </p>
                </div>
              </div>
            </a>
          );
        default:
          return content;
      }
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

    // Prepare the reply content preview
    const getReplyPreview = () => {
      if (!replyTo) return null;

      // Determine preview content and icon based on message type
      const preview = {
        text: {
          content:
            replyTo.content?.substring(0, 50) +
            (replyTo.content?.length > 50 ? "..." : ""),
          icon: null,
        },
        image: {
          content: t("message.types.image"),
          icon: <ImageIcon className="h-3 w-3 flex-shrink-0" />,
        },
        file: {
          content: replyTo.fileName || t("message.types.file"),
          icon: <FileText className="h-3 w-3 flex-shrink-0" />,
        },
      };

      const { content: previewContent, icon: previewIcon } =
        preview[replyTo.type || "text"];

      return (
        <div
          className={`flex gap-1 items-center p-2 my-1 text-xs rounded cursor-pointer 
          ${
            isSender
              ? "bg-primary/50 text-primary-foreground/80"
              : "bg-muted/50 text-foreground/80"
          }`}
          onClick={(e) => {
            e.stopPropagation();
            onReplyClick?.(replyTo.id);
          }}
        >
          <CornerDownRight className="h-3 w-3 flex-shrink-0" />
          <div className="overflow-hidden flex items-center gap-1">
            <span className="font-medium">{replyTo.sender}</span>
            <span className="mx-1">•</span>
            <span className="italic flex items-center gap-1">
              {previewIcon}
              <span className="truncate">{previewContent}</span>
            </span>
          </div>
        </div>
      );
    };

    return (
      <div ref={ref} id={`message-${messageId}`} className="flex w-full">
        <div className={`max-w-[85%] ${isSender ? "ml-auto" : ""}`}>
          <ContextMenu>
            <ContextMenuTrigger asChild>
              <div className="flex flex-col">
                {replyTo && getReplyPreview()}
                <div
                  className={`p-3 rounded-lg ${
                    isSender
                      ? "bg-primary text-primary-foreground"
                      : "bg-slate-100 text-slate-900"
                  }`}
                >
                  <div className="text-sm font-medium mb-1">
                    {showName ? (isSender ? t("you") : sender) : null}
                  </div>
                  <div className="text-sm whitespace-pre-wrap break-all">
                    {renderContent()}
                  </div>
                  <div
                    className={`text-xs mt-1 text-right ${
                      isSender ? "opacity-70" : "text-slate-500"
                    }`}
                  >
                    {(time as Date).toLocaleTimeString(locale, {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
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
      </div>
    );
  }
);

ChatMessage.displayName = "ChatMessage";

export default ChatMessage;

// Add helper function
function formatFileSize(bytes: string | undefined): string {
  if (!bytes) return "";
  const size = parseInt(bytes);
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
}
