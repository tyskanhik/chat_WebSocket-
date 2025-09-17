import {
  IsString,
  IsNotEmpty,
  MinLength,
  MaxLength,
  Matches,
} from 'class-validator';

export class SetUsernameDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(20)
  @Matches(/^[a-zA-Z0-9_]+$/, {
    message: 'Имя может содержать только буквы, цифры и подчеркивания',
  })
  username: string;

  constructor(username: string) {
    this.username = username;
  }
}
