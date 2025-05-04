import { IsInt, IsNumber, IsPositive, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class DeductBalanceDto {
  @IsInt()
  @Min(1)
  @Type(() => Number)
  userId: number;

  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  amount: number;
} 