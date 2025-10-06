import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto, FilterUserDto } from './dto';
import { JwtGuard, RolesGuard } from '../auth/guard';
import { Roles } from '../auth/decorator';
import { UserRole } from '@prisma/client';

@Controller('users')
@UseGuards(JwtGuard, RolesGuard)
export class UserController {
  constructor(private userService: UserService) {}

  @Post()
  @Roles(UserRole.ADMIN)
  createUser(@Body() dto: CreateUserDto) {
    return this.userService.createUser(dto);
  }

  @Get()
  @Roles(UserRole.ADMIN)
  getUsers(@Query() filter: FilterUserDto) {
    return this.userService.getUsers(filter);
  }

  @Get(':id')
  @Roles(UserRole.ADMIN)
  getUserById(@Param('id') id: string) {
    return this.userService.getUserById(id);
  }
}
