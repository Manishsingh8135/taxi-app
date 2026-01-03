import { Controller, Get, Post, Patch, Body, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { DriversService } from './drivers.service';
import { UpdateDriverDto } from './dto/update-driver.dto';
import { UpdateLocationDto } from './dto/update-location.dto';

@ApiTags('Drivers')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('driver')
export class DriversController {
  constructor(private driversService: DriversService) {}

  @Get('me')
  @ApiOperation({ summary: 'Get current driver profile' })
  async getProfile(@Request() req: { user: { id: string } }) {
    return this.driversService.getProfile(req.user.id);
  }

  @Patch('me')
  @ApiOperation({ summary: 'Update driver profile' })
  async updateProfile(
    @Request() req: { user: { id: string } },
    @Body() dto: UpdateDriverDto,
  ) {
    return this.driversService.updateProfile(req.user.id, dto);
  }

  @Post('status/online')
  @ApiOperation({ summary: 'Go online' })
  async goOnline(
    @Request() req: { user: { id: string } },
    @Body() dto: UpdateLocationDto,
  ) {
    return this.driversService.goOnline(req.user.id, dto);
  }

  @Post('status/offline')
  @ApiOperation({ summary: 'Go offline' })
  async goOffline(@Request() req: { user: { id: string } }) {
    return this.driversService.goOffline(req.user.id);
  }

  @Post('location')
  @ApiOperation({ summary: 'Update location' })
  async updateLocation(
    @Request() req: { user: { id: string } },
    @Body() dto: UpdateLocationDto,
  ) {
    return this.driversService.updateLocation(req.user.id, dto);
  }

  @Get('earnings')
  @ApiOperation({ summary: 'Get earnings' })
  async getEarnings(@Request() req: { user: { id: string } }) {
    return this.driversService.getEarnings(req.user.id);
  }
}
