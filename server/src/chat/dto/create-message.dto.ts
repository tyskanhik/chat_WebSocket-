export class CreateMessageDto {
  readonly message: string;

  constructor(message: string) {
    this.message = message;
  }
}
