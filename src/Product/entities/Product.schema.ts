import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema( { collection: 'product', _id: false, id: false } )
export class ProductDocument extends Document {

  @Prop( { required: true } )
  _id: string;

  @Prop( { required: true } )
  productName: string;

  @Prop( { required: true } )
  productDescription: string;

  @Prop( { required: true } )
  image: string;

  @Prop( { required: true } )
  productPrice: number;

  @Prop( { required: false } )
  quantity?: number;

}

export const ProductSchema = SchemaFactory.createForClass( ProductDocument );
