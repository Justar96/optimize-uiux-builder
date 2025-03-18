
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
          "relative rounded-xl bg-chat-light border-0 shadow-md transition-all overflow-hidden",
          isFocused && "ring-2 ring-blue-500/50"
        )}
      >
        <div className="flex items-end p-2.5">
          <button 
            type="button" 
            className="flex-shrink-0 p-1.5 rounded-full text-gray-400 hover:text-white hover:bg-chat-highlight/30 transition-colors duration-200"
          >
            <PlusCircle size={18} />
          </button>
          
          <textarea
            ref={textareaRef}
            value={message}
            onChange={handleTextareaChange}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder="Ask anything"
            rows={1}
            className="flex-grow px-3 py-2 bg-transparent border-none outline-none resize-none text-white placeholder-gray-400"
          />
          
          <div className="flex items-center gap-2">
            <button 
              type="button" 
              className="flex-shrink-0 p-1.5 rounded-full text-gray-400 hover:text-white hover:bg-chat-highlight/30 transition-colors duration-200"
            >
              <Mic size={18} />
            </button>
            
            <button 
              type="submit" 
              disabled={!message.trim()}
              className={cn(
                "flex-shrink-0 p-1.5 rounded-lg transition-colors",
                message.trim() 
                  ? "bg-blue-600 text-white hover:bg-blue-700" 
                  : "bg-chat-highlight/20 text-gray-500 cursor-not-allowed"
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
