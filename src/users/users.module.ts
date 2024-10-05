import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModel } from './entity/users.entity';
import { ProfileController } from './profile/profile.controller';
import { ProfileService } from './profile/profile.service';
import { ProfileModel } from './profile/entity/profile.entity';
import { ImagesModel } from 'src/images/entity/images.entity';
import { ImagesService } from 'src/images/images.service';
import { WishlistService } from './wishlist/wishlist.service';
import { WishlistController } from './wishlist/wishlist.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UsersModel,
      ProfileModel,
      ImagesModel
    ])
  ],
  exports: [UsersService, ProfileService, WishlistService],
  controllers: [UsersController, ProfileController, WishlistController],
  providers: [UsersService, ProfileService, ImagesService, WishlistService],
})
export class UsersModule { }
