
import { toast } from "sonner";

export interface ChatMessage {
  role: "user" | "assistant" | "system" | "tool";
  content: string;
  tool_call_id?: string;
}

export interface ChatTool {
  type: "function";
  function: {
    name: string;
    description: string;
    parameters: Record<string, any>;
    strict?: boolean;
  };
}

export interface ToolCall {
  id: string;
  type: "function";
  function: {
    name: string;
    arguments: string;
  };
}

// Define available tools
export const chatTools: ChatTool[] = [
  {
    type: "function",
    function: {
      name: "get_weather",
      description: "Get current weather for a given location",
      parameters: {
        type: "object",
        properties: {
          location: {
            type: "string",
            description: "City and country, e.g., 'Paris, France'",
          },
        },
        required: ["location"],
        additionalProperties: false,
      },
      strict: true,
    },
  },
  {
    type: "function",
    function: {
      name: "search_knowledge_base",
      description: "Search for information in the knowledge base",
      parameters: {
        type: "object",
        properties: {
          query: {
            type: "string",
            description: "The search query",
          },
        },
        required: ["query"],
        additionalProperties: false,
      },
      strict: true,
    },
  },
];

// Function to call OpenAI API
export const callOpenAI = async (messages: ChatMessage[], onUpdate?: (content: string) => void) => {
  try {
    // This is a placeholder for the actual API call
    // In a real implementation, you would call the OpenAI API with your API key
    // For now, we'll simulate the response
    
    const lastMessage = messages[messages.length - 1];
    
    // Simulate thinking time
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Simulate function calling based on user message
    if (lastMessage.role === "user") {
      const content = lastMessage.content.toLowerCase();
      
      if (content.includes("weather") || content.includes("temperature")) {
        // Return a tool call for get_weather
        const location = content.includes("paris") ? "Paris, France" : 
                        content.includes("london") ? "London, UK" : 
                        content.includes("new york") ? "New York, USA" : 
                        "the requested location";
        
        return {
          type: "tool_calls",
          tool_calls: [{
            id: "call_" + Date.now(),
            type: "function" as const, // Explicitly type as literal "function"
            function: {
              name: "get_weather",
              arguments: JSON.stringify({ location })
            }
          }]
        };
      }
      
      if (content.includes("search") || content.includes("find") || content.includes("information")) {
        // Extract query from the user message
        const queryMatch = content.match(/(?:search|find|information about|look up)\s+(.+?)(?:\?|$)/i);
        const query = queryMatch ? queryMatch[1].trim() : "the requested topic";
        
        return {
          type: "tool_calls",
          tool_calls: [{
            id: "call_" + Date.now(),
            type: "function" as const, // Explicitly type as literal "function"
            function: {
              name: "search_knowledge_base",
              arguments: JSON.stringify({ query })
            }
          }]
        };
      }
    }
    
    // Default response if no function call is needed
    return {
      type: "content",
      content: "I'm an AI assistant designed to provide helpful, accurate, and ethical responses. How can I assist you today?"
    };
    
  } catch (error) {
    console.error("Error calling OpenAI API:", error);
    toast.error("Failed to get AI response. Please try again.");
    throw error;
  }
};

// Execute the actual functions that the AI calls
export const executeFunction = async (name: string, args: any): Promise<string> => {
  try {
    switch (name) {
      case "get_weather":
        return await getWeather(args.location);
      case "search_knowledge_base":
        return await searchKnowledgeBase(args.query);
      default:
        return `Function ${name} is not implemented`;
    }
  } catch (error) {
    console.error(`Error executing function ${name}:`, error);
    return `Error executing function ${name}: ${error instanceof Error ? error.message : String(error)}`;
  }
};

// Mock implementation of getWeather function
const getWeather = async (location: string): Promise<string> => {
  // In a real implementation, this would call a weather API
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const temperatures: Record<string, number> = {
    "Paris, France": 22,
    "London, UK": 18,
    "New York, USA": 25,
    "Tokyo, Japan": 28,
  };
  
  const temp = temperatures[location] || Math.floor(Math.random() * 30) + 5;
  return JSON.stringify({
    location,
    temperature: temp,
    unit: "celsius",
    condition: ["sunny", "cloudy", "rainy", "partly cloudy"][Math.floor(Math.random() * 4)]
  });
};

// Mock implementation of searchKnowledgeBase function
const searchKnowledgeBase = async (query: string): Promise<string> => {
  // In a real implementation, this would search an actual database or knowledge base
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  return JSON.stringify({
    results: [
      {
        title: `Information about ${query}`,
        snippet: `This is a simulated search result about "${query}". In a real implementation, this would contain actual information from a knowledge base.`,
        url: `https://example.com/search?q=${encodeURIComponent(query)}`
      },
      {
        title: `More details on ${query}`,
        snippet: `Additional information about "${query}" would be provided here in a real implementation.`,
        url: `https://example.com/details?topic=${encodeURIComponent(query)}`
      }
    ]
  });
};
