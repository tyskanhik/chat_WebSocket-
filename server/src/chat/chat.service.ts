import { Injectable } from '@nestjs/common';
import { ChatMessage } from './entities/message.entity';
import {
  ActiveUser,
  JoinResponse,
  MessageResponse,
} from './interfaces/chat-state.interface';

@Injectable()
export class ChatService {
  private activeUsers = new Map<string, ActiveUser>();
  private messages: ChatMessage[] = [];

  setUsername(clientId: string, username: string): JoinResponse {
    const trimmedUsername = username.trim();

    if (!trimmedUsername) {
      return { success: false, message: 'Имя не может быть пустым' };
    }

    const activeUser: ActiveUser = {
      clientId,
      username: trimmedUsername,
      joinedAt: new Date(),
    };

    this.activeUsers.set(clientId, activeUser);
    return { success: true, username: trimmedUsername };
  }

  removeUser(clientId: string): ActiveUser | null {
    const user = this.activeUsers.get(clientId);
    if (user) {
      this.activeUsers.delete(clientId);
      return user;
    }
    return null;
  }

  getActiveUsers(): string[] {
    return Array.from(this.activeUsers.values()).map((user) => user.username);
  }

  getUserByClientId(clientId: string): ActiveUser | undefined {
    return this.activeUsers.get(clientId);
  }

  createMessage(username: string, message: string): MessageResponse {
    const trimmedMessage = message.trim();

    if (!trimmedMessage) {
      return { success: false, message: 'Сообщение не может быть пустым' };
    }

    const chatMessage = new ChatMessage({
      username,
      message: trimmedMessage,
    });

    this.messages.push(chatMessage);

    return { success: true, data: chatMessage };
  }

  getMessageHistory(): ChatMessage[] {
    return [...this.messages];
  }
}
