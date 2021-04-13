import { IsEmail, IsEnum, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

//@Note if this grows, make it a folder

export enum type2fa {
  sms = 'sms',
  totp = 'totp',
}

export class LoginDto {
  @IsEmail({}, { message: 'Please provide a valid email address.' })
  email: string;

  @IsNotEmpty({ message: 'Please provide a valid password.' })
  password: string;
}

export class Verify2faDto {
  @IsNotEmpty({ message: 'Please provide a 2 factor authentication token.' })
  token2fa: string;

  @IsEnum(type2fa)
  tokenType: string;
}

export class EnableSMSDto {
  @IsOptional()
  phone: string;
}

export class ImpersonateDto {
  @IsNumber()
  userId: number;
  @IsNumber()
  companyId: number;
}

export class ForgotPasswordDto {
  @IsEmail()
  email: string;
}

export class ResetPasswordDto {
  @IsEmail()
  email: string;
  @IsNotEmpty()
  resetToken: string;
  @IsNotEmpty({ message: 'Please provide a valid password.' })
  newPassword: string;
}

