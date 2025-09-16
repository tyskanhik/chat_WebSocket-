export class ChatMessage {
  id?: string;
  username: string;
  message: string;
  timestamp: Date;

  constructor(partial: Partial<ChatMessage>) {
    Object.assign(this, partial);
    this.timestamp = new Date();
    this.id = this.generateId();
  }

  private generateId(): string {
    return Math.random().toString(36).substring(2, 11);
  }
}
