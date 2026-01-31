import { ChatInterface } from '@/components/chat-interface';

// ✅ Sahi (Next.js 15+ Tarika)
export default async function Page({
  params,
}: {
  params: Promise<{ chatId: string }>; // Params ko Promise define karein
}) {
  const { chatId } = await params; // Yahan await karna zaroori hai

  return (
    <div>
      <h1>Chat ID: {chatId}</h1>
      {/* Aapka baaki ka code */}
    </div>
  );
}
