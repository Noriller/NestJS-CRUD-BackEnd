import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { User } from './entities/User';
import { UserDTO } from './entities/User.dto';
import { UserService } from './user.service';

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
