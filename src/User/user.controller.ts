import { Body, Controller, Delete, Get, NotFoundException, Param, Post, Put, Res, UseFilters } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './entities/User';
import { UserDTO } from './entities/User.dto';

@Controller('user')
export class UserController {

  constructor(
    private readonly userService: UserService
  ) { }

  @Get()
  async getAllUsers(): Promise<User[]> {
    return this.userService.findAllUsers();
  }

  @Get('email/:email')
  async getUserByEmail(@Param('email') email: string): Promise<User> {
    return this.userService.findUserByEmail(email);
  }

  @Post()
  async saveUser ( @Body() user: UserDTO ): Promise<User> {
    return this.userService.saveUser(user);
  }

  @Put()
  async updateUser (
    @Body( 'originalEmail' ) originalEmail: string,
    @Body( 'user' ) newUserInfo: UserDTO )
    : Promise<User> {
    return this.userService.updateUser(originalEmail, newUserInfo);
  }

  @Delete()
  async deleteUser(@Body('email') email: string): Promise<User> {
    return this.userService.deleteUser(email);
  }

}
