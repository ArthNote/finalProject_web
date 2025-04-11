import { useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";
import { consts } from "@/lib/constants";
import { useQueryClient } from "@tanstack/react-query";
import { authClient } from "@/lib/auth-client";

export default function useSocket() {
  const socketRef = useRef<Socket | undefined>(undefined);
  const queryClient = useQueryClient();
  const { data: session } = authClient.useSession();

  useEffect(() => {
    // Only connect if we have a session
    if (!session?.user.id) return;

    // Create socket connection
    const socket = io("http://localhost:8080", {
      query: {
        userId: session.user.id,
      },
      withCredentials: true, // Important for CORS
    });

    // Store socket reference
    socketRef.current = socket;

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

      // queryClient.invalidateQueries({
      //   queryKey: ["messages", chatId],
      //   type: "all",
      // });

      // queryClient.refetchQueries({
      //   queryKey: ["messages", chatId],
      //   type: "all",
      // });
    });

    // Cleanup on unmount
    return () => {
      if (socket) {
        socket.disconnect();
        socketRef.current = undefined;
      }
    };
  }, [session?.user.id, queryClient]); // Add proper dependencies

  return socketRef.current;
}
