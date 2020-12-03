import { Body, Controller, Post, Req, UseGuards, ValidationPipe } from '@nestjs/common';
import { AuthCredentialsDTO } from './DTO/auth-credentials.dto';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService
  ) {

  }

  @Post('/signup')
  signUp(@Body(ValidationPipe) authCredentials: AuthCredentialsDTO): Promise<void> {
    return this.authService.signUp(authCredentials);
  }

  @Post('/signin')
  signIn(@Body(ValidationPipe) authCredentials: AuthCredentialsDTO): Promise<{ accessToken: string }> {
    return this.authService.signIn(authCredentials);
  }

  @Post('/test')
  @UseGuards(AuthGuard())
  test(@Req() req) {
    console.log(req);

  }
}
