import { Injectable, OnDestroy, signal } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Subject } from 'rxjs';
import { ChatState, ChatMessage, JoinResponse } from '../interfaces/chat';

@Injectable({
  providedIn: 'root'
})
export class ChatService implements OnDestroy {
  private socket!: Socket;
  private destroy$ = new Subject<void>();
  private stateSubject = new Subject<ChatState>();
  
  public state = signal<ChatState>({
    messages: [],
    activeUsers: [],
    currentUser: null,
    isConnected: false,
    error: null
  });

  public state$ = this.stateSubject.asObservable();

  constructor() {
    this.initializeSocket();
  }

  private updateState(updater: (state: ChatState) => ChatState): void {
    this.state.update(updater);
    this.stateSubject.next(this.state());
  }

  private initializeSocket(): void {
    console.log('Initializing socket connection...');
    
    this.socket = io('http://localhost:3000', {
      transports: ['websocket'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    this.setupSocketListeners();
  }

  private setupSocketListeners(): void {
    // Обработчики событий подключения
    this.socket.on('connect', () => this.handleConnect());
    this.socket.on('disconnect', (reason) => this.handleDisconnect(reason));
    this.socket.on('connect_error', (error) => this.handleConnectError(error));
    this.socket.on('connected', (data: { id: string }) => this.handleConnected(data));

    // Обработчики событий чата
    this.socket.on('usernameSet', (response: JoinResponse) => this.handleUsernameSet(response));
    this.socket.on('messageHistory', (messages: ChatMessage[]) => this.handleMessageHistory(messages));
    this.socket.on('newMessage', (message: ChatMessage) => this.handleNewMessage(message));
    this.socket.on('userJoined', (data: { username: string, message: string, timestamp: Date }) => 
      this.handleUserJoined(data));
    this.socket.on('userLeft', (data: { username: string, message: string, timestamp: Date }) => 
      this.handleUserLeft(data));
    this.socket.on('activeUsers', (users: string[]) => this.handleActiveUsers(users));
    this.socket.on('error', (error: { message: string }) => this.handleError(error));
  }

  private handleConnect(): void {
    console.log('Connected to server with ID:', this.socket.id);
    this.updateState(state => ({
      ...state,
      isConnected: true,
      error: null
    }));
  }

  private handleDisconnect(reason: string): void {
    console.log('Disconnected from server:', reason);
    this.updateState(state => ({
      ...state,
      isConnected: false
    }));
  }

  private handleConnectError(error: any): void {
    console.error('Connection error:', error);
    this.updateState(state => ({
      ...state,
      isConnected: false,
      error: 'Ошибка подключения к серверу'
    }));
  }

  private handleConnected(data: { id: string }): void {
    console.log('Server acknowledged connection:', data.id);
  }

  private handleUsernameSet(response: JoinResponse): void {
    console.log('Username set response:', response);
    
    if (response.success) {
      this.updateState(state => ({
        ...state,
        currentUser: response.username!,
        error: null
      }));
      console.log('Username successfully set to:', response.username);
    } else {
      this.updateState(state => ({
        ...state,
        error: response.message || 'Ошибка установки имени'
      }));
      console.error('Failed to set username:', response.message);
    }
  }

  private handleMessageHistory(messages: ChatMessage[]): void {
    console.log('Received message history:', messages.length, 'messages');
    this.updateState(state => ({
      ...state,
      messages: messages
    }));
  }

  private handleNewMessage(message: ChatMessage): void {
    console.log('New message received:', message);
    this.updateState(state => ({
      ...state,
      messages: [...state.messages, message]
    }));
  }

  private handleUserJoined(data: { username: string, message: string, timestamp: Date }): void {
    console.log('User joined:', data.username);
    this.updateState(state => ({
      ...state,
      messages: [...state.messages, {
        id: Date.now().toString(),
        username: 'System',
        message: data.message,
        timestamp: new Date(data.timestamp)
      }]
    }));
  }

  private handleUserLeft(data: { username: string, message: string, timestamp: Date }): void {
    console.log('User left:', data.username);
    this.updateState(state => ({
      ...state,
      messages: [...state.messages, {
        id: Date.now().toString(),
        username: 'System',
        message: data.message,
        timestamp: new Date(data.timestamp)
      }]
    }));
  }

  private handleActiveUsers(users: string[]): void {
    console.log('Active users updated:', users);
    this.updateState(state => ({
      ...state,
      activeUsers: users
    }));
  }

  private handleError(error: { message: string }): void {
    console.error('Server error:', error);
    this.updateState(state => ({
      ...state,
      error: error.message
    }));
  }

  setUsername(username: string): void {
    if (!username.trim()) {
      console.warn('Attempted to set empty username');
      return;
    }

    console.log('Emitting setUsername event with:', username);
    this.socket.emit('setUsername', { username });
  }

  sendMessage(message: string): void {
    if (!message.trim()) {
      console.warn('Attempted to send empty message');
      return;
    }

    if (!this.state().currentUser) {
      console.warn('Cannot send message without username');
      this.updateState(state => ({
        ...state,
        error: 'Сначала установите имя пользователя'
      }));
      return;
    }

    console.log('Sending message:', message);
    this.socket.emit('sendMessage', { message });
  }

  getActiveUsers(): void {
    console.log('Requesting active users...');
    this.socket.emit('getActiveUsers');
  }

  clearError(): void {
    this.updateState(state => ({
      ...state,
      error: null
    }));
  }

  disconnect(): void {
    if (this.socket) {
      console.log('Disconnecting socket...');
      this.socket.disconnect();
    }
  }

  reconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket.connect();
    }
  }

  ngOnDestroy(): void {
    console.log('ChatService destroyed - cleaning up');
    this.destroy$.next();
    this.destroy$.complete();
    
    if (this.socket) {
      this.socket.removeAllListeners();
      this.socket.disconnect();
    }
    
    this.stateSubject.complete();
  }
}