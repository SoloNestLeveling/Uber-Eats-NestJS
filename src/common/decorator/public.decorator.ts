import { SetMetadata } from "@nestjs/common";
import { PublicTypeEnum } from "../enum/public.enum";

export const PUBLIC_KEY = "user_public";

export const IsPublic = (type: PublicTypeEnum) => SetMetadata(PUBLIC_KEY, type);