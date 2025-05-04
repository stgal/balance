import { IsInt, IsNumber, IsPositive, IsString, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class CompensateBalanceDto {
  @IsInt()
  @Min(1)
  @Type(() => Number)
  userId: number;

  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  amount: number;

  @IsString()
  transactionId: string;

  @IsString()
  reason: string;
} 