import { IsNumber, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

class LocationDto {
  @ApiProperty()
  @IsNumber()
  latitude!: number;

  @ApiProperty()
  @IsNumber()
  longitude!: number;
}

export class FareEstimateDto {
  @ApiProperty()
  @ValidateNested()
  @Type(() => LocationDto)
  pickup!: LocationDto;

  @ApiProperty()
  @ValidateNested()
  @Type(() => LocationDto)
  drop!: LocationDto;

  @ApiProperty()
  @IsNumber()
  distance!: number;

  @ApiProperty()
  @IsNumber()
  duration!: number;
}
