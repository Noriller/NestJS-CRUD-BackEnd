import { UserModule } from './User/user.module';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { ProductModule } from './Product/product.module';

@Module({
  imports: [
    ConfigModule.forRoot( { isGlobal: true } ),
    MongooseModule.forRoot( process.env.MONGO_HOST, { useFindAndModify: false } ),
    UserModule,
    ProductModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
