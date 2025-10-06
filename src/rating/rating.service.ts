import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRatingDto, UpdateRatingDto } from './dto';

@Injectable()
export class RatingService {
  constructor(private prisma: PrismaService) {}

  async submitRating(storeId: string, userId: string, dto: CreateRatingDto) {
    const store = await this.prisma.store.findUnique({
      where: { id: storeId },
    });

    if (!store) {
      throw new NotFoundException('Store not found');
    }

    if (store.ownerId === userId) {
      throw new ForbiddenException('Store owners cannot rate their own stores');
    }

    return this.prisma.rating.upsert({
      where: {
        userId_storeId: {
          userId,
          storeId,
        },
      },
      update: {
        value: dto.value,
      },
      create: {
        value: dto.value,
        userId,
        storeId,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        store: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  }

  async updateRating(storeId: string, userId: string, dto: UpdateRatingDto) {
    const rating = await this.prisma.rating.findUnique({
      where: {
        userId_storeId: {
          userId,
          storeId,
        },
      },
    });

    if (!rating) {
      throw new NotFoundException('Rating not found');
    }

    return this.prisma.rating.update({
      where: {
        userId_storeId: {
          userId,
          storeId,
        },
      },
      data: {
        value: dto.value,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        store: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  }

  async getUserRating(storeId: string, userId: string) {
    return this.prisma.rating.findUnique({
      where: {
        userId_storeId: {
          userId,
          storeId,
        },
      },
      include: {
        store: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  }

  async getRatingsCount() {
    return this.prisma.rating.count();
  }

  async getStoreRatings(storeId: string) {
    return this.prisma.rating.findMany({
      where: { storeId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }
}
