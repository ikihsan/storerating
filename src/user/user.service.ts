import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto, FilterUserDto } from './dto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async createUser(dto: CreateUserDto) {
    const hashedPassword = await bcrypt.hash(dto.password, 12);

    return this.prisma.user.create({
      data: {
        ...dto,
        password: hashedPassword,
      },
      select: {
        id: true,
        name: true,
        email: true,
        address: true,
        role: true,
        createdAt: true,
      },
    });
  }

  async getUsers(filter: FilterUserDto) {
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
    if (filter.role) {
      where.role = filter.role;
    }

    const orderBy: any = {};
    if (filter.sortBy) {
      orderBy[filter.sortBy] = filter.sortOrder || 'asc';
    }

    return this.prisma.user.findMany({
      where,
      orderBy,
      select: {
        id: true,
        name: true,
        email: true,
        address: true,
        role: true,
        store: {
          select: {
            id: true,
            name: true,
            ratings: {
              select: {
                value: true,
              },
            },
          },
        },
      },
    });
  }

  async getUserById(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        address: true,
        role: true,
        store: {
          select: {
            id: true,
            name: true,
            ratings: {
              select: {
                value: true,
              },
            },
          },
        },
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async getUsersCount() {
    return this.prisma.user.count();
  }
}
