import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../../prisma/prisma.service';

interface JwtPayload {
  sub: string;
  type: 'user' | 'driver';
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private prisma: PrismaService,
    configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_SECRET'),
    });
  }

  async validate(payload: JwtPayload) {
    const { sub, type } = payload;

    if (type === 'user') {
      const user = await this.prisma.user.findUnique({
        where: { id: sub },
      });
      if (!user || user.status !== 'ACTIVE') {
        throw new UnauthorizedException();
      }
      return { ...user, type: 'user' };
    } else {
      const driver = await this.prisma.driver.findUnique({
        where: { id: sub },
      });
      if (!driver || driver.status === 'BLOCKED') {
        throw new UnauthorizedException();
      }
      return { ...driver, type: 'driver' };
    }
  }
}
