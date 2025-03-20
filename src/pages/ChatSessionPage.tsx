
import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import ChatHeader from "@/components/ChatHeader";
import ChatInput from "@/components/ChatInput";
import MessageBubble from "@/components/MessageBubble";
import { AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import { SidebarProvider, Sidebar, SidebarContent, SidebarHeader, SidebarFooter, SidebarMenu, SidebarMenuItem, SidebarMenuButton } from "@/components/ui/sidebar";
import { MessageSquare, Settings, Users, Moon, Sun, PlusCircle } from "lucide-react";
import { callOpenAI, executeFunction, ChatMessage, ToolCall } from "@/services/openai";

type Message = {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
  toolCalls?: ToolCall[];
};

type ChatSession = {
  id: string;
  title: string;
  messages: Message[];
  chatMessages: ChatMessage[];
  createdAt: Date;
  updatedAt: Date;
};

interface ChatSessionPageProps {
  isNew?: boolean;
}

const ChatSessionPage = ({ isNew = false }: ChatSessionPageProps) => {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const [session, setSession] = useState<ChatSession | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Load or create a chat session on mount
  useEffect(() => {
    if (isNew) {
      const newSessionId = uuidv4();
      const newSession: ChatSession = {
        id: newSessionId,
        title: "New Chat",
        messages: [],
        chatMessages: [],
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      // Save new session to localStorage
      const sessions = JSON.parse(localStorage.getItem('chatSessions') || '[]');
      localStorage.setItem('chatSessions', JSON.stringify([...sessions, newSession]));
      
      setSession(newSession);
      navigate(`/chat/${newSessionId}`, { replace: true });
    } else if (sessionId) {
      // Load existing session
      const sessions = JSON.parse(localStorage.getItem('chatSessions') || '[]');
      const foundSession = sessions.find((s: ChatSession) => s.id === sessionId);
      
      if (foundSession) {
        setSession(foundSession);
      } else {
        // Session not found, redirect to home
        navigate('/');
      }
    }
  }, [isNew, sessionId, navigate]);
  
  // Auto-scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [session?.messages, isTyping]);
  
  const updateSession = (updatedSession: ChatSession) => {
    setSession(updatedSession);
    
    // Update in localStorage
    const sessions = JSON.parse(localStorage.getItem('chatSessions') || '[]');
    const updatedSessions = sessions.map((s: ChatSession) => 
      s.id === updatedSession.id ? updatedSession : s
    );
    
    localStorage.setItem('chatSessions', JSON.stringify(updatedSessions));
  };
  
  const handleSendMessage = async (content: string) => {
    if (!session) return;
    
    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      isUser: true,
      timestamp: new Date()
    };
    
    const userChatMessage: ChatMessage = {
      role: "user",
      content: content
    };
    
    const updatedMessages = [...session.messages, userMessage];
    const updatedChatMessages = [...session.chatMessages, userChatMessage];
    
    // Update session
    const updatedSession = {
      ...session,
      messages: updatedMessages,
      chatMessages: updatedChatMessages,
      updatedAt: new Date()
    };
    
    updateSession(updatedSession);
    setIsTyping(true);
    
    try {
      const response = await callOpenAI(updatedChatMessages);
      
      if (response.type === "content") {
        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: response.content,
          isUser: false,
          timestamp: new Date()
        };
        
        const finalSession = {
          ...updatedSession,
          messages: [...updatedMessages, aiMessage],
          chatMessages: [...updatedChatMessages, { 
            role: "assistant", 
            content: response.content 
          }],
          title: updatedMessages.length === 1 ? content.substring(0, 30) : updatedSession.title,
          updatedAt: new Date()
        };
        
        updateSession(finalSession);
      } 
      else if (response.type === "tool_calls") {
        const toolCalls = response.tool_calls as ToolCall[];
        
        const toolCallsMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: "I need to get some information to answer that properly.",
          isUser: false,
          timestamp: new Date(),
          toolCalls: toolCalls
        };
        
        let currentSession = {
          ...updatedSession,
          messages: [...updatedMessages, toolCallsMessage],
          updatedAt: new Date()
        };
        
        updateSession(currentSession);
        
        const assistantMessage: ChatMessage = {
          role: "assistant",
          content: "",
          tool_call_id: toolCalls[0].id
        };
        
        const updatedChatMessagesWithAssistant = [...updatedChatMessages, assistantMessage];
        
        for (const toolCall of toolCalls) {
          if (toolCall.type === "function") {
            const functionName = toolCall.function.name;
            const args = JSON.parse(toolCall.function.arguments);
            
            const executingMessage: Message = {
              id: (Date.now() + 2).toString(),
              content: `Executing ${functionName}...`,
              isUser: false,
              timestamp: new Date()
            };
            
            currentSession = {
              ...currentSession,
              messages: [...currentSession.messages, executingMessage],
              updatedAt: new Date()
            };
            
            updateSession(currentSession);
            
            const result = await executeFunction(functionName, args);
            
            const withToolResult = [...updatedChatMessagesWithAssistant, {
              role: "tool",
              tool_call_id: toolCall.id,
              content: result
            }];
            
            const finalResponse = await callOpenAI([
              ...updatedChatMessages,
              assistantMessage,
              {
                role: "tool",
                tool_call_id: toolCall.id,
                content: result
              }
            ]);
            
            if (finalResponse.type === "content") {
              const finalMessage: Message = {
                id: (Date.now() + 3).toString(),
                content: finalResponse.content,
                isUser: false,
                timestamp: new Date()
              };
              
              const messagesWithoutExecuting = currentSession.messages.filter(
                m => m.id !== executingMessage.id
              );
              
              const finalSession = {
                ...currentSession,
                messages: [...messagesWithoutExecuting, finalMessage],
                chatMessages: [...withToolResult, {
                  role: "assistant",
                  content: finalResponse.content
                }],
                title: updatedMessages.length === 1 ? content.substring(0, 30) : currentSession.title,
                updatedAt: new Date()
              };
              
              updateSession(finalSession);
            }
          }
        }
      }
    } catch (error) {
      console.error("Error in AI response:", error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "Sorry, I encountered an error. Please try again later.",
        isUser: false,
        timestamp: new Date()
      };
      
      const errorSession = {
        ...updatedSession,
        messages: [...updatedMessages, errorMessage],
        updatedAt: new Date()
      };
      
      updateSession(errorSession);
    } finally {
      setIsTyping(false);
    }
  };
  
  const handleNewChat = () => {
    navigate('/new');
  };
  
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
                <div className="space-y-5 sm:space-y-6">
                  {session.messages.map((message, index) => (
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
                        {message.toolCalls && (
                          <div className="mt-2 text-xs opacity-75">
                            <div className="font-semibold">Using tools:</div>
                            <ul className="list-disc pl-4">
                              {message.toolCalls.map(tool => (
                                <li key={tool.id}>
                                  {tool.function.name}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
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

const WelcomeScreen = ({ 
  onSendMessage
}: { 
  onSendMessage: (message: string) => void
}) => {
  return (
    <div className="h-full flex flex-col items-center justify-center py-12">
      <h1 className="text-3xl sm:text-4xl font-medium text-white mb-8 sm:mb-12 animate-fade-in">
        What can I help with?
      </h1>
      
      <div className="w-full max-w-md mx-auto px-4 sm:px-0">
        <ChatInput 
          onSendMessage={onSendMessage} 
          className="animate-fade-in"
        />
      </div>
    </div>
  );
};

export default ChatSessionPage;
