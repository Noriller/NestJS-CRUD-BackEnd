import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductSchema } from './entities/Product.schema';
import { MongoProductRepository } from './repositories/implementation/MongoProductRepository';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';

@Module( {
    imports: [ MongooseModule.forFeature( [ { name: 'Product', schema: ProductSchema } ] ) ],
    providers: [ MongoProductRepository, ProductService ],
    controllers: [ ProductController ],
} )
export class ProductModule { }
