import { Product } from '../entities/Product';
import { ProductDTO } from '../entities/Product.dto';

interface IProductSharedServices {
  findAllProducts (): Promise<Product[]>;
  findProductById ( id: string ): Promise<Product>;
  deleteProductById ( id: string ): Promise<Product>;
}

export interface IProductServiceImplementation extends IProductSharedServices {
  saveProduct ( product: Product ): Promise<Product>;
  updateProductById ( product: Product ): Promise<Product>;
}

export interface IProductServiceAbstraction extends IProductSharedServices {
  updateProductById ( product: ProductDTO ): Promise<Product>;
  saveProduct ( product: ProductDTO ): Promise<Product>;
}