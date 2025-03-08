
import { ChevronDown, Menu } from "lucide-react";
import Avatar from "./Avatar";
import { cn } from "@/lib/utils";

interface ChatHeaderProps {
  modelName?: string;
  className?: string;
}

const ChatHeader = ({ 
  modelName = "ChatGPT 4o", 
  className 
}: ChatHeaderProps) => {
  return (
    <div 
      className={cn(
        "flex items-center justify-between py-2 px-3 border-b border-chat-border",
        className
      )}
    >
      <div className="flex items-center gap-2">
        <Menu size={18} className="text-gray-400 cursor-pointer hover:text-white transition-colors duration-200" />
        
        <button className="flex items-center gap-1.5 bg-transparent hover:bg-chat-light px-2.5 py-1 rounded-md transition-colors duration-200">
          <span className="font-medium text-sm">{modelName}</span>
          <ChevronDown size={14} className="text-gray-400" />
        </button>
      </div>
      
      <Avatar 
        initial="MA" 
        color="bg-purple-700" 
        size="sm" 
      />
    </div>
  );
};

export default ChatHeader;
