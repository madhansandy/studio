"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { chatAssistantMedicationGuidance } from "@/ai/flows/chat-assistant-medication-guidance";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Send, Loader2, User, Bot, AlertTriangle } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { useUser, useFirestore, useCollection, useMemoFirebase } from "@/firebase";
import { addDocumentNonBlocking } from "@/firebase/non-blocking-updates";
import { collection, query, orderBy, serverTimestamp, Timestamp } from "firebase/firestore";
import type { Prescription, InventoryItem } from "@/lib/api";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface ChatMessage {
    id?: string;
    sender: 'user' | 'ai';
    text: string;
    timestamp?: Timestamp | any;
}

export default function ChatInterface() {
    const { user } = useUser();
    const firestore = useFirestore();

    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const scrollAreaRef = useRef<HTMLDivElement>(null);

    // --- Data Fetching ---
    const chatMessagesQuery = useMemoFirebase(() => {
        if (!firestore || !user) return null;
        return query(collection(firestore, `users/${user.uid}/chatMessages`), orderBy("timestamp", "asc"));
    }, [firestore, user]);
    const { data: messages, isLoading: messagesLoading, error: messagesError } = useCollection<ChatMessage>(chatMessagesQuery);
    
    const prescriptionsQuery = useMemoFirebase(() => {
        if (!firestore || !user) return null;
        return collection(firestore, `users/${user.uid}/prescriptions`);
    }, [firestore, user]);
    const { data: prescriptions, error: prescriptionsError } = useCollection<Prescription>(prescriptionsQuery);
    
    const medicationsQuery = useMemoFirebase(() => {
        if (!firestore || !user) return null;
        return collection(firestore, `users/${user.uid}/medications`);
    }, [firestore, user]);
    const { data: medications, error: medicationsError } = useCollection<InventoryItem>(medicationsQuery);
    // --- End Data Fetching ---

    const chatMessagesCollectionRef = useMemoFirebase(() => {
      if (!firestore || !user) return null;
      return collection(firestore, `users/${user.uid}/chatMessages`);
    }, [firestore, user]);
    
    const [clientMessages, setClientMessages] = useState<ChatMessage[]>([]);

    useEffect(() => {
        if (messages) {
            setClientMessages(messages.map(m => ({ ...m, sender: m.isUserMessage ? 'user' : 'ai', text: m.messageText })));
        } else if (messages === null && !messagesLoading) {
            setClientMessages([{ sender: 'ai', text: 'Hello! How can I help you with your medications today?' }]);
        }
    }, [messages, messagesLoading]);


    useEffect(() => {
        if (scrollAreaRef.current) {
            scrollAreaRef.current.scrollTo({ top: scrollAreaRef.current.scrollHeight, behavior: 'smooth' });
        }
    }, [clientMessages]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading || !chatMessagesCollectionRef) return;

        const userMessageText = input;
        const userMessageForUI: ChatMessage = { sender: 'user', text: userMessageText };
        setClientMessages(prev => [...prev, userMessageForUI]);
        setInput('');
        setIsLoading(true);
        
        // Save user message to Firestore
        addDocumentNonBlocking(chatMessagesCollectionRef, {
            messageText: userMessageText,
            isUserMessage: true,
            timestamp: serverTimestamp(),
        });

        try {
            const { response } = await chatAssistantMedicationGuidance({ 
                query: userMessageText,
                prescriptions: prescriptions?.map(p => ({
                    name: p.name,
                    date: p.date,
                    safetyScore: p.safetyScore,
                    issues: p.issues,
                })) || [],
                medications: medications?.map(m => ({
                    name: m.name,
                    stockQuantity: m.stock,
                    expiryDate: m.expiryDate,
                })) || [],
            });

            const aiMessageForUI: ChatMessage = { sender: 'ai', text: response };
            setClientMessages(prev => [...prev, aiMessageForUI]);

            // Save AI message to Firestore
            addDocumentNonBlocking(chatMessagesCollectionRef, {
                messageText: response,
                isUserMessage: false,
                timestamp: serverTimestamp(),
            });

        } catch (error) {
            console.error("Chat API error:", error);
            const errorMessage: ChatMessage = { sender: 'ai', text: 'Sorry, I encountered an error. Please try again.' };
            setClientMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    const getInitials = (name: string | null | undefined) => {
        if (!name) return "U";
        return name
        .split(" ")
        .map((n) => n[0])
        .join("");
    };
    
    const hasError = messagesError || prescriptionsError || medicationsError;

    return (
        <Card className="flex flex-col flex-grow">
            <CardContent className="flex-grow p-0">
                <ScrollArea className="h-[calc(100vh-18rem)] p-4" ref={scrollAreaRef}>
                    {hasError && (
                        <Alert variant="destructive" className="mb-4">
                            <AlertTriangle className="h-4 w-4" />
                            <AlertTitle>Error</AlertTitle>
                            <AlertDescription>
                                There was a problem loading your data. Some features might not work correctly.
                            </AlertDescription>
                        </Alert>
                    )}
                    <div className="space-y-6">
                        {messagesLoading && !messages ? (
                             <div className="flex items-center justify-center p-8">
                                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                            </div>
                        ) : (
                            <>
                                {clientMessages.map((message, index) => (
                                    <div
                                        key={message.id || index}
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
                                                <AvatarImage src={user?.uid ? `https://i.pravatar.cc/40?u=${user.uid}` : undefined} />
                                                <AvatarFallback>{user ? getInitials(user.displayName) : <User size={20}/>}</AvatarFallback>
                                            </Avatar>
                                        )}
                                    </div>
                                ))}
                            </>
                        )}
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
                        disabled={isLoading || messagesLoading}
                    />
                    <Button type="submit" disabled={isLoading || messagesLoading || !input.trim()} size="icon">
                        <Send className="h-4 w-4" />
                    </Button>
                </form>
            </CardFooter>
        </Card>
    );
}
