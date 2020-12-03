import { Body, Controller, Post, ValidationPipe } from '@nestjs/common';
import { AuthCredentialsDTO } from './DTO/auth-credentials.dto';
import { AuthService } from './auth.service';

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
  signIn(@Body(ValidationPipe) authCredentials: AuthCredentialsDTO): Promise<void> {
    return this.authService.signIn(authCredentials);
  }
}
