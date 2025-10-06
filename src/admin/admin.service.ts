import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { StoreService } from '../store/store.service';
import { RatingService } from '../rating/rating.service';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AdminService {
  constructor(
    private userService: UserService,
    private storeService: StoreService,
    private ratingService: RatingService,
    private prisma: PrismaService,
  ) {}

  async getDashboardStats() {
    const [totalUsers, totalStores, totalRatings] = await Promise.all([
      this.userService.getUsersCount(),
      this.storeService.getStoresCount(),
      this.ratingService.getRatingsCount(),
    ]);

    return {
      totalUsers,
      totalStores,
      totalRatings,
    };
  }

  async getStoresWithRatings(filter: any = {}) {
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
            address: true,
            role: true,
          },
        },
        ratings: {
          select: {
            value: true,
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

    return stores.map((store) => {
      const totalRatings = store.ratings.length;
      const averageRating =
        totalRatings > 0
          ? store.ratings.reduce((sum, rating) => sum + rating.value, 0) /
            totalRatings
          : 0;

      return {
        id: store.id,
        name: store.name,
        email: store.email,
        address: store.address,
        owner: store.owner,
        averageRating: Math.round(averageRating * 10) / 10,
        totalRatings,
        createdAt: store.createdAt,
      };
    });
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
            address: true,
          },
        },
        store: {
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

  async createStore(dto: any) {
    return this.prisma.store.create({
      data: dto,
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
            address: true,
            role: true,
          },
        },
      },
    });
  }

  async createUser(dto: any) {
    return this.userService.createUser(dto);
  }

  async getUsersWithFilters(filter: any = {}) {
    return this.userService.getUsers(filter);
  }

  async getUserDetails(userId: string) {
    return this.userService.getUserById(userId);
  }
}
