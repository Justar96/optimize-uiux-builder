
import { useState } from "react";
import { useParams } from "react-router-dom";
import ChatHeader from "@/components/ChatHeader";
import ChatInput from "@/components/ChatInput";
import { AlertTriangle } from "lucide-react";
import { SidebarProvider, Sidebar, SidebarContent, SidebarHeader, SidebarFooter, SidebarMenu, SidebarMenuItem, SidebarMenuButton } from "@/components/ui/sidebar";
import { MessageSquare, Settings, Users, Moon, Sun, PlusCircle } from "lucide-react";
import WelcomeScreen from "@/components/WelcomeScreen";
import MessageList from "@/components/MessageList";
import { useChatSession } from "@/hooks/useChatSession";

interface ChatSessionPageProps {
  isNew?: boolean;
}

const ChatSessionPage = ({ isNew = false }: ChatSessionPageProps) => {
  const { sessionId } = useParams();
  const [isDarkMode, setIsDarkMode] = useState(true);
  
  const { 
    session, 
    isTyping, 
    handleSendMessage, 
    handleNewChat 
  } = useChatSession({ 
    sessionId, 
    isNew 
  });
  
  if (!session) {
    return <div className="h-screen flex items-center justify-center">Loading...</div>;
  }
  
  return (
    <SidebarProvider defaultOpen={false}>
      <div className="flex h-screen w-full overflow-hidden bg-chat-dark">
        <Sidebar variant="floating">
          <SidebarHeader>
            <div className="px-3 py-2">
              <button 
                onClick={handleNewChat} 
                className="w-full flex items-center gap-2 bg-blue-600 hover:bg-blue-500 transition-colors rounded-md px-3 py-2 text-white"
              >
                <PlusCircle size={16} />
                <span>New Chat</span>
              </button>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton tooltip="Chats" isActive={true}>
                  <MessageSquare />
                  <span>Chats</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton tooltip="Community">
                  <Users />
                  <span>Community</span>
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
        
        <div className="flex flex-col flex-1 overflow-hidden bg-chat-dark w-full max-w-full">
          <ChatHeader />
          
          <main className="flex-1 overflow-y-auto px-4 py-6 sm:py-8 hide-scrollbar">
            <div className="max-w-5xl mx-auto w-full">
              {session.messages.length === 0 ? (
                <WelcomeScreen onSendMessage={handleSendMessage} />
              ) : (
                <MessageList 
                  messages={session.messages} 
                  isTyping={isTyping} 
                />
              )}
            </div>
          </main>
          
          <footer className="p-4 pb-6 bg-gradient-to-t from-chat-dark to-transparent sticky bottom-0 z-10">
            <div className="max-w-5xl mx-auto w-full">
              <ChatInput onSendMessage={handleSendMessage} />
              
              <div className="mt-3 text-center text-xs text-gray-500 flex items-center justify-center gap-1">
                <AlertTriangle size={12} />
                <span>ChatGPT can make mistakes. Check important info.</span>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default ChatSessionPage;
