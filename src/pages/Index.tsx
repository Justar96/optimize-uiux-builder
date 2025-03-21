
import { useState, useEffect, useRef } from "react";
import ChatHeader from "@/components/ChatHeader";
import ChatInput from "@/components/ChatInput";
import MessageBubble from "@/components/MessageBubble";
import { AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import { SidebarProvider, Sidebar, SidebarContent, SidebarHeader, SidebarFooter, SidebarMenu, SidebarMenuItem, SidebarMenuButton } from "@/components/ui/sidebar";
import { MessageSquare, Settings, Users, Moon, Sun, PlusCircle, Sparkles } from "lucide-react";

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
  const [isDarkMode, setIsDarkMode] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);
  
  const handleSendMessage = (content: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      isUser: true,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    
    setShowFooterInput(true);
    
    setIsTyping(true);
    
    setTimeout(() => {
      const fortunes = [
        "The stars align in your favor. Great fortune awaits you in the coming days.",
        "A journey of a thousand miles begins with a single step. Your path will soon become clear.",
        "Your destiny is written in the stars, but you hold the pen to rewrite it.",
        "The universe whispers secrets to those who listen. Be still and hear its guidance.",
        "A surprising opportunity will present itself when you least expect it.",
        "Your spirit guide is trying to contact you. Pay attention to recurring symbols.",
        "Trust your intuition in matters of the heart. It knows more than your mind.",
        "The energy around you is shifting. Prepare for transformation and renewal.",
        "Ancient wisdom suggests patience in your current situation. All will be revealed in time.",
        "The mystic forces indicate a powerful connection with someone from your past."
      ];
      
      const randomFortune = fortunes[Math.floor(Math.random() * fortunes.length)];
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: randomFortune,
        isUser: false,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1500);
  };
  
  return (
    <SidebarProvider defaultOpen={false}>
      <div className="flex h-screen w-full overflow-hidden bg-slate-900">
        <Sidebar variant="floating">
          <SidebarHeader>
            <div className="px-3 py-2">
              <button 
                onClick={() => {}} 
                className="w-full flex items-center gap-2 bg-blue-600 hover:bg-blue-500 transition-colors rounded-md px-3 py-2 text-white"
              >
                <PlusCircle size={16} />
                <span>New Reading</span>
              </button>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton tooltip="Readings" isActive={true}>
                  <MessageSquare />
                  <span>Readings</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton tooltip="Mystic Community">
                  <Users />
                  <span>Mystic Community</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton tooltip="Settings">
                  <Settings />
                  <span>Settings</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarContent>
          <SidebarFooter>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton 
                  tooltip={isDarkMode ? "Light Mode" : "Dark Mode"} 
                  onClick={() => setIsDarkMode(!isDarkMode)}
                >
                  {isDarkMode ? <Sun /> : <Moon />}
                  <span>{isDarkMode ? "Light Mode" : "Dark Mode"}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarFooter>
        </Sidebar>
        
        <div className="flex flex-col flex-1 overflow-hidden bg-slate-900 w-full max-w-full">
          <ChatHeader />
          
          <main className="flex-1 overflow-y-auto px-4 py-6 sm:py-8 hide-scrollbar">
            <div className="max-w-5xl mx-auto w-full">
              {messages.length === 0 ? (
                <WelcomeScreen onSendMessage={handleSendMessage} />
              ) : (
                <div className="space-y-5 sm:space-y-6">
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
          
          {showFooterInput && (
            <footer className="p-4 pb-6 bg-gradient-to-t from-slate-900 to-transparent sticky bottom-0 z-10">
              <div className="max-w-5xl mx-auto w-full">
                <ChatInput onSendMessage={handleSendMessage} />
                
                <div className="mt-3 text-center text-xs text-gray-300 flex items-center justify-center gap-1">
                  <AlertTriangle size={12} />
                  <span>OngphraAI offers mystical guidance, not concrete predictions.</span>
                </div>
              </div>
            </footer>
          )}
        </div>
      </div>
    </SidebarProvider>
  );
};

const WelcomeScreen = ({ 
  onSendMessage
}: { 
  onSendMessage: (message: string) => void
}) => {
  return (
    <div className="h-full flex flex-col items-center justify-center py-12">
      <div className="mb-6 flex items-center justify-center">
        <Sparkles className="text-blue-400 w-10 h-10" />
      </div>
      <h1 className="text-3xl sm:text-4xl font-medium text-white mb-4 sm:mb-6 animate-fade-in text-center">
        What does your future hold?
      </h1>
      <p className="text-gray-300 mb-8 text-center max-w-lg mx-auto animate-fade-in">
        Ask OngphraAI about your destiny, relationships, career, or any guidance you seek.
      </p>
      
      <div className="w-full max-w-3xl mx-auto px-4 sm:px-0">
        <ChatInput 
          onSendMessage={onSendMessage} 
          className="animate-fade-in"
        />
      </div>
    </div>
  );
};

export default Index;
