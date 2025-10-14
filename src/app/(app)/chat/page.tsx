import ChatInterface from "./components/chat-interface";

export default function ChatPage() {
    return (
        <div className="flex flex-col gap-8 h-[calc(100vh-8rem)]">
            <div className="flex-shrink-0">
                <h1 className="text-3xl font-bold tracking-tight">AI Chat Assistant</h1>
                <p className="text-muted-foreground">Get medication guidance and ask questions about your symptoms.</p>
            </div>
            
            <ChatInterface />
        </div>
    );
}
