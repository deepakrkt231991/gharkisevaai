import { ChatInterface } from '@/components/chat-interface';

export default function ChatPage({ params }: { params: { chatId: string } }) {
  return (
    <div className="dark bg-background text-foreground">
      <div className="relative mx-auto flex h-screen w-full max-w-md flex-col">
        <ChatInterface chatId={params.chatId} />
      </div>
    </div>
  );
}
