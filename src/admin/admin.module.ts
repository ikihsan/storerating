import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { UserModule } from '../user/user.module';
import { StoreModule } from '../store/store.module';
import { RatingModule } from '../rating/rating.module';

@Module({
  imports: [UserModule, StoreModule, RatingModule],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
