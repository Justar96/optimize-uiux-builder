
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { SidebarProvider, Sidebar, SidebarContent, SidebarHeader, SidebarFooter, SidebarMenu, SidebarMenuItem, SidebarMenuButton } from "@/components/ui/sidebar";
import { MessageSquare, Settings, Users, Moon, Sun, PlusCircle } from "lucide-react";
import { useState } from "react";

type ChatSession = {
  id: string;
  title: string;
  updatedAt: Date;
};

const Index = () => {
  const navigate = useNavigate();
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [isDarkMode, setIsDarkMode] = useState(true);
  
  useEffect(() => {
    // If no sessions, redirect to new chat page
    const storedSessions = JSON.parse(localStorage.getItem('chatSessions') || '[]');
    
    if (storedSessions.length === 0) {
      navigate('/new');
      return;
    }
    
    // Sort sessions by updatedAt (most recent first)
    const sortedSessions = [...storedSessions].sort((a: any, b: any) => 
      new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );
    
    setSessions(sortedSessions);
  }, [navigate]);
  
  const handleNewChat = () => {
    navigate('/new');
  };
  
  const handleOpenChat = (sessionId: string) => {
    navigate(`/chat/${sessionId}`);
  };
  
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
          <header className="flex items-center justify-between p-4 border-b border-gray-700">
            <h1 className="text-xl text-white font-medium">Your Conversations</h1>
            <button 
              onClick={handleNewChat}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 transition-colors rounded-md px-3 py-2 text-white"
            >
              <PlusCircle size={16} />
              <span>New Chat</span>
            </button>
          </header>
          
          <main className="flex-1 overflow-y-auto p-4">
            <div className="max-w-4xl mx-auto">
              {sessions.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-400">No conversations yet</p>
                  <button 
                    onClick={handleNewChat}
                    className="mt-4 inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 transition-colors rounded-md px-4 py-2 text-white"
                  >
                    <PlusCircle size={18} />
                    <span>Start a New Chat</span>
                  </button>
                </div>
              ) : (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {sessions.map((session) => (
                    <div 
                      key={session.id} 
                      className="bg-gray-800 rounded-lg p-4 cursor-pointer hover:bg-gray-700 transition-colors"
                      onClick={() => handleOpenChat(session.id)}
                    >
                      <h3 className="text-white font-medium mb-2 truncate">{session.title}</h3>
                      <p className="text-gray-400 text-sm">
                        {new Date(session.updatedAt).toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Index;
