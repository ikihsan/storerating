import { Controller, Get, UseGuards, Query, Param, Post, Body } from '@nestjs/common';
import { AdminService } from './admin.service';
import { JwtGuard, RolesGuard } from '../auth/guard';
import { Roles } from '../auth/decorator';
import { UserRole } from '@prisma/client';

@Controller('admin')
@UseGuards(JwtGuard, RolesGuard)
@Roles(UserRole.ADMIN)
export class AdminController {
  constructor(private adminService: AdminService) {}

  @Get('dashboard')
  getDashboardStats() {
    return this.adminService.getDashboardStats();
  }

  @Get('stores')
  getStoresForAdmin(@Query() filter: any) {
    return this.adminService.getStoresWithRatings(filter);
  }

  @Get('stores/:id/ratings')
  getStoreRatings(@Param('id') storeId: string) {
    return this.adminService.getStoreRatings(storeId);
  }

  @Post('stores')
  createStore(@Body() dto: any) {
    return this.adminService.createStore(dto);
  }

  @Post('users')
  createUser(@Body() dto: any) {
    return this.adminService.createUser(dto);
  }

  @Get('users')
  getUsersForAdmin(@Query() filter: any) {
    return this.adminService.getUsersWithFilters(filter);
  }

  @Get('users/:id')
  getUserDetails(@Param('id') userId: string) {
    return this.adminService.getUserDetails(userId);
  }
}
