import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class OtpService {
  private logger = new Logger('OtpService');

  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
  ) {}

  async generateOtp(phone: string, type: string) {
    const otp = this.generateRandomOtp();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    const otpRecord = await this.prisma.otp.create({
      data: {
        phone,
        otp,
        type,
        expiresAt,
      },
    });

    if (this.configService.get('NODE_ENV') === 'development') {
      this.logger.log(`OTP for ${phone}: ${otp}`);
    } else {
      await this.sendOtpViaSms(phone, otp);
    }

    return otpRecord;
  }

  private generateRandomOtp(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  private async sendOtpViaSms(phone: string, otp: string): Promise<void> {
    this.logger.log(`Sending OTP ${otp} to ${phone}`);
  }
}
