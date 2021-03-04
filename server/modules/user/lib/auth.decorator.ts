import { SetMetadata } from '@nestjs/common';

export const Protected = (...roles: string[]) => SetMetadata('arus-auth', roles);
