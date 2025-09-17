import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketServer,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { SetUsernameDto } from './dto/set-username.dto';

@WebSocketGateway({
  cors: {
    origin: 'http://localhost:4200',
    methods: ['GET', 'POST'],
    credentials: true,
  },
  allowEIO3: true,
})
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;
  private logger = new Logger(ChatGateway.name);

  constructor(private readonly chatService: ChatService) {}

  afterInit() {
    this.logger.log('WebSocket Server Initialized');
  }

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
    client.emit('connected', { id: client.id });
    client.emit('messageHistory', this.chatService.getMessageHistory());
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
    const user = this.chatService.removeUser(client.id);
    if (user) {
      this.server.emit('userLeft', {
        username: user.username,
        message: `${user.username} покинул чат`,
        timestamp: new Date(),
      });
      this.server.emit('activeUsers', this.chatService.getActiveUsers());
    }
  }

  @SubscribeMessage('setUsername')
  handleSetUsername(
    @ConnectedSocket() client: Socket,
    @MessageBody() dto: SetUsernameDto,
  ) {
    this.logger.log(`setUsername received from ${client.id}: ${dto.username}`);

    const result = this.chatService.setUsername(client.id, dto.username);
    this.logger.log(
      `setUsername result for ${dto.username}: ${JSON.stringify(result)}`,
    );

    if (result.success) {
      this.server.emit('userJoined', {
        username: result.username,
        message: `${result.username} присоединился к чату`,
        timestamp: new Date(),
      });
      this.server.emit('activeUsers', this.chatService.getActiveUsers());

      // Отправляем ответ клиенту
      client.emit('usernameSet', result);
    } else {
      // Отправляем ошибку клиенту
      client.emit('usernameSet', result);
    }

    return result;
  }

  @SubscribeMessage('sendMessage')
  handleMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() dto: CreateMessageDto,
  ) {
    this.logger.log(`sendMessage from ${client.id}: ${dto.message}`);

    const user = this.chatService.getUserByClientId(client.id);

    if (!user) {
      const errorResponse = {
        success: false,
        message: 'Сначала установите имя пользователя',
      };
      client.emit('messageSent', errorResponse);
      return errorResponse;
    }

    const result = this.chatService.createMessage(user.username, dto.message);

    if (result.success) {
      this.server.emit('newMessage', result.data);
      client.emit('messageSent', { success: true });
    } else {
      client.emit('messageSent', result);
    }

    return result;
  }

  @SubscribeMessage('getActiveUsers')
  handleGetActiveUsers(@ConnectedSocket() client: Socket) {
    this.logger.log(`getActiveUsers from ${client.id}`);
    const users = this.chatService.getActiveUsers();
    client.emit('activeUsersResponse', { users });
    return { users };
  }
}
