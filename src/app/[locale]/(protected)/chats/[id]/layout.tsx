import React from "react";

interface ChatLayoutProps {
  children: React.ReactNode;
}

const ChatLayout = ({ children }: ChatLayoutProps) => {
  return (
    <div className="min-h-screen bg-background">
      <div className="relative flex min-h-screen flex-col">
        <main className="flex-1">
          {children}
        </main>
      </div>
    </div>
  );
};

export default ChatLayout;
