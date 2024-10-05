import { Body, Controller, Get, Param, ParseIntPipe, Post, UseInterceptors } from "@nestjs/common";
import { ProfileService } from "./profile.service";
import { ReqQueryRunner } from "src/common/decorator/query-runner.decorator";
import { QueryRunner } from "typeorm";
import { CreateProfileDto } from "./dto/create-profile.dto";
import { User } from "../decorator/user.decorator";
import { UsersModel } from "../entity/users.entity";
import { TransactionInterceptor } from "src/common/interceptor/transaction.interceptor";
import { IsPublic } from "src/common/decorator/public.decorator";
import { PublicTypeEnum } from "src/common/enum/public.enum";

@Controller('profile')
export class ProfileController {

    constructor(
        private readonly profileService: ProfileService
    ) { }


    @Post()
    @UseInterceptors(TransactionInterceptor)
    createProfile(
        @User() user: UsersModel,
        @Body() dto: CreateProfileDto,
        @ReqQueryRunner() qr?: QueryRunner
    ) {
        return this.profileService.createProfile(dto, user.id, qr)
    }


    @Get(':id')
    @UseInterceptors(TransactionInterceptor)
    @IsPublic(PublicTypeEnum.PUBLIC)
    getProfile(
        @Param('id', ParseIntPipe) id: number,
        @ReqQueryRunner() qr?: QueryRunner
    ) {
        return this.profileService.getProfileById(id)
    }
}