
import { ChatMessage, ToolCall } from "@/services/openai";

export type Message = {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
  toolCalls?: ToolCall[];
};

export type ChatSession = {
  id: string;
  title: string;
  messages: Message[];
  chatMessages: ChatMessage[];
  createdAt: Date;
  updatedAt: Date;
};
