import { IsString, IsNotEmpty, MinLength, MaxLength } from 'class-validator';

export class CreateMessageDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(500)
  message: string;

  constructor(message: string) {
    this.message = message;
  }
}
