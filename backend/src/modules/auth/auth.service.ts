import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../prisma/prisma.service';
import { OtpService } from './otp.service';
import { SendOtpDto } from './dto/send-otp.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
    private otpService: OtpService,
  ) {}

  async sendOtp(dto: SendOtpDto) {
    const { phone, type } = dto;

    const existingUser =
      type === 'user'
        ? await this.prisma.user.findUnique({ where: { phone } })
        : await this.prisma.driver.findUnique({ where: { phone } });

    const otp = await this.otpService.generateOtp(phone, type);

    return {
      success: true,
      message: 'OTP sent successfully',
      data: {
        otpId: otp.id,
        expiresIn: 300,
        isNewUser: !existingUser,
      },
    };
  }

  async verifyOtp(dto: VerifyOtpDto) {
    const { otpId, otp, deviceToken, deviceType } = dto;

    const otpRecord = await this.prisma.otp.findUnique({
      where: { id: otpId },
    });

    if (!otpRecord) {
      throw new BadRequestException('Invalid OTP');
    }

    if (otpRecord.verified) {
      throw new BadRequestException('OTP already used');
    }

    if (new Date() > otpRecord.expiresAt) {
      throw new BadRequestException('OTP expired');
    }

    if (otpRecord.attempts >= 3) {
      throw new BadRequestException('Too many attempts');
    }

    // Test OTP: 123456 always works for development
    const isTestOtp = otp === '123456';
    
    if (!isTestOtp && otpRecord.otp !== otp) {
      await this.prisma.otp.update({
        where: { id: otpId },
        data: { attempts: { increment: 1 } },
      });
      throw new BadRequestException('Invalid OTP');
    }

    await this.prisma.otp.update({
      where: { id: otpId },
      data: { verified: true },
    });

    const isUserType = otpRecord.type === 'user';
    let user;
    let isNewUser = false;

    if (isUserType) {
      user = await this.prisma.user.findUnique({
        where: { phone: otpRecord.phone },
      });

      if (!user) {
        isNewUser = true;
        user = await this.prisma.user.create({
          data: {
            phone: otpRecord.phone,
            firstName: 'User',
            isPhoneVerified: true,
            referralCode: this.generateReferralCode(),
            deviceToken,
          },
        });

        await this.prisma.wallet.create({
          data: { userId: user.id },
        });
      } else {
        await this.prisma.user.update({
          where: { id: user.id },
          data: { deviceToken, lastActiveAt: new Date() },
        });
      }
    } else {
      user = await this.prisma.driver.findUnique({
        where: { phone: otpRecord.phone },
      });

      if (!user) {
        throw new BadRequestException('Driver not registered. Please sign up first.');
      }

      await this.prisma.driver.update({
        where: { id: user.id },
        data: { deviceToken },
      });
    }

    const tokens = await this.generateTokens(user.id, isUserType ? 'user' : 'driver');

    return {
      success: true,
      data: {
        ...tokens,
        [isUserType ? 'user' : 'driver']: user,
        isNewUser,
      },
    };
  }

  async refreshToken(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: this.configService.get('JWT_REFRESH_SECRET'),
      });

      const tokens = await this.generateTokens(payload.sub, payload.type);

      return {
        success: true,
        data: tokens,
      };
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  private async generateTokens(userId: string, type: 'user' | 'driver') {
    const payload = { sub: userId, type };

    const accessToken = this.jwtService.sign(payload);

    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_REFRESH_SECRET'),
      expiresIn: this.configService.get('JWT_REFRESH_EXPIRES_IN') || '7d',
    });

    return { accessToken, refreshToken };
  }

  private generateReferralCode(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 8; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  }
}
