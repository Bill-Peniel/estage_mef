import { Controller, Post, Body, HttpCode, HttpStatus, UseGuards, Request, Get, Req, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { AuthGuard } from '@nestjs/passport';
import { Response, Request as ExpressRequest } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  // --- Google OAuth ---
  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth() {}

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthCallback(@Req() req: ExpressRequest, @Res() res: Response) {
    // req.user contient le profil Google
    const jwt = await this.authService.loginOAuth(req.user);
    // Redirige vers le frontend avec le token
    res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}/login?token=${jwt.access_token}`);
  }

  // --- Facebook OAuth ---
  @Get('facebook')
  @UseGuards(AuthGuard('facebook'))
  async facebookAuth() {}

  @Get('facebook/callback')
  @UseGuards(AuthGuard('facebook'))
  async facebookAuthCallback(@Req() req: ExpressRequest, @Res() res: Response) {
    const jwt = await this.authService.loginOAuth(req.user);
    res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}/login?token=${jwt.access_token}`);
  }
} 