import { Module } from '@nestjs/common';
import { RidesController } from './rides.controller';
import { RidesService } from './rides.service';
import { DriversModule } from '../drivers/drivers.module';
import { SocketModule } from '../../socket/socket.module';

@Module({
  imports: [DriversModule, SocketModule],
  controllers: [RidesController],
  providers: [RidesService],
  exports: [RidesService],
})
export class RidesModule {}
