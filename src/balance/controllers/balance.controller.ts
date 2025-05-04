import { Body, Controller, Get, HttpException, HttpStatus, Param, Post } from '@nestjs/common';
import { BalanceService } from '../services/balance.service';
import { DeductBalanceDto } from '../dto/deduct-balance.dto';
import { CompensateBalanceDto } from '../dto/compensate-balance.dto';

@Controller('balance')
export class BalanceController {
  constructor(private readonly balanceService: BalanceService) {}

  @Post('deduct')
  async deductBalance(@Body() deductBalanceDto: DeductBalanceDto) {
    try {
      const { userId, amount } = deductBalanceDto;
      const success = await this.balanceService.deductBalance(userId, amount);
      
      if (!success) {
        throw new HttpException(
          'Not enough balance',
          HttpStatus.BAD_REQUEST,
        );
      }
      
      const newBalance = await this.balanceService.getBalance(userId);
      return {
        success: true,
        userId,
        deducted: amount,
        balance: newBalance,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        error.message || 'Error when deducting balance',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
} 