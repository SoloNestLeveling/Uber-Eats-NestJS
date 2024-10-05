import { ClassSerializerInterceptor, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CommonModule } from './common/common.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { DB_DATABASE_KEY, DB_HOST_KEY, DB_PASSWORD_KEY, DB_PORT_KEY, DB_USERNAME_KEY } from './common/const/env-path.const';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { UsersModel } from './users/entity/users.entity';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { AccessTokenGuard } from './auth/guard/bearer-token.guard';
import { AuthService } from './auth/auth.service';
import { JwtModule } from '@nestjs/jwt';
import { ServeStaticModule } from '@nestjs/serve-static';
import { PUBLIC_FOLDER_PATH } from './common/const/image-path.const';
import { ImagesModule } from './images/images.module';
import { ImagesModel } from './images/entity/images.entity';
import { ProfileModel } from './users/profile/entity/profile.entity';
import { RestaurantsModule } from './restaurants/restaurants.module';
import { RestaurantsModel } from './restaurants/entity/restaurants.entity';
import { MenusModel } from './restaurants/menus/entity/menus.entity';
import { RoleGuard } from './users/guard/role.guard';
import { OrdersModule } from './orders/orders.module';
import { OrdersModel } from './orders/entity/orders.entity';
import { WishlistModel } from './users/wishlist/entity/wishlist.entity';

@Module({
  imports: [
    JwtModule.register({}),
    ServeStaticModule.forRoot({
      rootPath: PUBLIC_FOLDER_PATH,
      serveRoot: "/public"
    }),
    ConfigModule.forRoot({
      envFilePath: ".env",
      isGlobal: true
    }),
    TypeOrmModule.forRoot({
      type: "postgres",
      host: process.env[DB_HOST_KEY],
      port: parseInt(process.env[DB_PORT_KEY]),
      username: process.env[DB_USERNAME_KEY],
      password: process.env[DB_PASSWORD_KEY],
      database: process.env[DB_DATABASE_KEY],
      synchronize: true,
      entities: [
        UsersModel,
        ImagesModel,
        ProfileModel,
        RestaurantsModel,
        MenusModel,
        OrdersModel,
        WishlistModel,
      ],
    }),
    CommonModule,
    AuthModule,
    UsersModule,
    ImagesModule,
    RestaurantsModule,
    OrdersModule],
  controllers: [AppController],
  providers: [AppService, AuthService,
    {
      provide: APP_INTERCEPTOR,
      useClass: ClassSerializerInterceptor
    },
    {
      provide: APP_GUARD,
      useClass: AccessTokenGuard
    },
    {
      provide: APP_GUARD,
      useClass: RoleGuard
    },
  ],
})
export class AppModule { }
