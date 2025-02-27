import React from "react";

interface ChatMessageProps {
  sender: string;
  content: string;
  time: string;
  isSender?: boolean;
}

const ChatMessage: React.FC<ChatMessageProps> = ({
  sender,
  content,
  time,
  isSender = false,
}) => {
  return (
    <div className={`mb-4 ${isSender ? "flex justify-end" : ""}`}>
      <div
        className={`p-3 rounded-lg ${
          isSender
            ? "bg-primary text-primary-foreground max-w-[75%]"
            : "bg-slate-100 max-w-[60%] w-fit"
        }`}
      >
        <div
          className={`font-medium text-sm ${isSender ? "" : "text-slate-700"}`}
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
    </div>
  );
};

export default ChatMessage;
