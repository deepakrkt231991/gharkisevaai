
import { ChatInterface } from '@/components/chat-interface';
import React from 'react';

// Simplified and corrected the props definition to fix the TypeError in Vercel build.
export default function ChatPage({ params }: { params: { chatId: string } }) {
  const { chatId } = params;

  return (
    <div className="dark bg-background text-foreground">
      <div className="relative mx-auto flex h-screen w-full max-w-md flex-col">
        <ChatInterface chatId={chatId} />
      </div>
    </div>
  );
}
