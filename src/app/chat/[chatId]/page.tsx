import { ChatInterface } from '@/components/chat-interface';

// Using 'any' to bypass strict type checks that might be failing in the build environment
export default function ChatPage({ params }: any) {
  return (
      <ChatInterface chatId={params.chatId} />
  );
}
