import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from './entities/User.schema';
import { MongoUserRepository } from './repositories/implementation/MongoUserRepository';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
    imports: [MongooseModule.forFeature([{ name: 'User', schema: UserSchema }])],
    providers: [MongoUserRepository, UserService],
    controllers: [UserController],
})
export class UserModule { }
