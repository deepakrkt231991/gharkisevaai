
import { ChatInterface } from '@/components/chat-interface';
import React from 'react';

interface PageProps {
  params: Promise<{ chatId: string }>;
}

export default async function ChatPage({ params }: PageProps) {
  const resolvedParams = await params;
  const chatId = resolvedParams.chatId;

  return (
    <div className="dark bg-background text-foreground">
      <div className="relative mx-auto flex h-screen w-full max-w-md flex-col">
        <ChatInterface chatId={chatId} />
      </div>
    </div>
  );
}
