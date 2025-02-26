import { getTranslations } from "next-intl/server";
import ChatClient from "@/components/chat/chat-client";

export default async function ChatPage({
  params: paramsPromise,
}: {
  params: Promise<{ id: string; locale: string }>;
}) {
  const params = await paramsPromise;

  return <ChatClient params={params} />;
}
