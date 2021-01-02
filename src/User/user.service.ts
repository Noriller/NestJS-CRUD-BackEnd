import { BadRequestException, Injectable, NotFoundException, ServiceUnavailableException } from '@nestjs/common';
import { User } from './entities/User';
import { UserDTO } from './entities/User.dto';
import { MongoUserRepository } from './repositories/implementation/MongoUserRepository';
import { IUserServiceAbstraction } from './repositories/UserInterfaces';


@Injectable()
export class UserService implements IUserServiceAbstraction {

  constructor(
    private readonly repository: MongoUserRepository
  ) { }

  async saveUser ( user: UserDTO ): Promise<User> {
    const tryToFindUser = await this.repository.findUserByEmail( user.email );

    if ( user._id || tryToFindUser )
      throw new BadRequestException(`User already exists. Can't save.`);

    const userToSave = await new User( user ).buildUser();

    const savedUser = await this.repository.saveUser(userToSave);

    if (!savedUser)
      throw new ServiceUnavailableException(`Failed to save user.`);

    return savedUser;

  }

  async findUserByEmail(email: string): Promise<User> {
    if (!email)
      throw new BadRequestException("Email cannot be empty.");

    const userFound = await this.repository.findUserByEmail(email);

    if (!userFound)
      throw new NotFoundException('User not found.');

    return userFound;
  }

  async findAllUsers(): Promise<User[]> {
    const usersFound = await this.repository.findAllUsers();

    if (usersFound.length == 0)
      return [];

    return usersFound;
  }

  async updateUser(originalEmail: string, newUserInfo: UserDTO): Promise<User> {
    if (!originalEmail)
      throw new BadRequestException('Must provide original email.');

    if ( !newUserInfo._id ) {
      const userFound = await this.findUserByEmail( originalEmail );
      newUserInfo._id = userFound.getId();
    }

    const userToUpdate = await new User( newUserInfo ).buildUser();

    const userUpdated = await this.repository.updateUserById(userToUpdate);

    if (!userUpdated)
      throw new ServiceUnavailableException('Server Error while saving data.');

    return userUpdated;
  }

  async deleteUser(email: string): Promise<User> {
    if (!email)
      throw new BadRequestException("Email cannot be empty.");

    const userFound = await this.repository.findUserByEmail( email );
    
    if ( !userFound )
      throw new NotFoundException( 'User not found.' );

    const userDeleted = await this.repository.deleteUserById( userFound.getId() );

    if (!userDeleted)
      throw new ServiceUnavailableException('User could not be deleted.');

    return userDeleted;
  }

}
