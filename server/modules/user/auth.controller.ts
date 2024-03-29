import { Body, Controller, HttpCode, Post, Req, Request, Put, Get } from '@nestjs/common';

import { AppLogger } from '../infra/logger/app.logger';
import { AuthService } from './auth.service';
import { Protected } from './lib/auth.decorator';
import {
  ChangePasswordDto,
  EnableSMSDto,
  ForgotPasswordDto,
  ImpersonateDto,
  LoginDto,
  ResetPassworddDto,
  type2fa,
  Verify2faDto,
} from './user.dto';
import { UserService } from './user.service';

export interface ILoginResponse {
  token: string;
  needs2fa: boolean;
  has2faVerified: boolean;
  type: 'sms' | 'totp';
  existingPhone: string;
}

@Controller('v2/auth')
export class AuthController {
  private logContext = 'AuthController';
  constructor(private readonly authService: AuthService, private readonly userService: UserService, private logger: AppLogger) {}

  @Post('login')
  @HttpCode(200)
  async login(@Body() body: LoginDto, @Req() req: Request): Promise<ILoginResponse> {
    return await this.authService.login(body, {
      subdomain: (req as any).subdomain,
      companyId: (req as any).companyId,
    });
  }

  @Post('logout')
  @HttpCode(200)
  @Protected('skip_2fa')
  async logout(@Req() req): Promise<any> {
    return await this.authService.logout(req.user);
  }

  @Post('refresh')
  @HttpCode(200)
  @Protected()
  async refreshToken(@Req() req): Promise<{ token: string }> {
    return await this.authService.refreshToken(req.companyId, req.user, req.userToken);
  }

  @Post('2fa/request/sms')
  @HttpCode(200)
  @Protected('skip_2fa')
  async requestSMS(@Req() req: Request): Promise<any> {
    // sends an sms to the provided phone (or use user already saved one if not) with a code if not
    // enabled, and then do a verify to activate
    return await this.authService.requestSMS((req as any).user);
  }

  @Post('2fa/verify')
  @HttpCode(200)
  @Protected('skip_2fa')
  async verifyToken2fa(@Body() body: Verify2faDto, @Req() req): Promise<{ token: string }> {
    return await this.authService.verifyToken2FA(req.user, body);
  }

  @Post('2fa/enable/totp')
  @HttpCode(200)
  @Protected('skip_2fa')
  async enableTOTP(@Req() req: Request): Promise<{ type: type2fa; otpauthURL?: string; success?: boolean }> {
    // send QR, if not enabled, and then do a verify to activate
    // if sms, it'll send an sms to user's phone (you can save before calling this)
    return await this.authService.enable2fa((req as any).user, type2fa.totp);
  }

  @Post('2fa/enable/sms')
  @HttpCode(200)
  @Protected('skip_2fa')
  async enableSMS(@Req() req: Request, @Body() body: EnableSMSDto): Promise<any> {
    // sends an sms to the provided phone (or use user already saved one if not) with a code if not
    // enabled, and then do a verify to activate
    return await this.authService.enable2fa((req as any).user, type2fa.sms, body.phone);
  }

  @Post('impersonate')
  @HttpCode(200)
  @Protected('superuser')
  async impersonate(@Req() req: Request, @Body() body: ImpersonateDto): Promise<any> {
    return await this.authService.impersonate(body);
  }

  @Post('forgot-password')
  @HttpCode(200)
  async forgotPassword(@Req() req: Request, @Body() body: ForgotPasswordDto): Promise<any> {
    return await this.authService.forgotPassword(body, {
      subdomain: (req as any).subdomain,
      companyId: (req as any).companyId,
    });
  }

  @Post('reset-password')
  @HttpCode(200)
  async resetPassword(@Req() req: Request, @Body() body: ResetPassworddDto): Promise<any> {
    return await this.authService.changePasswordWithToken(body, {
      subdomain: (req as any).subdomain,
      companyId: (req as any).companyId,
    });
  }

  @Put('me/change-password')
  @HttpCode(200)
  @Protected()
  async changePassword(@Req() req, @Body() body: ChangePasswordDto): Promise<any> {
    return await this.authService.changePassword(req.user, body.newPassword);
  }

  @Get('me')
  @HttpCode(200)
  async getMe(@Req() req): Promise<any> {
    return await this.userService.findOne(req.user.id);
  }
}
