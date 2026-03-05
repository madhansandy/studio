"use client";

import { useState, useRef, useEffect } from "react";
import { chatAssistantMedicationGuidance, type ChatAssistantMedicationGuidanceInput } from "@/ai/flows/chat-assistant-medication-guidance";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Send, Loader2, User, Bot, AlertTriangle, MessageCircle } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { useUser, useFirestore, useCollection, addDocumentNonBlocking, useMemoFirebase } from "@/firebase";
import { collection, query, orderBy, serverTimestamp, Timestamp } from "firebase/firestore";
import type { Prescription } from "@/lib/api";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface ChatMessage {
    id?: string;
    sender: 'user' | 'ai';
    text: string;
    timestamp?: Timestamp | any;
}

interface ChatMessageDoc {
    id?: string;
    isUserMessage: boolean;
    messageText: string;
    timestamp: Timestamp;
}

interface MedicationDoc {
    name: string;
    stockQuantity: number;
    expiryDate: string;
}

export default function ChatInterface() {
    const { user } = useUser();
    const firestore = useFirestore();

    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [clientMessages, setClientMessages] = useState<ChatMessage[]>([]);
    const scrollAreaRef = useRef<HTMLDivElement>(null);

    const chatMessagesQuery = useMemoFirebase(() => {
        if (!firestore || !user) return null;
        return query(collection(firestore, `users/${user.uid}/chatMessages`), orderBy("timestamp", "asc"));
    }, [firestore, user]);
    const { data: messages, isLoading: messagesLoading, error: messagesError } = useCollection<ChatMessageDoc>(chatMessagesQuery);
    
    const prescriptionsQuery = useMemoFirebase(() => {
        if (!firestore || !user) return null;
        return collection(firestore, `users/${user.uid}/prescriptions`);
    }, [firestore, user]);
    const { data: prescriptions } = useCollection<Prescription>(prescriptionsQuery);
    
    const medicationsQuery = useMemoFirebase(() => {
        if (!firestore || !user) return null;
        return collection(firestore, `users/${user.uid}/medications`);
    }, [firestore, user]);
    const { data: medications } = useCollection<MedicationDoc>(medicationsQuery);

    const chatMessagesCollectionRef = useMemoFirebase(() => {
        if (!firestore || !user) return null;
        return collection(firestore, `users/${user.uid}/chatMessages`);
    }, [firestore, user]);
    
    useEffect(() => {
        if (messages && messages.length > 0) {
             setClientMessages(messages.map(m => ({ 
                id: m.id,
                sender: m.isUserMessage ? 'user' : 'ai', 
                text: m.messageText || '',
                timestamp: m.timestamp
            })));
        } else if (!messagesLoading && clientMessages.length === 0) {
             setClientMessages([{ sender: 'ai', text: 'Hello! I am your MediCheck AI assistant. How can I help you interpret your symptoms or medication guidance today?' }]);
        }
    }, [messages, messagesLoading]);

    useEffect(() => {
        if (scrollAreaRef.current) {
            const viewport = scrollAreaRef.current.querySelector('div[data-radix-scroll-area-viewport]');
            if (viewport) {
                viewport.scrollTo({ top: viewport.scrollHeight, behavior: 'smooth' });
            }
        }
    }, [clientMessages, isLoading]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading || !chatMessagesCollectionRef) return;

        const userMessageText = input;
        setInput('');
        setIsLoading(true);
        
        // Optimistic UI update handled by Firebase listener, but we can add immediate feedback
        addDocumentNonBlocking(chatMessagesCollectionRef, {
            messageText: userMessageText,
            isUserMessage: true,
            timestamp: serverTimestamp(),
        });

        try {
            const aiInput: ChatAssistantMedicationGuidanceInput = {
                query: userMessageText,
            };

            if (prescriptions) {
                aiInput.prescriptions = prescriptions.map(p => ({
                    name: p.name,
                    date: p.uploadTimestamp?.toDate().toLocaleDateString() ?? 'N/A',
                    safetyScore: p.safetyScore,
                    issues: p.issues || [],
                }));
            }

            if (medications) {
                 aiInput.medications = medications.map(m => ({
                    name: m.name,
                    stockQuantity: m.stockQuantity,
                    expiryDate: m.expiryDate,
                }));
            }

            const { response } = await chatAssistantMedicationGuidance(aiInput);

            addDocumentNonBlocking(chatMessagesCollectionRef, {
                messageText: response,
                isUserMessage: false,
                timestamp: serverTimestamp(),
            });

        } catch (error) {
            console.error("Chat error:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Card className="flex flex-col h-[calc(100vh-12rem)] shadow-lg border-primary/10">
            <CardHeader className="border-b bg-muted/20 py-4">
                <div className="flex items-center gap-3">
                    <div className="bg-primary p-2 rounded-full">
                        <MessageCircle className="h-5 w-5 text-white" />
                    </div>
                    <div>
                        <CardTitle className="text-lg">Health Assistant</CardTitle>
                        <p className="text-xs text-muted-foreground">Always consult a doctor for serious conditions.</p>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="flex-grow p-0 overflow-hidden relative">
                <ScrollArea className="h-full" ref={scrollAreaRef}>
                     <div className="p-6 space-y-6">
                        {messagesError && (
                            <Alert variant="destructive" className="mx-4">
                                <AlertTriangle className="h-4 w-4" />
                                <AlertTitle>Connection Error</AlertTitle>
                                <AlertDescription>Could not sync your message history.</AlertDescription>
                            </Alert>
                        )}
                        
                        {clientMessages.map((message, index) => (
                            <div
                                key={message.id || `msg-${index}`}
                                className={cn(
                                    "flex items-start gap-3 animate-in fade-in slide-in-from-bottom-2 duration-300",
                                    message.sender === 'user' ? "flex-row-reverse" : "flex-row"
                                )}
                            >
                                <Avatar className={cn("h-8 w-8 mt-1", message.sender === 'ai' ? "bg-primary" : "bg-muted")}>
                                    <AvatarFallback className={message.sender === 'ai' ? "bg-primary text-white" : ""}>
                                        {message.sender === 'ai' ? <Bot size={18}/> : <User size={18}/>}
                                    </AvatarFallback>
                                </Avatar>
                                <div
                                    className={cn(
                                        "max-w-[80%] rounded-2xl px-4 py-2.5 text-sm shadow-sm",
                                        message.sender === 'user'
                                            ? "bg-primary text-primary-foreground rounded-tr-none"
                                            : "bg-muted text-foreground rounded-tl-none"
                                    )}
                                >
                                    <p className="whitespace-pre-wrap leading-relaxed">{message.text}</p>
                                </div>
                            </div>
                        ))}
                        
                        {isLoading && (
                            <div className="flex items-start gap-3 justify-start animate-pulse">
                                <Avatar className="h-8 w-8 bg-primary">
                                   <AvatarFallback className="bg-primary text-white"><Bot size={18}/></AvatarFallback>
                                </Avatar>
                                <div className="bg-muted rounded-2xl rounded-tl-none px-4 py-3 flex items-center gap-2">
                                    <div className="h-1.5 w-1.5 bg-primary/40 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                                    <div className="h-1.5 w-1.5 bg-primary/40 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                                    <div className="h-1.5 w-1.5 bg-primary/40 rounded-full animate-bounce"></div>
                                </div>
                            </div>
                        )}
                    </div>
                </ScrollArea>
            </CardContent>
            <CardFooter className="border-t p-4 bg-muted/5">
                <form onSubmit={handleSubmit} className="flex w-full items-center gap-2">
                    <Input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Describe your symptoms or ask about medicine..."
                        className="rounded-full py-6 px-6 focus-visible:ring-primary/20"
                        disabled={isLoading || messagesLoading}
                    />
                    <Button 
                        type="submit" 
                        disabled={isLoading || messagesLoading || !input.trim()} 
                        size="icon" 
                        className="rounded-full h-12 w-12 shrink-0 shadow-md transition-transform active:scale-95"
                    >
                        <Send className="h-5 w-5" />
                        <span className="sr-only">Send</span>
                    </Button>
                </form>
            </CardFooter>
        </Card>
    );
}