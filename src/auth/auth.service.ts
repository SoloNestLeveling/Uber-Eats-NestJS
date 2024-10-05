import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { privateDecrypt } from 'crypto';
import { UsersModel } from 'src/users/entity/users.entity';
import * as bcrypt from "bcrypt"
import { JwtService } from '@nestjs/jwt';
import { HASH_ROUND_KEY, JWT_SECRET_KEY } from 'src/common/const/env-path.const';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {

    constructor(
        private readonly usersService: UsersService,
        private readonly configService: ConfigService,
        private readonly jwtService: JwtService
    ) { }


    signToken(user: Pick<UsersModel, 'id' | 'email'>, isRefresh: boolean) {

        const payload = {
            email: user.email,
            sub: user.id,
            type: isRefresh ? "refresh" : "access"
        };

        return this.jwtService.sign(payload, {
            secret: this.configService.get<string>(JWT_SECRET_KEY),
            expiresIn: isRefresh ? 3600 : 300,
        });
    };


    returnToken(user: Pick<UsersModel, 'id' | 'email'>) {

        return {
            accessToken: this.signToken(user, false),
            refreshToken: this.signToken(user, true),
        };
    };


    async registerUserByEmail(dto: CreateUserDto) {

        const hash = await bcrypt.hash(
            dto.password,
            parseInt(this.configService.get<string>(HASH_ROUND_KEY))
        );

        return this.usersService.createUser({
            ...dto,
            password: hash
        });
    };


    async authenticateFromEmailAndPassword(user: Pick<UsersModel, 'email' | 'password'>) {

        const existEmail = await this.usersService.getUserByEmail(user.email);

        if (!existEmail) {
            throw new UnauthorizedException("존재 하지 않는 이메일 입니다.");
        };

        const passOk = await bcrypt.compare(user.password, existEmail.password);

        if (!passOk) {
            throw new UnauthorizedException("패스워드가 틀렸습니다.")
        };


        return existEmail;

    };


    async loginUserByEmail(user: Pick<UsersModel, 'email' | 'password'>) {
        const verifiedUser = await this.authenticateFromEmailAndPassword(user);

        return this.returnToken(verifiedUser)
    };



    extractTokenFromHeader(header: string, isBearer: boolean) {

        const split = header.split(' ');
        const prefix = isBearer ? "Bearer" : "Basic";


        if (split.length !== 2 || split[0] !== prefix) {
            throw new UnauthorizedException("잘못된 토큰입니다.")
        };

        const token = split[1];

        return token;
    };


    decodeToken(base64String: string) {

        const decode = Buffer.from(base64String, 'base64').toString('utf-8');

        const split = decode.split(':');

        const email = split[0];
        const password = split[1];

        return {
            email,
            password
        };
    };


    loginUserWithToken(rawToken: string) {

        const token = this.extractTokenFromHeader(rawToken, false);
        const result = this.decodeToken(token);

        return this.loginUserByEmail(result)

    };



    async verifyToken(token: string) {

        try {

            const payload = await this.jwtService.verify(token, {
                secret: this.configService.get<string>(JWT_SECRET_KEY),
            });

            return payload

        } catch (err) {
            throw new UnauthorizedException("토큰인 만료 되었거나, 잘못된 토큰값 입니다.")
        };
    };


    async rotateToken(token: string, isRefresh: boolean) {

        const payload = await this.verifyToken(token);

        if (payload.type !== "refresh") {
            throw new UnauthorizedException("토큰 재발급은 refreshToken으로만 가능합니다.")
        }

        return this.signToken({
            ...payload
        }, isRefresh)
    };


    createAccessToken(rawToken: string) {

        const token = this.extractTokenFromHeader(rawToken, true);

        return {
            accessToken: this.rotateToken(token, false)
        }
    };

    createRefreshToken(rawToken: string) {

        const token = this.extractTokenFromHeader(rawToken, true);

        return {
            refreshToken: this.rotateToken(token, true)
        }
    };



}
