import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
  Patch,
} from '@nestjs/common';
import { StoreService } from './store.service';
import { CreateStoreDto, UpdateStoreDto, FilterStoreDto } from './dto';
import { JwtGuard, RolesGuard } from '../auth/guard';
import { Roles, GetUser } from '../auth/decorator';
import { UserRole } from '@prisma/client';

@Controller('stores')
export class StoreController {
  constructor(private storeService: StoreService) {}

  @Post()
  @UseGuards(JwtGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  createStore(@Body() dto: CreateStoreDto) {
    return this.storeService.createStore(dto);
  }

  @Get()
  @UseGuards(JwtGuard)
  getStores(
    @Query() filter: FilterStoreDto,
    @GetUser('id') userId: string,
    @GetUser('role') userRole: UserRole,
  ) {
    return this.storeService.getStores(filter, userId, userRole);
  }

  @Get('my-stores')
  @UseGuards(JwtGuard, RolesGuard)
  @Roles(UserRole.STORE_OWNER)
  getMyStores(@GetUser('id') userId: string) {
    return this.storeService.getStoresByOwner(userId);
  }

  @Get('dashboard')
  @UseGuards(JwtGuard, RolesGuard)
  @Roles(UserRole.STORE_OWNER)
  getOwnerDashboard(@GetUser('id') userId: string) {
    return this.storeService.getOwnerDashboard(userId);
  }

  @Get(':id')
  @UseGuards(JwtGuard)
  getStoreById(@Param('id') id: string) {
    return this.storeService.getStoreById(id);
  }

  @Patch(':id')
  @UseGuards(JwtGuard)
  updateStore(
    @Param('id') id: string,
    @Body() dto: UpdateStoreDto,
    @GetUser('id') userId: string,
    @GetUser('role') userRole: UserRole,
  ) {
    return this.storeService.updateStore(id, dto, userId, userRole);
  }
}
