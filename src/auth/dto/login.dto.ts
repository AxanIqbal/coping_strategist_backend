import { IsNotEmpty, MinLength } from 'class-validator';

export class LoginPayload {
  @IsNotEmpty()
  @MinLength(3)
  username: string;

  @IsNotEmpty()
  @MinLength(6)
  password: string;
}
