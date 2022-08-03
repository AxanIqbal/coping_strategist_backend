import { IsNumber } from 'class-validator';

export class VerifyDto {
  @IsNumber()
  id: number;
}
