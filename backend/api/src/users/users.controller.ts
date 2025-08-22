import { Controller, Get, Put, Body, Req, UseGuards, UploadedFile, UseInterceptors, Post } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { UsersService } from './users.service';
import { File as MulterFile } from 'multer';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  async getMe(@Req() req) {
    return this.usersService.getMe(req.user.id);
  }

  @Put('me')
  @UseInterceptors(FileInterceptor('avatar'))
  async updateMe(
    @Req() req,
    @Body() body,
    @UploadedFile() avatar?: MulterFile
  ) {
    return this.usersService.updateMe(req.user.id, body, avatar);
  }

  @Post('me/password')
  async changePassword(@Req() req, @Body() body) {
    return this.usersService.changePassword(req.user.id, body.currentPassword, body.newPassword);
  }
} 