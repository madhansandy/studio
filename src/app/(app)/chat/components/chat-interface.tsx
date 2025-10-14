"use client";

import { useState, useRef, useEffect } from "react";
import { chatAssistantMedicationGuidance } from "@/ai/flows/chat-assistant-medication-guidance";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Send, Loader2, User, Bot } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAuth } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";

interface Message {
    sender: 'user' | 'ai';
    text: string;
}

export default function ChatInterface() {
    const { user } = useAuth();
    const [messages, setMessages] = useState<Message[]>([
        { sender: 'ai', text: 'Hello! How can I help you with your medications today?' }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const scrollAreaRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollAreaRef.current) {
            scrollAreaRef.current.scrollTo({ top: scrollAreaRef.current.scrollHeight, behavior: 'smooth' });
        }
    }, [messages]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMessage: Message = { sender: 'user', text: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            const { response } = await chatAssistantMedicationGuidance({ query: input });
            const aiMessage: Message = { sender: 'ai', text: response };
            setMessages(prev => [...prev, aiMessage]);
        } catch (error) {
            console.error("Chat API error:", error);
            const errorMessage: Message = { sender: 'ai', text: 'Sorry, I encountered an error. Please try again.' };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    const getInitials = (name: string) => {
        return name
        .split(" ")
        .map((n) => n[0])
        .join("");
    };

    return (
        <Card className="flex flex-col flex-grow">
            <CardContent className="flex-grow p-0">
                <ScrollArea className="h-[calc(100vh-18rem)] p-4" ref={scrollAreaRef}>
                    <div className="space-y-6">
                        {messages.map((message, index) => (
                            <div
                                key={index}
                                className={cn(
                                    "flex items-start gap-3",
                                    message.sender === 'user' ? "justify-end" : "justify-start"
                                )}
                            >
                                {message.sender === 'ai' && (
                                    <Avatar className="h-8 w-8">
                                        <AvatarFallback className="bg-primary text-primary-foreground"><Bot size={20}/></AvatarFallback>
                                    </Avatar>
                                )}
                                <div
                                    className={cn(
                                        "max-w-md rounded-lg p-3 text-sm",
                                        message.sender === 'user'
                                            ? "bg-primary text-primary-foreground"
                                            : "bg-muted"
                                    )}
                                >
                                    {message.text}
                                </div>
                                {message.sender === 'user' && (
                                    <Avatar className="h-8 w-8">
                                        <AvatarImage src={user?.id ? `https://i.pravatar.cc/40?u=${user.id}` : undefined} />
                                        <AvatarFallback>{user ? getInitials(user.name) : <User size={20}/>}</AvatarFallback>
                                    </Avatar>
                                )}
                            </div>
                        ))}
                        {isLoading && (
                            <div className="flex items-start gap-3 justify-start">
                                <Avatar className="h-8 w-8">
                                   <AvatarFallback className="bg-primary text-primary-foreground"><Bot size={20}/></AvatarFallback>
                                </Avatar>
                                <div className="bg-muted rounded-lg p-3 flex items-center">
                                    <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                                </div>
                            </div>
                        )}
                    </div>
                </ScrollArea>
            </CardContent>
            <CardFooter className="border-t p-4">
                <form onSubmit={handleSubmit} className="flex w-full items-center gap-2">
                    <Input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Type your message..."
                        disabled={isLoading}
                    />
                    <Button type="submit" disabled={isLoading || !input.trim()} size="icon">
                        <Send className="h-4 w-4" />
                    </Button>
                </form>
            </CardFooter>
        </Card>
    );
}
