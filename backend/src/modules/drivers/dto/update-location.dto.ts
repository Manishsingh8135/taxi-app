import { IsNumber, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateLocationDto {
  @ApiProperty()
  @IsNumber()
  latitude!: number;

  @ApiProperty()
  @IsNumber()
  longitude!: number;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  heading?: number;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  speed?: number;
}
