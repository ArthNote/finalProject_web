"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { io, Socket } from "socket.io-client";
import { useQueryClient } from "@tanstack/react-query";
import { authClient } from "@/lib/auth-client";

interface SocketContextType {
  socket: Socket | undefined;
  onlineUsers: string[];
  checkFriendsOnlineStatus: (friendIds: string[]) => void;
}

const SocketContext = createContext<SocketContextType>({
  socket: undefined,
  onlineUsers: [],
  checkFriendsOnlineStatus: () => {},
});

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const socketRef = useRef<Socket | undefined>(undefined);
  const queryClient = useQueryClient();
  const { data: session } = authClient.useSession();
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);

  useEffect(() => {
    // Only connect if we have a session
    if (!session?.user.id) return;

    // Create socket connection if it doesn't exist yet

    if (!socketRef.current) {
      const socket = io("http://localhost:8080", {
        query: {
          userId: session.user.id,
        },
        withCredentials: true,
      });

      // Store socket reference
      socketRef.current = socket;

      socket.on("getOnlineUsers", (userIds: string[]) => {
        setOnlineUsers(userIds);

        // Update friend status in the cache if it exists
        queryClient.setQueriesData(
          { queryKey: ["friends"] },
          (oldData: any) => {
            if (!oldData?.data || !Array.isArray(oldData.data)) return oldData;

            return {
              ...oldData,
              data: oldData.data.map((friend: any) => ({
                ...friend,
                sender: {
                  ...friend.sender,
                  status: userIds.includes(friend.sender.id)
                    ? "online"
                    : "offline",
                },
                receiver: {
                  ...friend.receiver,
                  status: userIds.includes(friend.receiver.id)
                    ? "online"
                    : "offline",
                },
              })),
            };
          }
        );
      });

      // Listen for new messages
      socket.on("newMessage", (newMessage) => {
        const chatId = newMessage.chatId;
        queryClient.setQueryData(["messages", chatId], (old: any) => {
          if (!old) return { data: { messages: [newMessage] } };
          return {
            ...old,
            data: {
              ...old.data,
              messages: [...(old.data?.messages || []), newMessage],
            },
          };
        });
      });
    }

    // Cleanup on unmount
    return () => {
      // Don't disconnect on component unmount to maintain global connection
      // We'll handle disconnection elsewhere if needed (e.g., on logout)
    };
  }, [session?.user.id, queryClient]);

  const checkFriendsOnlineStatus = (friendIds: string[]) => {
    if (socketRef.current && friendIds.length > 0) {
      socketRef.current.emit("checkOnlineFriends", friendIds);
    }
  };

  return (
    <SocketContext.Provider
      value={{
        socket: socketRef.current,
        onlineUsers,
        checkFriendsOnlineStatus,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
