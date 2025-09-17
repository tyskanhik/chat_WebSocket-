import { Component, inject, signal, OnInit, OnDestroy, computed, DestroyRef, ViewChild, ElementRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ChatService } from '../../service/chatService.service';
import { ChatMessage } from '../../interfaces/chat';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chat-component.html',
  styleUrl: './chat-component.scss'
})
export class ChatComponent implements OnInit, OnDestroy {
  protected chatService = inject(ChatService);
  private destroyRef = inject(DestroyRef);
  
  @ViewChild('messagesContainer') messagesContainerRef!: ElementRef<HTMLDivElement>;
  
  username = signal('');
  message = signal('');

  currentUser = computed(() => this.chatService.state().currentUser);
  isConnected = computed(() => this.chatService.state().isConnected);
  messages = computed(() => this.chatService.state().messages);
  activeUsers = computed(() => this.chatService.state().activeUsers);
  error = computed(() => this.chatService.state().error);

  ngOnInit(): void {
    console.log('ChatComponent initialized');

    this.chatService.state$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(state => {
        if (state.messages.length > 0) {
          setTimeout(() => this.scrollToBottom(), 100);
        }
      });
  }

  ngAfterViewInit(): void {
    setTimeout(() => this.scrollToBottom(), 200);
  }

  ngOnDestroy(): void {
    console.log('ChatComponent destroyed');
  }

  setUsername(): void {
    const username = this.username().trim();
    if (username) {
      this.chatService.setUsername(username);
      this.username.set('');
    }
  }

  sendMessage(): void {
    const message = this.message().trim();
    if (message) {
      this.chatService.sendMessage(message);
      this.message.set('');
    }
  }

  logout(): void {
    this.chatService.disconnect();
    this.chatService.reconnect();
  }

  formatTimestamp(timestamp: Date | string): string {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('ru-RU', {
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  trackByMessage(index: number, message: ChatMessage): string {
    return message.id || `${message.username}-${message.timestamp}-${index}`;
  }

  trackByUser(index: number, user: string): string {
    return user;
  }

  reconnect(): void {
    this.chatService.reconnect();
  }

  clearError(): void {
    this.chatService.clearError();
  }

  private scrollToBottom(): void {
    if (this.messagesContainerRef?.nativeElement) {
      const container = this.messagesContainerRef.nativeElement;
      container.scrollTop = container.scrollHeight;
    }
  }
}