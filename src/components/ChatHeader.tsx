
import { Shield, ChevronDown, Menu } from 'lucide-react';
import { useSidebar } from '@/components/ui/sidebar';

interface ChatHeaderProps {
  className?: string;
}

const ChatHeader = ({ className }: ChatHeaderProps) => {
  const { toggleSidebar } = useSidebar();
  
  return (
    <header className="bg-chat-dark py-3 px-4">
      <div className="max-w-3xl mx-auto flex items-center justify-between">
        <button 
          onClick={toggleSidebar}
          className="flex items-center justify-center h-9 w-9 rounded-md text-gray-400 hover:text-blue-400 hover:bg-blue-500/10 transition-all duration-200 md:hidden"
          aria-label="Toggle sidebar"
        >
          <Menu size={20} />
        </button>
        
        <div className="flex items-center gap-2">
          <Shield size={18} className="text-blue-400" />
          <span className="text-white text-sm font-medium">ChatGPT</span>
          <div className="flex items-center text-xs px-2 py-0.5 bg-chat-light rounded-full text-gray-300">
            <span>GPT 4</span>
            <ChevronDown size={14} className="ml-1" />
          </div>
        </div>
        
        <div className="w-9">
          {/* Spacer to maintain centering */}
        </div>
      </div>
    </header>
  );
};

export default ChatHeader;
