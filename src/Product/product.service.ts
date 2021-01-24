import { BadRequestException, Injectable, NotFoundException, ServiceUnavailableException } from '@nestjs/common';
import { Product } from './entities/Product';
import { ProductDTO } from './entities/Product.dto';
import { MongoProductRepository } from './repositories/implementation/MongoProductRepository';
import { IProductServiceAbstraction } from './repositories/ProductInterfaces';


@Injectable()
export class ProductService implements IProductServiceAbstraction {

  constructor (
    private readonly repository: MongoProductRepository
  ) { }

  async saveProduct ( product: ProductDTO ): Promise<Product> {
    if ( await this.repository.findProductById( product.id ) )
      throw new BadRequestException( `Duplicate product. Can't save.` );

    const productToSave = new Product( product );

    const savedProduct = await this.repository.saveProduct( productToSave );

    if ( !savedProduct )
      throw new ServiceUnavailableException( `Failed to save product.` );

    return savedProduct;

  }

  async findAllProducts (): Promise<Product[]> {
    const productsFound = await this.repository.findAllProducts();

    if ( productsFound.length == 0 )
      return [];

    return productsFound;
  }

  async findProductById ( id: string ): Promise<Product> {
    if ( !id )
      throw new BadRequestException( "ID cannot be empty." );

    const productFound = await this.repository.findProductById( id );

    if ( !productFound )
      throw new NotFoundException( 'Product not found.' );

    return productFound;
  }

  async updateProductById ( newProductInfo: ProductDTO ): Promise<Product> {
    if ( !newProductInfo.id )
      throw new BadRequestException( 'Must provide ID.' );

    const tryToFindProduct = await this.findProductById( newProductInfo.id );

    const productToUpdate = new Product( newProductInfo );

    const productUpdated = await this.repository.updateProductById( productToUpdate );

    if ( !productUpdated )
      throw new ServiceUnavailableException( 'Server Error while saving data.' );

    return productUpdated;
  }

  async deleteProductById ( id: string ): Promise<Product> {
    if ( !id )
      throw new BadRequestException( "ID cannot be empty." );

    const productFound = await this.repository.findProductById( id );

    if ( !productFound )
      throw new NotFoundException( 'Product not found.' );

    const productDeleted = await this.repository.deleteProductById( id );

    if ( !productDeleted )
      throw new ServiceUnavailableException( 'Product could not be deleted.' );

    return productDeleted;
  }

}
