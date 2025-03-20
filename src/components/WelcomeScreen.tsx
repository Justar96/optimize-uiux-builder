
import { FC } from "react";
import ChatInput from "./ChatInput";

interface WelcomeScreenProps {
  onSendMessage: (message: string) => void;
}

const WelcomeScreen: FC<WelcomeScreenProps> = ({ onSendMessage }) => {
  return (
    <div className="h-full flex flex-col items-center justify-center py-12">
      <h1 className="text-3xl sm:text-4xl font-medium text-white mb-8 sm:mb-12 animate-fade-in">
        What can I help with?
      </h1>
      
      <div className="w-full max-w-md mx-auto px-4 sm:px-0">
        <ChatInput 
          onSendMessage={onSendMessage} 
          className="animate-fade-in"
        />
      </div>
    </div>
  );
};

export default WelcomeScreen;
