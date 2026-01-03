import { IsString, IsOptional, IsIn, Length } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class VerifyOtpDto {
  @ApiProperty({ example: 'uuid' })
  @IsString()
  otpId!: string;

  @ApiProperty({ example: '123456' })
  @IsString()
  @Length(6, 6)
  otp!: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  deviceToken?: string;

  @ApiPropertyOptional({ enum: ['ios', 'android'] })
  @IsString()
  @IsOptional()
  @IsIn(['ios', 'android'])
  deviceType?: 'ios' | 'android';
}
