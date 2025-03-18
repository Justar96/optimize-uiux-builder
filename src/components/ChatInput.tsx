
import { useState, useRef, FormEvent } from "react";
import { Mic, PlusCircle, SendHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import OptionsPanel from "./OptionsPanel";

interface ChatInputProps {
  onSendMessage?: (message: string) => void;
  className?: string;
}

const ChatInput = ({ onSendMessage, className }: ChatInputProps) => {
  const [message, setMessage] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (message.trim() === "") return;
    
    onSendMessage?.(message);
    setMessage("");
    
    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };
  
  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
    
    // Auto-adjust height
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  };
  
  return (
    <div 
      className={cn(
        "w-full max-w-3xl mx-auto",
        className
      )}
    >
      <form 
        onSubmit={handleSubmit}
        className={cn(
          "relative rounded-2xl border bg-chat-input border-chat-border shadow-md transition-all overflow-hidden",
          isFocused && "border-blue-500"
        )}
      >
        {isFocused && (
          <div className="absolute top-0 left-0 w-full h-0.5 bg-blue-500" />
        )}
        
        <div className="flex items-end p-3">
          <button 
            type="button" 
            className="flex-shrink-0 p-1 rounded-full text-gray-400 hover:text-white hover:bg-chat-highlight/50 transition-colors duration-200"
          >
            <PlusCircle size={20} />
          </button>
          
          <textarea
            ref={textareaRef}
            value={message}
            onChange={handleTextareaChange}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder="Ask anything"
            rows={1}
            className="flex-grow px-3 py-2 bg-transparent border-none outline-none resize-none text-white placeholder-gray-500"
          />
          
          <div className="flex items-center gap-2">
            <button 
              type="button" 
              className="flex-shrink-0 p-1 rounded-full text-gray-400 hover:text-white hover:bg-chat-highlight/50 transition-colors duration-200"
            >
              <Mic size={20} />
            </button>
            
            <button 
              type="submit" 
              disabled={!message.trim()}
              className={cn(
                "flex-shrink-0 p-2 rounded-full transition-colors",
                message.trim() 
                  ? "bg-blue-600 text-white hover:bg-blue-700" 
                  : "text-gray-500 cursor-not-allowed"
              )}
            >
              <SendHorizontal size={18} />
            </button>
          </div>
        </div>
      </form>
      
      <div className="mt-3">
        <OptionsPanel />
      </div>
    </div>
  );
};

export default ChatInput;
