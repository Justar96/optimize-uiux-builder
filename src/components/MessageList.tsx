
import { useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import MessageBubble from "./MessageBubble";
import { Message } from "@/types/chat";

interface MessageListProps {
  messages: Message[];
  isTyping: boolean;
}

const MessageList = ({ messages, isTyping }: MessageListProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  return (
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
  );
};

export default MessageList;
