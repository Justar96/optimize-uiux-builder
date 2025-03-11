
import { useState, useEffect, useRef } from "react";
import ChatHeader from "@/components/ChatHeader";
import ChatInput from "@/components/ChatInput";
import MessageBubble from "@/components/MessageBubble";
import ArtifactPanel from "@/components/ArtifactPanel";
import { AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

type Message = {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
};

type ArtifactContent = {
  title: string;
  content: string | React.ReactNode;
};

const Index = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [showFooterInput, setShowFooterInput] = useState(false);
  const [showArtifact, setShowArtifact] = useState(true);
  const [artifactContent, setArtifactContent] = useState<ArtifactContent>({
    title: "Information",
    content: "No information available at the moment. When you ask for specific data or resources, they will appear here for easy reference."
  });
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);
  
  const handleSendMessage = (content: string) => {
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      isUser: true,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    
    // Show footer input only after first message is sent
    setShowFooterInput(true);
    
    // Check if message contains trigger phrases for artifact panel
    const lowerContent = content.toLowerCase();
    if (lowerContent.includes("show weather") || lowerContent.includes("weather report")) {
      setArtifactContent({
        title: "Weather Information",
        content: <WeatherWidget />
      });
      setShowArtifact(true);
    } else if (lowerContent.includes("show time") || lowerContent.includes("current time")) {
      setArtifactContent({
        title: "Current Time",
        content: <TimeWidget />
      });
      setShowArtifact(true);
    } else if (lowerContent.includes("show calendar") || lowerContent.includes("my calendar")) {
      setArtifactContent({
        title: "Calendar",
        content: <CalendarWidget />
      });
      setShowArtifact(true);
    } else if (lowerContent.includes("hide panel") || lowerContent.includes("close panel")) {
      setShowArtifact(false);
    } else if (lowerContent.includes("show panel") || lowerContent.includes("open panel")) {
      setShowArtifact(true);
    }
    
    // Simulate AI response
    setIsTyping(true);
    
    setTimeout(() => {
      let aiResponse = "I'm an AI assistant designed to provide helpful, accurate, and ethical responses. How can I assist you today?";
      
      // Customize AI response based on artifact panel activation
      if (lowerContent.includes("show weather") || lowerContent.includes("weather report")) {
        aiResponse = "I've opened the weather information panel for you. You can see current weather details there.";
      } else if (lowerContent.includes("show time") || lowerContent.includes("current time")) {
        aiResponse = "I've displayed the current time in the information panel for your reference.";
      } else if (lowerContent.includes("show calendar") || lowerContent.includes("my calendar")) {
        aiResponse = "I've opened the calendar view in the side panel for you to check your schedule.";
      } else if (lowerContent.includes("hide panel") || lowerContent.includes("close panel")) {
        aiResponse = "I've closed the information panel for you.";
      } else if (lowerContent.includes("show panel") || lowerContent.includes("open panel")) {
        aiResponse = "I've opened the information panel for you.";
      }
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: aiResponse,
        isUser: false,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1500);
  };
  
  const toggleArtifactPanel = () => {
    setShowArtifact(prev => !prev);
  };
  
  return (
    <div className="flex h-screen overflow-hidden bg-chat-dark">
      <div className={cn(
        "flex flex-col flex-1 h-full overflow-hidden transition-all duration-300",
        showArtifact ? "w-1/2" : "w-full"
      )}>
        <ChatHeader 
          onToggleArtifact={toggleArtifactPanel}
          showArtifact={showArtifact}
        />
        
        <main className="flex-1 overflow-y-auto px-4 py-6 hide-scrollbar">
          <div className="max-w-3xl mx-auto">
            {messages.length === 0 ? (
              <WelcomeScreen onSendMessage={handleSendMessage} />
            ) : (
              <div className="space-y-6">
                {messages.map((message, index) => (
                  <div 
                    key={message.id}
                    className={cn(
                      "flex",
                      message.isUser ? "justify-end" : "justify-start"
                    )}
                  >
                    <MessageBubble 
                      isUser={message.isUser}
                      animationDelay={index * 100}
                    >
                      {message.content}
                    </MessageBubble>
                  </div>
                ))}
                
                {isTyping && (
                  <div className="flex justify-start">
                    <MessageBubble isLoading>
                      <div className="flex space-x-2">
                        <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                        <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                        <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                    </MessageBubble>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>
        </main>
        
        {showFooterInput && (
          <footer className="p-4 border-t border-chat-border">
            <ChatInput onSendMessage={handleSendMessage} />
            
            <div className="max-w-3xl mx-auto mt-4 text-center text-xs text-gray-500 flex items-center justify-center gap-1">
              <AlertTriangle size={12} />
              <span>ChatGPT can make mistakes. Check important info.</span>
            </div>
          </footer>
        )}
      </div>
      
      {showArtifact && (
        <div className="w-1/2 h-full">
          <ArtifactPanel 
            artifactTitle={artifactContent.title}
            artifactContent={artifactContent.content}
          />
        </div>
      )}
    </div>
  );
};

// Simple widget components for the artifact panel
const WeatherWidget = () => (
  <div className="space-y-4">
    <div className="flex items-center justify-between">
      <div>
        <h3 className="text-xl font-semibold">San Francisco</h3>
        <p className="text-gray-400">Monday, July 10</p>
      </div>
      <div className="text-4xl font-bold">72°F</div>
    </div>
    <div className="flex justify-between items-center p-3 bg-chat-light rounded-lg">
      <div className="text-center">
        <p className="text-xs text-gray-400">Tue</p>
        <p className="text-sm font-medium">70°</p>
      </div>
      <div className="text-center">
        <p className="text-xs text-gray-400">Wed</p>
        <p className="text-sm font-medium">68°</p>
      </div>
      <div className="text-center">
        <p className="text-xs text-gray-400">Thu</p>
        <p className="text-sm font-medium">73°</p>
      </div>
      <div className="text-center">
        <p className="text-xs text-gray-400">Fri</p>
        <p className="text-sm font-medium">75°</p>
      </div>
      <div className="text-center">
        <p className="text-xs text-gray-400">Sat</p>
        <p className="text-sm font-medium">72°</p>
      </div>
    </div>
    <div className="grid grid-cols-2 gap-3">
      <div className="p-3 bg-chat-light rounded-lg">
        <p className="text-xs text-gray-400">Humidity</p>
        <p className="text-lg font-medium">65%</p>
      </div>
      <div className="p-3 bg-chat-light rounded-lg">
        <p className="text-xs text-gray-400">Wind</p>
        <p className="text-lg font-medium">12 mph</p>
      </div>
      <div className="p-3 bg-chat-light rounded-lg">
        <p className="text-xs text-gray-400">Precipitation</p>
        <p className="text-lg font-medium">10%</p>
      </div>
      <div className="p-3 bg-chat-light rounded-lg">
        <p className="text-xs text-gray-400">UV Index</p>
        <p className="text-lg font-medium">3 of 10</p>
      </div>
    </div>
  </div>
);

const TimeWidget = () => {
  const [time, setTime] = useState(new Date());
  
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);
  
  return (
    <div className="flex flex-col items-center justify-center h-40 space-y-4">
      <h3 className="text-xl font-semibold">Current Time</h3>
      <div className="text-4xl font-bold">
        {time.toLocaleTimeString()}
      </div>
      <p className="text-gray-400">
        {time.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
      </p>
    </div>
  );
};

const CalendarWidget = () => {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const today = new Date().getDate();
  
  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold mb-4">July 2023</h3>
      <div className="grid grid-cols-7 gap-2">
        {days.map(day => (
          <div key={day} className="text-center text-xs text-gray-400 font-medium">
            {day}
          </div>
        ))}
        {[...Array(31)].map((_, i) => {
          const day = i + 1;
          return (
            <div key={i} className={`text-center p-2 rounded-full ${day === today ? 'bg-blue-600 text-white' : ''}`}>
              {day}
            </div>
          );
        })}
      </div>
      <div className="mt-4 space-y-2">
        <div className="p-3 bg-chat-light rounded-lg">
          <p className="text-xs text-gray-400">9:00 AM - 10:00 AM</p>
          <p className="text-sm font-medium">Team Meeting</p>
        </div>
        <div className="p-3 bg-chat-light rounded-lg">
          <p className="text-xs text-gray-400">1:00 PM - 2:00 PM</p>
          <p className="text-sm font-medium">Project Review</p>
        </div>
        <div className="p-3 bg-chat-light rounded-lg">
          <p className="text-xs text-gray-400">4:00 PM - 5:00 PM</p>
          <p className="text-sm font-medium">Client Call</p>
        </div>
      </div>
    </div>
  );
};

const WelcomeScreen = ({ 
  onSendMessage
}: { 
  onSendMessage: (message: string) => void
}) => {
  return (
    <div className="h-full flex flex-col items-center justify-center">
      <h1 className="text-4xl font-medium text-white mb-16 animate-fade-in">
        What can I help with?
      </h1>
      
      <div className="w-full">
        <ChatInput 
          onSendMessage={onSendMessage} 
          className="animate-slide-up"
        />
      </div>
    </div>
  );
};

export default Index;
