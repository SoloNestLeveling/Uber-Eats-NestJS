import { PickType } from "@nestjs/mapped-types";
import { ProfileModel } from "../entity/profile.entity";
import { IsNumber, IsString } from "class-validator";

export class CreateProfileDto extends PickType(ProfileModel, ['nickname']) {

    @IsString()
    image: string;
}