import { Controller, Get, Param } from '@nestjs/common';

import { AuthService } from './auth.service';
import { User } from './models/user.entity';

@Controller('v2/users')
export class UserController {
  constructor(private readonly usersService: AuthService) {}

  @Get()
  findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<User> {
    // return this.usersService.findOne(id);
    return 0 as any;
  }
}
