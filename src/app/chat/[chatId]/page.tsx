
import { ChatInterface } from '@/components/chat-interface';
import React from 'react';

interface PageProps {
  params: { chatId: string };
}

export default function ChatPage({ params }: PageProps) {
  const { chatId } = params;

  return (
    <div className="dark bg-background text-foreground">
      <div className="relative mx-auto flex h-screen w-full max-w-md flex-col">
        <ChatInterface chatId={chatId} />
      </div>
    </div>
  );
}
