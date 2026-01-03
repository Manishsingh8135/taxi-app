import { Controller, Get, Post, Body, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PaymentsService } from './payments.service';

@ApiTags('Payments')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller()
export class PaymentsController {
  constructor(private paymentsService: PaymentsService) {}

  @Get('wallet')
  @ApiOperation({ summary: 'Get wallet balance' })
  async getWallet(@Request() req: { user: { id: string } }) {
    return this.paymentsService.getWallet(req.user.id);
  }

  @Get('wallet/transactions')
  @ApiOperation({ summary: 'Get wallet transactions' })
  async getTransactions(@Request() req: { user: { id: string } }) {
    return this.paymentsService.getTransactions(req.user.id);
  }

  @Post('wallet/topup')
  @ApiOperation({ summary: 'Top up wallet' })
  async topUpWallet(
    @Request() req: { user: { id: string } },
    @Body() body: { amount: number },
  ) {
    return this.paymentsService.topUpWallet(req.user.id, body.amount);
  }
}
