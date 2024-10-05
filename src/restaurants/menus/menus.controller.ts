import { Body, Controller, Get, Param, ParseIntPipe, Post, Query } from "@nestjs/common";
import { MenusService } from "./menus.service";
import { User } from "src/users/decorator/user.decorator";
import { RoleTypeEnum, UsersModel } from "src/users/entity/users.entity";
import { Role } from "src/users/decorator/role.decorator";
import { CreateMeunDto } from "./dto/create-menu.dto";
import { dot } from "node:test/reporters";
import { MenusPaginateDto } from "./dto/menu-paginate.dto";
import { IsPublic } from "src/common/decorator/public.decorator";
import { PublicTypeEnum } from "src/common/enum/public.enum";

@Controller('menus')
export class MenusController {
    constructor(
        private readonly menusService: MenusService
    ) { }


    @Post()
    @Role(RoleTypeEnum.OWNER)
    createMenu(
        @User() owner: UsersModel,
        @Body() dto: CreateMeunDto,
    ) {
        return this.menusService.createMenu(dto, owner.id)
    };


    @Get('paginate/:id')
    @IsPublic(PublicTypeEnum.PUBLIC)
    menusPaginate(
        @Query() dto: MenusPaginateDto,
        @Param('id', ParseIntPipe) restaurantId: number
    ) {
        return this.menusService.menusPaginate(dto, restaurantId)
    };


}
