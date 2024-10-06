import { PickType } from "@nestjs/mapped-types";
import { WishlistModel } from "../entity/wishlist.entity";
import { IsArray, IsNumber, IsString } from "class-validator";

export class CreateWishlistDto extends PickType(WishlistModel, [
    'menus',
    'totalPrice'
]) {

    @IsNumber({}, { each: true })
    menuNumbers: number[]
};