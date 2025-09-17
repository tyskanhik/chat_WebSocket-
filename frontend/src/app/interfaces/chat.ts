export interface ChatMessage {
  id?: string;
  username: string;
  message: string;
  timestamp: Date;
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

export interface ChatState {
  messages: ChatMessage[];
  activeUsers: string[];
  currentUser: string | null;
  isConnected: boolean;
  error: string | null;
}