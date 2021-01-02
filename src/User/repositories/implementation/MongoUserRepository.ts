import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../../../User/entities/User';
import { IUserServiceImplementation } from '../UserInterfaces';

export class MongoUserRepository implements IUserServiceImplementation {

  constructor (
    @InjectModel( 'User' )
    private readonly service: typeof Model
  ) { }

  async saveUser ( user: User ): Promise<User> {
    const userCreated = await this.service.create( user );
    return new User( userCreated );
  }

  async findUserByEmail ( email: string ): Promise<User> {
    const userFound = await this.service.findOne( { email: email } ).exec();
    return userFound ? new User( userFound ) : null;
  }

  async findUserById ( _id: string ): Promise<User> {
    const userFound = await this.service.findById( _id ).exec();
    return userFound ? new User( userFound ) : null;
  }

  async findAllUsers (): Promise<User[]> {
    const mongoArray = await this.service.find().exec();
    const userArray = [];
    mongoArray.forEach(
      user => userArray.push( new User( user ) )
    );

    return userArray;
  }

  async updateUserById ( user: User ): Promise<User> {
    const userUpdated = await this.service.findOneAndUpdate( { '_id': user.getId() }, user, { new: true } ).exec();
    return new User( userUpdated );
  }

  async deleteUserById ( _id: string ): Promise<User> {
    const userDeleted = await this.service.findOneAndDelete( { '_id': _id } ).exec();
    return new User( userDeleted );
  }
}