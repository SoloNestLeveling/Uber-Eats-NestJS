import { Module } from '@nestjs/common';
import { RestaurantsService } from './restaurants.service';
import { RestaurantsController } from './restaurants.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RestaurantsModel } from './entity/restaurants.entity';
import { MenusController } from './menus/menus.controller';
import { MenusService } from './menus/menus.service';
import { UsersModel } from 'src/users/entity/users.entity';
import { UsersService } from 'src/users/users.service';
import { MenusModel } from './menus/entity/menus.entity';
import { CommonService } from 'src/common/common.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      RestaurantsModel,
      UsersModel,
      MenusModel
    ])
  ],
  exports: [RestaurantsService],
  controllers: [RestaurantsController, MenusController],
  providers: [RestaurantsService, MenusService, UsersService, CommonService],
})
export class RestaurantsModule { }
