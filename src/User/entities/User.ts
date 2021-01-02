import { BadRequestException } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { compareHashPassword, generateHashPassword } from '../utils/utils';
import { UserDTO } from './User.dto';

export class User {

  private _id: string;
  private name: string;
  private email: string;
  private password: string;

  public constructor ( user: UserDTO ) {
    if ( !user.email )
      throw new BadRequestException('Email is required.');
  
    if ( !user.name )
      throw new BadRequestException('Name is required.');
    
    if ( !user.password )
      throw new BadRequestException( 'Password is required.' );

    this._id = user._id;
    this.name = user.name;
    this.email = user.email;
    this.password = user.password;
  }

  public async buildUser () {
    await this.hashPassword();

    if ( !this._id ) {
      this._id = uuidv4();
    }

    return this;
  }

  private async hashPassword () {
    this.password = await User.generateHashedPassword( this.password );
  }

  public getId () {
    return this._id;
  }

  public getName () {
    return this.name;
  }

  public getEmail () {
    return this.email;
  }

  public getPassword () {
    return this.password;
  }

  public async isCorrectPassword ( password: string ) {
    return await compareHashPassword( password, this.password )
  }

  public static async generateHashedPassword ( password: string ): Promise<string> {
    return await generateHashPassword( password );
  }


}