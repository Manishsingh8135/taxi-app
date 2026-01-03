import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { DriversModule } from './modules/drivers/drivers.module';
import { RidesModule } from './modules/rides/rides.module';
import { PaymentsModule } from './modules/payments/payments.module';
import { SocketModule } from './socket/socket.module';
import { RedisModule } from './redis/redis.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    PrismaModule,
    RedisModule,
    SocketModule,
    AuthModule,
    UsersModule,
    DriversModule,
    RidesModule,
    PaymentsModule,
  ],
})
export class AppModule {}
