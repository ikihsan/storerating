import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Patch,
} from '@nestjs/common';
import { RatingService } from './rating.service';
import { CreateRatingDto, UpdateRatingDto } from './dto';
import { JwtGuard, RolesGuard } from '../auth/guard';
import { Roles, GetUser } from '../auth/decorator';
import { UserRole } from '@prisma/client';

@Controller('ratings')
@UseGuards(JwtGuard)
export class RatingController {
  constructor(private ratingService: RatingService) {}

  @Post('stores/:storeId')
  @UseGuards(RolesGuard)
  @Roles(UserRole.USER)
  submitRating(
    @Param('storeId') storeId: string,
    @GetUser('id') userId: string,
    @Body() dto: CreateRatingDto,
  ) {
    return this.ratingService.submitRating(storeId, userId, dto);
  }

  @Patch('stores/:storeId')
  @UseGuards(RolesGuard)
  @Roles(UserRole.USER)
  updateRating(
    @Param('storeId') storeId: string,
    @GetUser('id') userId: string,
    @Body() dto: UpdateRatingDto,
  ) {
    return this.ratingService.updateRating(storeId, userId, dto);
  }

  @Get('stores/:storeId/my-rating')
  getUserRating(
    @Param('storeId') storeId: string,
    @GetUser('id') userId: string,
  ) {
    return this.ratingService.getUserRating(storeId, userId);
  }

  @Get('stores/:storeId')
  getStoreRatings(@Param('storeId') storeId: string) {
    return this.ratingService.getStoreRatings(storeId);
  }
}
