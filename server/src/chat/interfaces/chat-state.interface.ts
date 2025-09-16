import { ChatMessage } from '../entities/message.entity';

export interface ActiveUser {
  clientId: string;
  username: string;
  joinedAt: Date;
}

export interface ChatState {
  activeUsers: Map<string, ActiveUser>;
  messages: ChatMessage[];
}

export interface JoinResponse {
  success: boolean;
  message?: string;
  username?: string;
}

export interface MessageResponse {
  success: boolean;
  message?: string;
  data?: ChatMessage;
}
