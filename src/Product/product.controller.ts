import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { Product } from './entities/Product';
import { ProductDTO } from './entities/Product.dto';
import { ProductService } from './product.service';

@Controller( 'product' )
export class ProductController {

  constructor (
    private readonly productService: ProductService
  ) { }

  @Get()
  async getAllProducts (): Promise<Product[]> {
    return this.productService.findAllProducts();
  }

  @Get( 'id/:id' )
  async getProduct ( @Param( 'id' ) id: string ): Promise<Product> {
    return this.productService.findProductById( id );
  }

  @Post()
  async saveProduct ( @Body() product: ProductDTO ): Promise<Product> {
    return this.productService.saveProduct( product );
  }

  @Put()
  async updateProduct ( @Body() newProductInfo: ProductDTO ): Promise<Product> {
    return this.productService.updateProductById( newProductInfo );
  }

  @Delete()
  async deleteProduct ( @Body( 'id' ) id: string ): Promise<Product> {
    return this.productService.deleteProductById( id );
  }

}
