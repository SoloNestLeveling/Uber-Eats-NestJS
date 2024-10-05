import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { Observable } from "rxjs";
import { UsersService } from "src/users/users.service";
import { AuthService } from "../auth.service";
import { Reflector } from "@nestjs/core";
import { PUBLIC_KEY } from "src/common/decorator/public.decorator";
import { PublicTypeEnum } from "src/common/enum/public.enum";

@Injectable()
export class BearerTokenGuard implements CanActivate {

    constructor(
        private readonly usersService: UsersService,
        private readonly authService: AuthService,
        private readonly reflector: Reflector
    ) { }
    async canActivate(context: ExecutionContext): Promise<boolean> {

        const isPublic = this.reflector.getAllAndOverride(
            PUBLIC_KEY,
            [
                context.getClass(),
                context.getHandler()
            ]
        );


        const req = context.switchToHttp().getRequest();

        if (isPublic) {
            return req.isPublic
        };

        if (isPublic === PublicTypeEnum.PUBLIC) {
            return true;
        };


        const rawToken = req.headers["authorization"];

        if (!rawToken) {
            throw new UnauthorizedException("토큰이 존재 하지 않습니다.")
        };

        const token = this.authService.extractTokenFromHeader(rawToken, true);
        const result = await this.authService.verifyToken(token);
        const user = await this.usersService.getUserByEmail(result.email);

        req.user = user;
        req.tokenType = result.type;
        req.token = token;

        return true;
    };
};


@Injectable()
export class AccessTokenGuard extends BearerTokenGuard {
    async canActivate(context: ExecutionContext): Promise<boolean> {
        await super.canActivate(context);

        const req = context.switchToHttp().getRequest()

        if (req.isPublic === PublicTypeEnum.PUBLIC || PublicTypeEnum.REFRESH) {
            return true;
        };

        if (req.tokenType !== "access") {
            throw new UnauthorizedException("accessToken이 아닙니다.")
        }

        return true;
    };
};


