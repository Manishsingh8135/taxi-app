import { Controller, Get, Post, Patch, Body, Param, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RidesService } from './rides.service';
import { CreateRideDto } from './dto/create-ride.dto';
import { FareEstimateDto } from './dto/fare-estimate.dto';

@ApiTags('Rides')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('rides')
export class RidesController {
  constructor(private ridesService: RidesService) {}

  @Post('estimate')
  @ApiOperation({ summary: 'Get fare estimate' })
  async getFareEstimate(@Body() dto: FareEstimateDto) {
    return this.ridesService.getFareEstimate(dto);
  }

  @Post()
  @ApiOperation({ summary: 'Book a ride' })
  async createRide(
    @Request() req: { user: { id: string } },
    @Body() dto: CreateRideDto,
  ) {
    return this.ridesService.createRide(req.user.id, dto);
  }

  @Get('active')
  @ApiOperation({ summary: 'Get active ride' })
  async getActiveRide(@Request() req: { user: { id: string } }) {
    return this.ridesService.getActiveRide(req.user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get ride by ID' })
  async getRide(@Param('id') id: string) {
    return this.ridesService.getRide(id);
  }

  @Patch(':id/cancel')
  @ApiOperation({ summary: 'Cancel ride' })
  async cancelRide(
    @Request() req: { user: { id: string } },
    @Param('id') id: string,
    @Body() body: { reason?: string },
  ) {
    return this.ridesService.cancelRide(id, req.user.id, 'USER', body.reason);
  }

  @Post(':id/rate')
  @ApiOperation({ summary: 'Rate completed ride' })
  async rateRide(
    @Request() req: { user: { id: string } },
    @Param('id') id: string,
    @Body() body: { rating: number; comment?: string; tags?: string[] },
  ) {
    return this.ridesService.rateRide(id, req.user.id, 'USER', body);
  }

  @Get('history')
  @ApiOperation({ summary: 'Get ride history' })
  async getRideHistory(@Request() req: { user: { id: string } }) {
    return this.ridesService.getRideHistory(req.user.id);
  }
}
