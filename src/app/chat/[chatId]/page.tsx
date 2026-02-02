
import { ChatInterface } from '@/components/chat-interface';

type PageProps = {
  params: { chatId: string };
};

export default function ChatPage({ params }: PageProps) {
  return (
    <div className="dark bg-background text-foreground">
      <div className="relative mx-auto flex h-screen w-full max-w-md flex-col">
        <ChatInterface chatId={params.chatId} />
      </div>
    </div>
  );
}
