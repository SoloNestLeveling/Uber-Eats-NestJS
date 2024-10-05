import { SetMetadata } from "@nestjs/common";
import { RoleTypeEnum } from "../entity/users.entity";

export const ROLE_KEY = "user_role";

export const Role = (role: RoleTypeEnum) => SetMetadata(ROLE_KEY, role);