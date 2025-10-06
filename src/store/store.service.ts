import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateStoreDto, UpdateStoreDto, FilterStoreDto } from './dto';
import { UserRole } from '@prisma/client';

@Injectable()
export class StoreService {
  constructor(private prisma: PrismaService) {}

  async createStore(dto: CreateStoreDto) {
    return this.prisma.store.create({
      data: dto,
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        ratings: {
          select: {
            value: true,
          },
        },
      },
    });
  }

  async getStores(filter: FilterStoreDto, userId?: string, _userRole?: UserRole) {
    const where: any = {};

    if (filter.name) {
      where.name = { contains: filter.name, mode: 'insensitive' };
    }
    if (filter.email) {
      where.email = { contains: filter.email, mode: 'insensitive' };
    }
    if (filter.address) {
      where.address = { contains: filter.address, mode: 'insensitive' };
    }

    const orderBy: any = {};
    if (filter.sortBy) {
      orderBy[filter.sortBy] = filter.sortOrder || 'asc';
    }

    const stores = await this.prisma.store.findMany({
      where,
      orderBy,
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        ratings: {
          select: {
            value: true,
            userId: true,
          },
        },
      },
    });

    return stores.map((store) => {
      const totalRatings = store.ratings.length;
      const averageRating =
        totalRatings > 0
          ? store.ratings.reduce((sum, rating) => sum + rating.value, 0) /
            totalRatings
          : 0;

      const userRating = userId
        ? store.ratings.find((rating) => rating.userId === userId)?.value ||
          null
        : null;

      return {
        id: store.id,
        name: store.name,
        email: store.email,
        address: store.address,
        owner: store.owner,
        averageRating: Math.round(averageRating * 10) / 10,
        totalRatings,
        userRating,
        createdAt: store.createdAt,
      };
    });
  }

  async getStoreById(id: string) {
    const store = await this.prisma.store.findUnique({
      where: { id },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        ratings: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
    });

    if (!store) {
      throw new NotFoundException('Store not found');
    }

    const totalRatings = store.ratings.length;
    const averageRating =
      totalRatings > 0
        ? store.ratings.reduce((sum, rating) => sum + rating.value, 0) /
          totalRatings
        : 0;

    return {
      ...store,
      averageRating: Math.round(averageRating * 10) / 10,
      totalRatings,
    };
  }

  async updateStore(
    id: string,
    dto: UpdateStoreDto,
    userId: string,
    userRole: UserRole,
  ) {
    const store = await this.prisma.store.findUnique({
      where: { id },
    });

    if (!store) {
      throw new NotFoundException('Store not found');
    }

    if (userRole !== UserRole.ADMIN && store.ownerId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    return this.prisma.store.update({
      where: { id },
      data: dto,
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  }

  async getStoresCount() {
    return this.prisma.store.count();
  }

  async getStoresByOwner(ownerId: string) {
    return this.prisma.store.findMany({
      where: { ownerId },
      include: {
        ratings: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
    });
  }

  async getOwnerDashboard(ownerId: string) {
    const stores = await this.prisma.store.findMany({
      where: { ownerId },
      include: {
        ratings: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                address: true,
              },
            },
          },
        },
      },
    });

    return stores.map((store) => {
      const totalRatings = store.ratings.length;
      const averageRating =
        totalRatings > 0
          ? store.ratings.reduce((sum, rating) => sum + rating.value, 0) /
            totalRatings
          : 0;

      const usersWhoRated = store.ratings.map((rating) => ({
        ...rating.user,
        rating: rating.value,
        ratedAt: rating.createdAt,
      }));

      return {
        id: store.id,
        name: store.name,
        email: store.email,
        address: store.address,
        averageRating: Math.round(averageRating * 10) / 10,
        totalRatings,
        usersWhoRated,
      };
    });
  }
}
