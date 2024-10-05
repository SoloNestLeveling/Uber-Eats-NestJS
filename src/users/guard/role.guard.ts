import { BadRequestException, CanActivate, ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Observable } from "rxjs";
import { ROLE_KEY } from "../decorator/role.decorator";
import { RoleTypeEnum } from "../entity/users.entity";

@Injectable()
export class RoleGuard implements CanActivate {

    constructor(
        private readonly reflector: Reflector
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {

        const Role = await this.reflector.getAllAndOverride(
            ROLE_KEY,
            [
                context.getClass,
                context.getHandler
            ]
        );


        if (!Role) {
            return true
        };


        const { user } = context.switchToHttp().getRequest();


        if (user.role === RoleTypeEnum.USER) {
            throw new ForbiddenException("사용 권한이 없습니다.")
        }


        if (Role === RoleTypeEnum.ADMIN) {
            if (user.role === RoleTypeEnum.OWNER) {
                throw new ForbiddenException("관리자만 사용 가능합니다.")
            } else {
                return true
            }
        };



        if (Role === RoleTypeEnum.OWNER) {
            if (user.role === RoleTypeEnum.ADMIN) {
                throw new ForbiddenException("owner만 사용 가능한 탭입니다.")
            } else {
                return true
            }
        };
    };
}