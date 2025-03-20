
import { useParams } from "react-router-dom";
import { useChatSession } from "@/hooks/useChatSession";
import { MessageList } from "@/components/MessageList";
import ChatInput from "@/components/ChatInput";
import ChatHeader from "@/components/ChatHeader";
import WelcomeScreen from "@/components/WelcomeScreen";

interface ChatSessionPageProps {
  isNew?: boolean;
}

const ChatSessionPage = ({ isNew = false }: ChatSessionPageProps) => {
  const { sessionId } = useParams();
  const { session, isTyping, handleSendMessage, handleNewChat } = useChatSession({
    sessionId,
    isNew
  });

  const hasMessages = session?.messages.length > 0;
  const isTemporarySession = isNew && (!session || session.id === "temp-id");
  
  return (
    <div className="flex flex-col h-screen w-full overflow-hidden bg-chat-dark">
      <ChatHeader 
        title={session?.title || "New Chat"} 
        onNewChat={handleNewChat}
      />
      
      <div className="flex-1 overflow-hidden relative">
        {hasMessages ? (
          <MessageList 
            messages={session?.messages || []} 
            isTyping={isTyping}
          />
        ) : (
          <WelcomeScreen onSendMessage={handleSendMessage} />
        )}
      </div>
      
      {/* Only show bottom input if we have messages or this is an existing session */}
      {(hasMessages || !isTemporarySession) && (
        <div className="p-4 border-t border-gray-700">
          <ChatInput onSendMessage={handleSendMessage} />
        </div>
      )}
    </div>
  );
};

export default ChatSessionPage;
