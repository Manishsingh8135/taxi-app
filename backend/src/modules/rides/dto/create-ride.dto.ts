import { IsString, IsNumber, IsOptional, IsEnum, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

enum VehicleType {
  MINI = 'MINI',
  SEDAN = 'SEDAN',
  XL = 'XL',
  PREMIUM = 'PREMIUM',
  AUTO = 'AUTO',
  BIKE = 'BIKE',
}

enum PaymentType {
  CASH = 'CASH',
  CARD = 'CARD',
  WALLET = 'WALLET',
  UPI = 'UPI',
}

class LocationDto {
  @ApiProperty()
  @IsString()
  address!: string;

  @ApiProperty()
  @IsNumber()
  latitude!: number;

  @ApiProperty()
  @IsNumber()
  longitude!: number;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  placeId?: string;
}

export class CreateRideDto {
  @ApiProperty()
  @ValidateNested()
  @Type(() => LocationDto)
  pickup!: LocationDto;

  @ApiProperty()
  @ValidateNested()
  @Type(() => LocationDto)
  drop!: LocationDto;

  @ApiProperty({ enum: VehicleType })
  @IsEnum(VehicleType)
  vehicleType!: VehicleType;

  @ApiProperty({ enum: PaymentType })
  @IsEnum(PaymentType)
  paymentMethod!: PaymentType;

  @ApiProperty()
  @IsNumber()
  estimatedDistance!: number;

  @ApiProperty()
  @IsNumber()
  estimatedDuration!: number;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  promoCode?: string;
}
