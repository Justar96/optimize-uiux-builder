
import { Globe, Search, Sparkles, CloudSun } from "lucide-react";
import ChipButton from "./ChipButton";
import { cn } from "@/lib/utils";

interface OptionsPanelProps {
  className?: string;
  onSuggestionClick?: (suggestion: string) => void;
}

const OptionsPanel = ({ className, onSuggestionClick }: OptionsPanelProps) => {
  const handleClick = (suggestion: string) => {
    if (onSuggestionClick) {
      onSuggestionClick(suggestion);
    }
  };
  
  return (
    <div 
      className={cn(
        "flex flex-wrap items-center gap-2",
        className
      )}
    >
      <ChipButton 
        icon={<Search size={16} />}
        animationDelay={100}
        onClick={() => handleClick("Search for information about artificial intelligence")}
      >
        Search
      </ChipButton>
      
      <ChipButton 
        icon={<Sparkles size={16} />}
        animationDelay={150}
        onClick={() => handleClick("Find information about machine learning")}
      >
        Deep research
      </ChipButton>
      
      <ChipButton 
        icon={<CloudSun size={16} />}
        animationDelay={175}
        onClick={() => handleClick("What's the weather like in Paris today?")}
      >
        Weather
      </ChipButton>
      
      <ChipButton 
        icon={<Globe size={16} />}
        variant="ghost"
        animationDelay={200}
        className="opacity-60 hover:opacity-100"
        onClick={() => handleClick("Tell me about the latest tech news")}
      >
        Web browsing
      </ChipButton>
    </div>
  );
};

export default OptionsPanel;
