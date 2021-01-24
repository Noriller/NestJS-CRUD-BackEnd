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
    return new Product( productCreated );
  }

  async findProductById ( _id: string ): Promise<Product> {
    const productFound = await this.service.findById( _id ).exec();
    return productFound ? new Product( productFound ) : null;
  }

  async findAllProducts (): Promise<Product[]> {
    const mongoArray = await this.service.find().exec();
    const productArray = [];
    mongoArray.forEach(
      product => productArray.push( new Product( product ) )
    );

    return productArray;
  }

  async updateProductById ( product: Product ): Promise<Product> {
    const productUpdated = await this.service.findOneAndUpdate( { '_id': product.getId() }, product, { new: true } ).exec();
    return new Product( productUpdated );
  }

  async deleteProductById ( _id: string ): Promise<Product> {
    const productDeleted = await this.service.findOneAndDelete( { '_id': _id } ).exec();
    return new Product( productDeleted );
  }
}