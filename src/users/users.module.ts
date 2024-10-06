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
import { WishlistModel } from './wishlist/entity/wishlist.entity';
import { RestaurantsService } from 'src/restaurants/restaurants.service';
import { RestaurantsModel } from 'src/restaurants/entity/restaurants.entity';
import { MenusService } from 'src/restaurants/menus/menus.service';
import { CommonService } from 'src/common/common.service';
import { MenusModel } from 'src/restaurants/menus/entity/menus.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UsersModel,
      ProfileModel,
      ImagesModel,
      WishlistModel,
      RestaurantsModel,
      MenusModel
    ])
  ],
  exports: [UsersService, ProfileService, WishlistService],
  controllers: [UsersController, ProfileController, WishlistController],
  providers: [UsersService, ProfileService, ImagesService, WishlistService, RestaurantsService, MenusService, CommonService],
})
export class UsersModule { }
