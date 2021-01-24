import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product } from '../../../Product/entities/Product';
import { IProductServiceImplementation } from '../ProductInterfaces';

export class MongoProductRepository implements IProductServiceImplementation {

  constructor (
    @InjectModel( 'Product' )
    private readonly service: typeof Model
  ) { }

  async saveProduct ( product: Product ): Promise<Product> {
    const productCreated = await this.service.create( product );
    return this.mongoToProduct( productCreated );
  }

  async findProductById ( _id: string ): Promise<Product> {
    const productFound = await this.service.findById( _id ).exec();
    return productFound ? this.mongoToProduct( productFound ) : null;
  }

  async findAllProducts (): Promise<Product[]> {
    const mongoArray = await this.service.find().exec();
    const productArray = [];
    mongoArray.forEach(
      product => productArray.push( this.mongoToProduct( product ) )
    );

    return productArray;
  }

  async updateProductById ( product: Product ): Promise<Product> {
    const productUpdated = await this.service.findOneAndUpdate( { '_id': product.getId() }, product, { new: true } ).exec();
    return this.mongoToProduct( productUpdated );
  }

  async deleteProductById ( _id: string ): Promise<Product> {
    const productDeleted = await this.service.findOneAndDelete( { '_id': _id } ).exec();
    return this.mongoToProduct( productDeleted );
  }

  private mongoToProduct ( mongoResult ) {
    mongoResult.id = mongoResult._id;
    return new Product( mongoResult )
  }
}