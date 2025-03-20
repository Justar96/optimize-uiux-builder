
import { useState, useEffect, useRef } from "react";
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

const Index = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [showFooterInput, setShowFooterInput] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);
  
  const handleSendMessage = async (content: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      isUser: true,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setShowFooterInput(true);
    setIsTyping(true);
    
    // Add user message to chat history
    const userChatMessage: ChatMessage = {
      role: "user",
      content: content
    };
    
    const updatedChatMessages = [...chatMessages, userChatMessage];
    setChatMessages(updatedChatMessages);
    
    try {
      // Call OpenAI API
      const response = await callOpenAI(updatedChatMessages);
      
      if (response.type === "content") {
        // Regular message response
        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: response.content,
          isUser: false,
          timestamp: new Date()
        };
        
        setMessages(prev => [...prev, aiMessage]);
        setChatMessages(prev => [...prev, { 
          role: "assistant", 
          content: response.content 
        }]);
      } 
      else if (response.type === "tool_calls") {
        // Function call response
        const toolCallsMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: "I need to get some information to answer that properly.",
          isUser: false,
          timestamp: new Date(),
          toolCalls: response.tool_calls
        };
        
        setMessages(prev => [...prev, toolCallsMessage]);
        
        // Add assistant message with tool_calls to chat history
        const assistantMessage: ChatMessage = {
          role: "assistant",
          content: "",
          tool_call_id: response.tool_calls[0].id
        };
        
        setChatMessages(prev => [...prev, assistantMessage]);
        
        // Execute each function call
        for (const toolCall of response.tool_calls) {
          if (toolCall.type === "function") {
            const functionName = toolCall.function.name;
            const args = JSON.parse(toolCall.function.arguments);
            
            // Show function execution message
            const executingMessage: Message = {
              id: (Date.now() + 2).toString(),
              content: `Executing ${functionName}...`,
              isUser: false,
              timestamp: new Date()
            };
            
            setMessages(prev => [...prev, executingMessage]);
            
            // Execute the function
            const result = await executeFunction(functionName, args);
            
            // Add function result to chat history
            setChatMessages(prev => [...prev, {
              role: "tool",
              tool_call_id: toolCall.id,
              content: result
            }]);
            
            // Get AI's final response that incorporates the function result
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
              
              setMessages(prev => prev.filter(m => m.id !== executingMessage.id).concat(finalMessage));
              
              // Add AI's final response to chat history
              setChatMessages(prev => [...prev, {
                role: "assistant",
                content: finalResponse.content
              }]);
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
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };
  
  const handleNewChat = () => {
    setMessages([]);
    setChatMessages([]);
    setShowFooterInput(false);
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
          
          {showFooterInput && (
            <footer className="p-4 pb-6 bg-gradient-to-t from-chat-dark to-transparent sticky bottom-0 z-10">
              <div className="max-w-5xl mx-auto w-full">
                <ChatInput onSendMessage={handleSendMessage} />
                
                <div className="mt-3 text-center text-xs text-gray-500 flex items-center justify-center gap-1">
                  <AlertTriangle size={12} />
                  <span>ChatGPT can make mistakes. Check important info.</span>
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

export default Index;
