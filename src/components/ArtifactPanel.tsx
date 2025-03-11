
import { AlertTriangle, Info } from "lucide-react";
import { cn } from "@/lib/utils";

interface ArtifactPanelProps {
  className?: string;
  artifactTitle?: string;
  artifactContent?: string | React.ReactNode;
}

const ArtifactPanel = ({ 
  className,
  artifactTitle = "Information",
  artifactContent = "No information available at the moment. When you ask for specific data or resources, they will appear here for easy reference."
}: ArtifactPanelProps) => {
  return (
    <div className={cn(
      "h-full flex flex-col bg-chat-light border-l border-chat-border",
      className
    )}>
      <div className="p-4 border-b border-chat-border">
        <h2 className="text-lg font-medium flex items-center gap-2">
          <Info size={18} className="text-blue-400" />
          {artifactTitle}
        </h2>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4">
        {typeof artifactContent === 'string' ? (
          <p className="text-sm text-gray-300">{artifactContent}</p>
        ) : (
          artifactContent
        )}
      </div>
      
      <div className="p-3 border-t border-chat-border">
        <div className="flex items-center justify-center gap-1 text-xs text-gray-500">
          <AlertTriangle size={12} />
          <span>Information panel</span>
        </div>
      </div>
    </div>
  );
};

export default ArtifactPanel;
