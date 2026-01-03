import { IsString, IsPhoneNumber, IsIn } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SendOtpDto {
  @ApiProperty({ example: '+919876543210' })
  @IsString()
  @IsPhoneNumber()
  phone!: string;

  @ApiProperty({ example: 'user', enum: ['user', 'driver'] })
  @IsString()
  @IsIn(['user', 'driver'])
  type!: 'user' | 'driver';
}
