import { Body, Controller, Get, Param, ParseIntPipe, Post } from "@nestjs/common";
import { WishlistService } from "./wishlist.service";
import { CreateWishlistDto } from "./dto/create-wishlist.dto";
import { User } from "../decorator/user.decorator";
import { UsersModel } from "../entity/users.entity";
import { IsPublic } from "src/common/decorator/public.decorator";
import { PublicTypeEnum } from "src/common/enum/public.enum";

@Controller('wishlist')
export class WishlistController {

    constructor(
        private readonly wishlistService: WishlistService
    ) { }


    @Post(':id')
    createWishlist(
        @Param('id', ParseIntPipe) resId: number,
        @Body() dto: CreateWishlistDto,
        @User() user: UsersModel
    ) {

        return this.wishlistService.createWishlist(dto, user.id, resId);
    };


    @Get(':id')
    @IsPublic(PublicTypeEnum.PUBLIC)
    getWishlist(
        @Param('id', ParseIntPipe) id: number
    ) {
        return this.wishlistService.getwishlistById(id)
    }
}