
import { Globe, Search, Sparkles } from "lucide-react";
import ChipButton from "./ChipButton";
import { cn } from "@/lib/utils";

interface OptionsPanelProps {
  className?: string;
}

const OptionsPanel = ({ className }: OptionsPanelProps) => {
  return (
    <div 
      className={cn(
        "flex flex-wrap items-center gap-1.5",
        className
      )}
    >
      <ChipButton 
        icon={<Search size={14} />}
        animationDelay={100}
      >
        Search
      </ChipButton>
      
      <ChipButton 
        icon={<Sparkles size={14} />}
        animationDelay={150}
      >
        Deep research
      </ChipButton>
      
      <ChipButton 
        icon={<Globe size={14} />}
        variant="ghost"
        animationDelay={200}
        className="opacity-60 hover:opacity-100"
      >
        Web browsing
      </ChipButton>
    </div>
  );
};

export default OptionsPanel;
