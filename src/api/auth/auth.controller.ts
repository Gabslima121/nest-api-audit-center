import {
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
  Request,
  Body,
} from '@nestjs/common';

import { AuthService } from './auth.service';
import { IsPublic } from './decorators/is-public.decorator';
import { AuthRequest, ValidateToken } from './dtos/auth.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @IsPublic()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @UseGuards(LocalAuthGuard)
  login(@Request() req: AuthRequest) {
    const user = req.user;
    return this.authService.login(user);
  }

  @IsPublic()
  @Post('validate-token')
  async validateToken(@Body() { token }: ValidateToken) {
    return this.authService.validateToken(token);
  }
}
