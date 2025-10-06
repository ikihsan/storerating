import { Body, Controller, Post, UseGuards, Patch } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto, LoginDto, UpdatePasswordDto } from './dto';
import { JwtGuard } from './guard';
import { GetUser } from './decorator';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @UseGuards(JwtGuard)
  @Patch('update-password')
  updatePassword(
    @GetUser('id') userId: string,
    @Body() dto: UpdatePasswordDto,
  ) {
    return this.authService.updatePassword(userId, dto.newPassword);
  }

  @UseGuards(JwtGuard)
  @Post('logout')
  logout() {
    return { message: 'Logout successful' };
  }
}
