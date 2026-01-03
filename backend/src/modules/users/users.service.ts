import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async getProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        wallet: true,
        savedPlaces: true,
        paymentMethods: true,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return { success: true, data: user };
  }

  async updateProfile(userId: string, dto: UpdateUserDto) {
    const user = await this.prisma.user.update({
      where: { id: userId },
      data: dto,
    });

    return { success: true, data: user };
  }

  async findById(userId: string) {
    return this.prisma.user.findUnique({ where: { id: userId } });
  }
}
