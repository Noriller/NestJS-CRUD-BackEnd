import { User } from '../entities/User';
import { UserDTO } from '../entities/User.dto';

interface IUserSharedServices {
  findAllUsers(): Promise<User[]>;
  findUserByEmail(email: string): Promise<User>;
}

export interface IUserServiceImplementation extends IUserSharedServices {
  saveUser ( user: User ): Promise<User>;
  findUserById(id: string): Promise<User>;
  updateUserById(user: User): Promise<User>;
  
  deleteUserById(id: string): Promise<User>;
}

export interface IUserServiceAbstraction extends IUserSharedServices {
  saveUser ( user: UserDTO ): Promise<User>;
  updateUser ( originalEmail: string, newUserInfo: UserDTO ): Promise<User>;
  deleteUser(email: string): Promise<User>;
}