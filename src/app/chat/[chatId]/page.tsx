import React from 'react';

type Props = {
  params: { chatId: string };
};

export default function ChatPage({ params }: Props) {
  const { chatId } = params;

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <div className="p-4 bg-orange-500 text-white shadow-md">
        <h1 className="text-xl font-bold">चैट आईडी: {chatId}</h1>
      </div>
      <div className="flex-1 p-4 overflow-y-auto">
        <p className="text-center text-gray-500">यहाँ आपकी बातचीत शुरू होगी...</p>
      </div>
      {/* WhatsApp Direct Button */}
      <div className="p-4 border-t bg-white">
        <a 
          href={`https://wa.me/91XXXXXXXXXX?text=नमस्ते, मैं चैट आईडी ${chatId} के बारे में बात करना चाहता हूँ`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 bg-green-500 text-white p-3 rounded-lg font-bold hover:bg-green-600 transition"
        >
          Direct WhatsApp Chat
        </a>
      </div>
    </div>
  );
}
