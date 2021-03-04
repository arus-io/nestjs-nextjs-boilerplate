import { HttpException, HttpStatus } from '@nestjs/common';

export class TwoFactorAuthenticationRequiredException extends HttpException {
  constructor() {
    super(
      {
        message: 'Two Factor Authentication is required.',
        error: 'NEEDS_2FA',
        statusCode: HttpStatus.FORBIDDEN,
      },
      HttpStatus.FORBIDDEN,
    );
  }
}
