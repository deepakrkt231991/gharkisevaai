import { ChatInterface } from '@/components/chat-interface';

// The page now uses a Client Component that handles all the complex logic.
// This simplifies the page and fixes the type errors related to params.
export default function ChatPage({ params }: { params: { chatId: string } }) {
  return (
      <ChatInterface chatId={params.chatId} />
  );
}
