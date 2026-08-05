import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import ChatbotWidget from "@/components/chatbot/chatbot-widget";

type Props = {
  params: Promise<{
    botId: string;
  }>;
};

export default async function EmbedChatbotPage({ params }: Props) {
  const { botId } = await params;

  const chatbot = await prisma.chatbot.findUnique({
    where: {
      id: botId,
    },
    select: {
      id: true,
      name: true,
      theme: true,
    },
  });

  if (!chatbot) {
    notFound();
  }

  return (
    <div className="h-screen w-screen overflow-hidden bg-transparent flex flex-col justify-end items-end p-1 select-none">
      <ChatbotWidget
        botId={chatbot.id}
        chatbotName={chatbot.name}
        theme={chatbot.theme as "black" | "white"}
      />
    </div>
  );
}