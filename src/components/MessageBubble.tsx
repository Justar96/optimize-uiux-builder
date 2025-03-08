
import { cn } from "@/lib/utils";
import { useChatAnimation } from "@/hooks/useChatAnimation";
import { ReactNode } from "react";

interface MessageBubbleProps {
  children: ReactNode;
  isUser?: boolean;
  isLoading?: boolean;
  className?: string;
  animationDelay?: number;
}

const MessageBubble = ({ 
  children, 
  isUser = false,
  isLoading = false,
  className,
  animationDelay = 0
}: MessageBubbleProps) => {
  const animationRef = useChatAnimation(animationDelay);
  
  return (
    <div 
      ref={animationRef}
      className={cn(
        "rounded-2xl p-4 max-w-3xl",
        isUser ? "bg-blue-600 text-white" : "bg-chat-light text-white",
        isLoading && "animate-pulse-subtle",
        className
      )}
    >
      {children}
    </div>
  );
};

export default MessageBubble;
