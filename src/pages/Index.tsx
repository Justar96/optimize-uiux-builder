
import { useState, useEffect, useRef } from "react";
import ChatHeader from "@/components/ChatHeader";
import ChatInput from "@/components/ChatInput";
import MessageBubble from "@/components/MessageBubble";
import { AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

type Message = {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
};

const Index = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [showFooterInput, setShowFooterInput] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);
  
  const handleSendMessage = (content: string) => {
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      isUser: true,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setShowFooterInput(true);
    
    // Simulate AI response
    setIsTyping(true);
    
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "I'm an AI assistant designed to provide helpful, accurate, and ethical responses. How can I assist you today?",
        isUser: false,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1500);
  };
  
  return (
    <div className="flex flex-col h-screen overflow-hidden bg-chat-dark">
      <ChatHeader />
      
      <main className="flex-1 overflow-y-auto px-4 py-6 hide-scrollbar">
        <div className="max-w-3xl mx-auto">
          {messages.length === 0 ? (
            <WelcomeScreen onSendMessage={handleSendMessage} />
          ) : (
            <div className="space-y-6">
              {messages.map((message, index) => (
                <div 
                  key={message.id}
                  className={cn(
                    "flex",
                    message.isUser ? "justify-end" : "justify-start"
                  )}
                >
                  <MessageBubble 
                    isUser={message.isUser}
                    animationDelay={index * 100}
                  >
                    {message.content}
                  </MessageBubble>
                </div>
              ))}
              
              {isTyping && (
                <div className="flex justify-start">
                  <MessageBubble isLoading>
                    <div className="flex space-x-2">
                      <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                      <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                      <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </MessageBubble>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>
      </main>
      
      <footer className={cn(
        "p-4 border-t border-chat-border transition-all duration-300",
        showFooterInput ? "opacity-100 transform translate-y-0" : "opacity-0 transform translate-y-10 pointer-events-none"
      )}>
        <ChatInput onSendMessage={handleSendMessage} />
        
        <div className="max-w-3xl mx-auto mt-4 text-center text-xs text-gray-500 flex items-center justify-center gap-1">
          <AlertTriangle size={12} />
          <span>ChatGPT can make mistakes. Check important info.</span>
        </div>
      </footer>
    </div>
  );
};

const WelcomeScreen = ({ 
  onSendMessage
}: { 
  onSendMessage: (message: string) => void
}) => {
  return (
    <div className="h-full flex flex-col items-center justify-center">
      <h1 className="text-4xl font-medium text-white mb-16 animate-fade-in">
        What can I help with?
      </h1>
      
      <div className="w-full">
        <ChatInput 
          onSendMessage={onSendMessage} 
          className="animate-slide-up"
        />
      </div>
    </div>
  );
};

export default Index;
