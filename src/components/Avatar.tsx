
import { cn } from "@/lib/utils";
import { useChatAnimation } from "@/hooks/useChatAnimation";

interface AvatarProps {
  initial?: string;
  color?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
  animationDelay?: number;
}

const Avatar = ({ 
  initial = "A", 
  color = "bg-purple-600", 
  size = "md",
  className,
  animationDelay
}: AvatarProps) => {
  const animationRef = useChatAnimation(animationDelay);
  
  const sizeClasses = {
    sm: "w-8 h-8 text-xs",
    md: "w-10 h-10 text-sm",
    lg: "w-12 h-12 text-base"
  };
  
  return (
    <div 
      ref={animationRef}
      className={cn(
        "rounded-full flex items-center justify-center font-medium text-white transition-all duration-300",
        sizeClasses[size],
        color,
        className
      )}
    >
      {initial}
    </div>
  );
};

export default Avatar;
