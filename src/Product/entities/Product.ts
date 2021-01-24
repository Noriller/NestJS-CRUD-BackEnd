import { BadRequestException } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { ProductDTO } from './Product.dto';

export class Product {

  private _id: string;
  private productName: string;
  private productDescription: string;
  private image: string;
  private productPrice: number;
  private quantity?: number;

  public constructor ( product: ProductDTO ) {
    if ( !product.productName )
      throw new BadRequestException( 'Product name must be provided.' );

    if ( !product.productDescription )
      throw new BadRequestException( 'Product description must be provided.' );

    if ( !product.productPrice )
      throw new BadRequestException( 'Product price must be provided.' );

    this._id = product.id ? product.id : uuidv4();
    this.productName = product.productName;
    this.productDescription = product.productDescription;
    this.productPrice = product.productPrice;
    this.image = product.image ? product.image : this.randomImage();

  }

  public getId (): string {
    return this._id;
  }
  
  public getImage (): string {
    return this.image;
  }

  private randomImage (): string {
    const randomArbitrary = ( min, max ) => Math.floor( Math.random() * ( max - min ) + min );
    return `https://picsum.photos/${ randomArbitrary( 400, 700 ) }/${ randomArbitrary( 300, 600 ) }`;
  }
}