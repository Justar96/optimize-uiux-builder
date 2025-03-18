
import { ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";
import { useChatAnimation } from "@/hooks/useChatAnimation";

interface ChipButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: React.ReactNode;
  active?: boolean;
  variant?: "default" | "ghost";
  animationDelay?: number;
}

const ChipButton = forwardRef<HTMLButtonElement, ChipButtonProps>(
  ({ 
    className, 
    icon, 
    children, 
    active = false, 
    variant = "default",
    animationDelay,
    ...props 
  }, ref) => {
    const animationRef = useChatAnimation(animationDelay);
    
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center gap-2 px-4 py-2 text-sm rounded-lg transition-colors duration-300",
          variant === "default" ? 
            "bg-chat-input border border-chat-border/50 hover:bg-chat-highlight/30 hover:border-chat-border" : 
            "bg-transparent hover:bg-chat-input/40",
          active && "bg-blue-500/10 text-blue-400 border-blue-500/30",
          className
        )}
        {...props}
      >
        <div ref={animationRef} className="flex items-center gap-2">
          {icon && <span className="flex-shrink-0">{icon}</span>}
          {children}
        </div>
      </button>
    );
  }
);

ChipButton.displayName = "ChipButton";

export default ChipButton;
