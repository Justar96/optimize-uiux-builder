
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { toast } from "sonner";
import { ChatSession, Message } from "@/types/chat";
import { callOpenAI, executeFunction, ChatMessage, ToolCall } from "@/services/openai";

interface UseChatSessionProps {
  sessionId?: string;
  isNew?: boolean;
}

export const useChatSession = ({ sessionId, isNew = false }: UseChatSessionProps) => {
  const navigate = useNavigate();
  const [session, setSession] = useState<ChatSession | null>(null);
  const [isTyping, setIsTyping] = useState(false);

  // Load existing session on mount if not new
  useEffect(() => {
    if (!isNew && sessionId) {
      // Load existing session
      const sessions = JSON.parse(localStorage.getItem('chatSessions') || '[]');
      const foundSession = sessions.find((s: ChatSession) => s.id === sessionId);
      
      if (foundSession) {
        setSession(foundSession);
      } else {
        // Session not found, redirect to home
        navigate('/');
      }
    } else if (isNew) {
      // For new sessions, we just set a temporary placeholder
      // The actual session will be created when the user sends their first message
      setSession({
        id: "temp-id",
        title: "New Chat",
        messages: [],
        chatMessages: [],
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }
  }, [isNew, sessionId, navigate]);

  const updateSession = (updatedSession: ChatSession) => {
    setSession(updatedSession);
    
    // Update in localStorage
    const sessions = JSON.parse(localStorage.getItem('chatSessions') || '[]');
    const updatedSessions = sessions.map((s: ChatSession) => 
      s.id === updatedSession.id ? updatedSession : s
    );
    
    if (!sessions.some((s: ChatSession) => s.id === updatedSession.id)) {
      updatedSessions.push(updatedSession);
    }
    
    localStorage.setItem('chatSessions', JSON.stringify(updatedSessions));
  };

  const handleSendMessage = async (content: string) => {
    if (!session) return;
    
    // If this is a new session (temp-id), create a real session first
    let currentSession = session;
    if (isNew && session.id === "temp-id") {
      const newSessionId = uuidv4();
      currentSession = {
        ...session,
        id: newSessionId,
        title: content.substring(0, 30),
        createdAt: new Date(),
        updatedAt: new Date()
      };
      // Update URL without reloading
      navigate(`/chat/${newSessionId}`, { replace: true });
    }
    
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
    
    const updatedMessages = [...currentSession.messages, userMessage];
    const updatedChatMessages = [...currentSession.chatMessages, userChatMessage];
    
    // Update session
    const updatedSession = {
      ...currentSession,
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
        
        const assistantChatMessage: ChatMessage = { 
          role: "assistant", 
          content: response.content 
        };
        
        const finalSession = {
          ...updatedSession,
          messages: [...updatedMessages, aiMessage],
          chatMessages: [...updatedChatMessages, assistantChatMessage],
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
        
        let currentToolSession = {
          ...updatedSession,
          messages: [...updatedMessages, toolCallsMessage],
          updatedAt: new Date()
        };
        
        updateSession(currentToolSession);
        
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
            
            currentToolSession = {
              ...currentToolSession,
              messages: [...currentToolSession.messages, executingMessage],
              updatedAt: new Date()
            };
            
            updateSession(currentToolSession);
            
            const result = await executeFunction(functionName, args);
            
            const toolResultMessage: ChatMessage = {
              role: "tool",
              tool_call_id: toolCall.id,
              content: result
            };
            
            const withToolResult = [...updatedChatMessagesWithAssistant, toolResultMessage];
            
            const finalResponse = await callOpenAI([
              ...updatedChatMessages,
              assistantMessage,
              toolResultMessage
            ]);
            
            if (finalResponse.type === "content") {
              const finalMessage: Message = {
                id: (Date.now() + 3).toString(),
                content: finalResponse.content,
                isUser: false,
                timestamp: new Date()
              };
              
              const messagesWithoutExecuting = currentToolSession.messages.filter(
                m => m.id !== executingMessage.id
              );
              
              const finalChatMessage: ChatMessage = {
                role: "assistant",
                content: finalResponse.content
              };
              
              const finalSession = {
                ...currentToolSession,
                messages: [...messagesWithoutExecuting, finalMessage],
                chatMessages: [...withToolResult, finalChatMessage],
                title: updatedMessages.length === 1 ? content.substring(0, 30) : currentToolSession.title,
                updatedAt: new Date()
              };
              
              updateSession(finalSession);
            }
          }
        }
      }
    } catch (error) {
      console.error("Error in AI response:", error);
      toast.error("Failed to get AI response");
      
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

  return {
    session,
    isTyping,
    handleSendMessage,
    handleNewChat
  };
};
