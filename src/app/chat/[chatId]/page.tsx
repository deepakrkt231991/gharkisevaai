import { ChatInterface } from '@/components/chat-interface';

export default async function ChatPage({ params }: { params: Promise<{ chatId: string }> }) {
  const { chatId } = await params;
  return (
    <div className="dark bg-background text-foreground">
      <div className="relative mx-auto flex h-screen w-full max-w-md flex-col">
        <ChatInterface chatId={chatId} />
      </div>
    </div>
  );
}
