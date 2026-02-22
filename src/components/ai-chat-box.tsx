
'use client';

import { useState, useRef, useEffect } from 'react';
import { Bot, Send, Loader2 } from 'lucide-react';
import { generalChat, ChatInput } from '@/ai/flows/chat-agent';
import { Avatar, AvatarFallback } from './ui/avatar';
import { useUser } from '@/firebase';
import { Input } from './ui/input';
import { Button } from './ui/button';

type Message = {
    role: 'user' | 'model';
    content: string;
};

export function AiChatBox() {
    const [messages, setMessages] = useState<Message[]>([
        { role: 'model', content: "Hello! I'm Seva AI. How can I help you today?" }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const { user } = useUser();

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }

    useEffect(scrollToBottom, [messages]);

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMessage: Message = { role: 'user', content: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        const chatInput: ChatInput = {
            history: messages.map(m => ({ role: m.role, content: m.content })),
            prompt: input,
        };

        try {
            const result = await generalChat(chatInput);
            const modelMessage: Message = { role: 'model', content: result.response };
            setMessages(prev => [...prev, modelMessage]);
        } catch (error) {
            console.error("AI chat error:", error);
            const errorMessage: Message = { role: 'model', content: "Sorry, I'm having trouble connecting right now." };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((msg, index) => (
                    <div key={index} className={`flex items-end gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        {msg.role === 'model' && <Avatar className="h-7 w-7"><AvatarFallback><Bot size={16}/></AvatarFallback></Avatar>}
                        <div className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm ${msg.role === 'user' ? 'bg-primary text-primary-foreground rounded-br-none' : 'bg-secondary text-secondary-foreground rounded-bl-none'}`}>
                            {msg.content}
                        </div>
                         {msg.role === 'user' && <Avatar className="h-7 w-7"><AvatarFallback>{user?.displayName?.charAt(0) || 'U'}</AvatarFallback></Avatar>}
                    </div>
                ))}
                {isLoading && (
                    <div className="flex items-end gap-2 justify-start">
                         <Avatar className="h-7 w-7"><AvatarFallback><Bot size={16}/></AvatarFallback></Avatar>
                        <div className="max-w-[80%] rounded-2xl px-4 py-2 text-sm bg-secondary text-secondary-foreground rounded-bl-none flex items-center">
                            <Loader2 className="w-4 h-4 animate-spin"/>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>
            <div className="p-3 border-t border-border">
                <div className="relative">
                    <Input 
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                        placeholder="Ask anything..."
                        className="pr-10"
                        disabled={isLoading}
                    />
                    <Button onClick={handleSend} size="icon" variant="ghost" className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8" disabled={isLoading}>
                        <Send className="w-4 h-4" />
                    </Button>
                </div>
            </div>
        </>
    );
}

