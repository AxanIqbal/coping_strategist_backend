import { IsNumber } from 'class-validator';

export class CreateFavDto {
  @IsNumber()
  id: number;
}
