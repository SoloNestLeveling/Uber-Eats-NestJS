import { Body, Controller, Get, Post, Headers } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { IsPublic } from 'src/common/decorator/public.decorator';
import { PublicTypeEnum } from 'src/common/enum/public.enum';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }


  @Post('register/email')
  @IsPublic(PublicTypeEnum.PUBLIC)
  registerUser(
    @Body() dto: CreateUserDto
  ) {

    return this.authService.registerUserByEmail(dto)
  };

  @Post('login/email')
  @IsPublic(PublicTypeEnum.PUBLIC)
  loginUer(
    @Headers("authorization") rawToken: string
  ) {
    return this.authService.loginUserWithToken(rawToken)
  }

}
