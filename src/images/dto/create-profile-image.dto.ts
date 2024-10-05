import { PickType } from "@nestjs/mapped-types";
import { ImagesModel } from "../entity/images.entity";

export class CreateProfileImage extends PickType(ImagesModel, [
    'order',
    'path',
    'type',
    'profile'
]) { }