
import { Sparkles, ChevronDown, Menu } from 'lucide-react';
import { useSidebar } from '@/components/ui/sidebar';

interface ChatHeaderProps {
  className?: string;
}

const ChatHeader = ({ className }: ChatHeaderProps) => {
  const { toggleSidebar, state } = useSidebar();
  
  return (
    <header className="bg-purple-950 border-b border-purple-800/50 py-3 px-4 sticky top-0 z-10">
      <div className="max-w-5xl w-full mx-auto flex items-center justify-between">
        <button 
          onClick={toggleSidebar}
          className="flex items-center justify-center h-9 w-9 rounded-md text-purple-300 hover:text-purple-200 hover:bg-purple-800/40 transition-all duration-200 -ml-2"
          aria-label="Toggle sidebar"
          data-state={state}
        >
          <Menu size={20} />
        </button>
        
        <div className="flex items-center gap-2">
          <Sparkles size={18} className="text-purple-400" />
          <span className="text-white text-sm font-medium">OngphraAI</span>
          <div className="flex items-center text-xs px-2 py-0.5 bg-purple-800/50 rounded-full text-purple-200">
            <span>Fortune Teller</span>
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
