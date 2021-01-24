import { Test, TestingModule } from '@nestjs/testing';
import { Product } from './entities/Product';
import { ProductDTO } from './entities/Product.dto';
import { MongoProductRepository } from './repositories/implementation/MongoProductRepository';
import { ProductService } from './product.service';

describe( 'Product Service', () => {

  let mockMongoResults: Product[] = [];
  let mockArrayTemplate: Product[] = [];
  let aNewProductTemplate: ProductDTO;
  let aNewProductButSameIdTemplate: ProductDTO;
  let anUpdatedVersionOfProductTemplate: ProductDTO;

  const MockFactory = {
    saveProduct: jest.fn(),
    findAllProducts: jest.fn(),
    findProductById: jest.fn(),
    updateProductById: jest.fn(),
    deleteProductById: jest.fn(),
  };

  let service: ProductService;
  let repository: MongoProductRepository;

  beforeEach( async () => {
    const module: TestingModule = await Test.createTestingModule( {
      providers: [
        ProductService,
        {
          provide: MongoProductRepository,
          useValue: MockFactory
        }
      ]
    } ).compile();

    mockArrayTemplate = [
      new Product( { "id": "fakeID", "productName": "fakeProductOne", "productDescription": "fakeDescriptionOne", "image": "fakeImageOne", "productPrice": 33.33 } ),
      new Product( { "id": "fakeID2", "productName": "fakeProductTwo", "productDescription": "fakeDescriptionTwo", "image": "fakeImageTwo", "productPrice": 66.66 } ),
      new Product( { "id": "fakeID3", "productName": "fakeProductThree", "productDescription": "fakeDescriptionThree", "image": "fakeImageThree", "productPrice": 99.99 } )
    ];

    aNewProductTemplate = { "id": "fakeID", "productName": "fakeProductNew", "productDescription": "fakeDescriptionNew", "image": "fakeImageNew", "productPrice": 11.11 };

    aNewProductButSameIdTemplate = { "id": "fakeID", "productName": "fakeProductSame", "productDescription": "fakeDescriptionSame", "image": "fakeImageSame", "productPrice": 22.22 };

    anUpdatedVersionOfProductTemplate = { "id": "fakeID", "productName": "fakeProductUpdate", "productDescription": "fakeDescriptionUpdate", "image": "fakeImageUpdate", "productPrice": 88.88 };

    mockMongoResults = mockArrayTemplate.concat();

    service = module.get<ProductService>( ProductService );
    repository = module.get<MongoProductRepository>( MongoProductRepository );
  } );

  it( 'should be defined', () => {
    expect( service ).toBeDefined();
  } );

  it( 'should return three products given mockArray have 3 products', async () => {
    jest.spyOn( repository, 'findAllProducts' ).mockImplementation( async () => mockMongoResults );

    const productsFound = await service.findAllProducts();
    expect( productsFound ).toStrictEqual( mockArrayTemplate );
  } );

  it( 'should return empty array if not found anything', async () => {
    jest.spyOn( repository, 'findAllProducts' ).mockImplementation( async () => [] );

    const productsFound = await service.findAllProducts();
    expect( productsFound ).toStrictEqual( [] );
  } );

  it( 'should save a new product', async () => {
    jest.spyOn( repository, 'saveProduct' ).mockImplementation( jestMockImplementation_SaveProduct( mockMongoResults ) );

    const aNewProduct: ProductDTO = { ...aNewProductTemplate };
    const productSaved = await service.saveProduct( aNewProduct );
    expect( mockMongoResults.length ).toBe( 4 );
    expect( mockArrayTemplate.length ).toBe( 3 );
    expect( mockMongoResults ).toContain( productSaved );
  } );

  it( 'should throw if not passing a product name while saving', async () => {
    jest.spyOn( repository, 'saveProduct' ).mockImplementation( jestMockImplementation_SaveProduct( mockMongoResults ) );

    const aNewProduct: ProductDTO = { ...aNewProductTemplate };
    aNewProduct.productName = '';
    try {
      const productSaved = await service.saveProduct( aNewProduct );
      expect( productSaved ).toThrow();
    } catch ( error ) {
      expect( error.message ).toBe( `Product name must be provided.` );
    }
  } );

  it( 'should throw if not passing a product description while saving', async () => {
    jest.spyOn( repository, 'saveProduct' ).mockImplementation( jestMockImplementation_SaveProduct( mockMongoResults ) );

    const aNewProduct: ProductDTO = { ...aNewProductTemplate };
    aNewProduct.productDescription = '';
    try {
      const productSaved = await service.saveProduct( aNewProduct );
      expect( productSaved ).toThrow();
    } catch ( error ) {
      expect( error.message ).toBe( `Product description must be provided.` );
    }
  } );

  it( 'should throw if not passing a product price while saving', async () => {
    jest.spyOn( repository, 'saveProduct' ).mockImplementation( jestMockImplementation_SaveProduct( mockMongoResults ) );

    const aNewProduct: ProductDTO = { ...aNewProductTemplate };
    aNewProduct.productPrice = null;
    try {
      const productSaved = await service.saveProduct( aNewProduct );
      expect( productSaved ).toThrow();
    } catch ( error ) {
      expect( error.message ).toBe( `Product price must be provided.` );
    }
  } );

  test.todo( 'should create random image if none is provided' );
  test.todo( 'should create random ID if none is provided' )

  it( 'should throw if failed to save', async () => {
    jest.spyOn( repository, 'saveProduct' ).mockImplementation( async ( product: Product ) => null );

    const aNewProduct: ProductDTO = { ...aNewProductTemplate };
    try {
      const productSaved = await service.saveProduct( aNewProduct );
      expect( productSaved ).toThrow();
    } catch ( error ) {
      expect( error.message ).toBe( `Failed to save product.` );
    }
  } );

  it( 'should save the new product data', async () => {
    jest.spyOn( repository, 'saveProduct' ).mockImplementation( jestMockImplementation_SaveProduct( mockMongoResults ) );

    const aNewProduct: ProductDTO = { ...aNewProductTemplate };
    const productSaved = await service.saveProduct( aNewProduct );

    expect( productSaved.getId() ).toBe( aNewProductTemplate.id );
    expect( productSaved ).toStrictEqual( new Product( aNewProductTemplate ) );
  } );

  it( 'should throw if ID is already in use', async () => {
    jest.spyOn( repository, 'saveProduct' ).mockImplementation( jestMockImplementation_SaveProduct( mockMongoResults ) );
    jest.spyOn( repository, 'findProductById' ).mockImplementation( jestMockImplementation_FindProductById( mockMongoResults ) );

    const aNewProductButSameId: ProductDTO = { ...aNewProductButSameIdTemplate };
    try {
      const productSaved = await service.saveProduct( aNewProductButSameId );
      expect( productSaved ).toThrow();
    } catch ( error ) {
      expect( error.message ).toBe( `Duplicate product. Can't save.` );
    }
  } );

  // it( 'should find a product using a email', async () => {
  //   jest.spyOn( repository, 'findProductById' ).mockImplementation( jestMockImplementation_FindProductById( mockMongoResults ) );

  //   const lookupMock: Product = mockArrayTemplate[ 0 ];

  //   const productFound = await service.findProductById( lookupMock.getId() );
  //   const comparation = JSON.stringify( productFound ) == JSON.stringify( lookupMock );
  //   expect( comparation ).toBe( true );
  // } );

  // it( 'should throw error when not passing a email', async () => {
  //   jest.spyOn( repository, 'findProductById' ).mockImplementation( jestMockImplementation_FindProductById( mockMongoResults ) );

  //   try {
  //     const productFound = await service.findProductById( null );
  //     expect( productFound ).toThrow();
  //   } catch ( error ) {
  //     expect( error.message ).toBe( `ID cannot be empty.` );
  //   }
  // } );

  // it( 'should throw error when a product is not found', async () => {
  //   jest.spyOn( repository, 'findProductById' ).mockImplementation( jestMockImplementation_FindProductById( mockMongoResults ) );

  //   try {
  //     const productFound = await service.findProductById( 'notInDatabase@email.com' );
  //     expect( productFound ).toThrow();
  //   } catch ( error ) {
  //     expect( error.message ).toBe( `Product not found.` );
  //   }
  // } );

  // it( 'should update an existing product', async () => {
  //   jest.spyOn( repository, 'updateProductById' ).mockImplementation( jestMockImplementation_UpdateProductById( mockMongoResults ) );
  //   jest.spyOn( repository, 'findProductById' ).mockImplementation( jestMockImplementation_FindProductById( mockMongoResults ) );

  //   const anUpdatedVersionOfProduct = { ...anUpdatedVersionOfProductTemplate };
  //   const productUpdated = await service.updateProductById( anUpdatedVersionOfProduct );
  //   expect( mockMongoResults ).toContain( productUpdated );
  // } );

  // it( 'should update an existing product while passing an id', async () => {
  //   jest.spyOn( repository, 'updateProductById' ).mockImplementation( jestMockImplementation_UpdateProductById( mockMongoResults ) );
  //   jest.spyOn( repository, 'findProductById' ).mockImplementation( jestMockImplementation_FindProductById( mockMongoResults ) );

  //   const anUpdatedVersionOfProduct = { ...anUpdatedVersionOfProductTemplate };
  //   anUpdatedVersionOfProduct.id = mockMongoResults[ 0 ].getId();

  //   const productUpdated = await service.updateProductById( anUpdatedVersionOfProduct );
  //   expect( mockMongoResults ).toContain( productUpdated );
  // } );

  // xit( 'should throw if not passing originalEmail when trying to update', async () => {
  //   jest.spyOn( repository, 'updateProductById' ).mockImplementation( jestMockImplementation_UpdateProductById( mockMongoResults ) );
  //   jest.spyOn( repository, 'findProductById' ).mockImplementation( jestMockImplementation_FindProductById( mockMongoResults ) );

  //   const anUpdatedVersionOfProduct = { ...anUpdatedVersionOfProductTemplate };
  //   try {
  //     const productUpdated = await service.updateProductById( anUpdatedVersionOfProduct );
  //     expect( productUpdated ).toThrow();
  //   } catch ( error ) {
  //     expect( error.message ).toBe( 'Must provide original email.' );
  //   }
  // } );

  // xit( 'should throw on error while updating', async () => {
  //   jest.spyOn( repository, 'updateProductById' ).mockImplementation( async ( product: Product ) => null );
  //   jest.spyOn( repository, 'findProductById' ).mockImplementation( jestMockImplementation_FindProductById( mockMongoResults ) );

  //   const anUpdatedVersionOfProduct = { ...anUpdatedVersionOfProductTemplate };
  //   try {
  //     const productUpdated = await service.updateProductById( anUpdatedVersionOfProduct );
  //     expect( productUpdated ).toThrow();
  //   } catch ( error ) {
  //     expect( error.message ).toBe( 'Server Error while saving data.' );
  //   }
  // } );

  // xit( 'should give the updated version of the product', async () => {
  //   jest.spyOn( repository, 'updateProductById' ).mockImplementation( jestMockImplementation_UpdateProductById( mockMongoResults ) );
  //   jest.spyOn( repository, 'findProductById' ).mockImplementation( jestMockImplementation_FindProductById( mockMongoResults ) );

  //   const anUpdatedVersionOfProduct = { ...anUpdatedVersionOfProductTemplate };
  //   const productUpdated = await service.updateProductById( anUpdatedVersionOfProduct );

  //   // expect( productUpdated.getEmail() ).toBe( anUpdatedVersionOfProductTemplate.email );
  //   // expect( productUpdated.getName() ).toBe( anUpdatedVersionOfProductTemplate.name );
  //   // expect( productUpdated.getId() ).toBe( "6fc56932-a379-4457-9082-cc4966b7a1f3" );
  // } );

  // xit( 'should encrypt the password while updating', async () => {
  //   jest.spyOn( repository, 'deleteProductById' ).mockImplementation( jestMockImplementation_DeleteProductById( mockMongoResults ) );
  //   jest.spyOn( repository, 'findProductById' ).mockImplementation( jestMockImplementation_FindProductById( mockMongoResults ) );

  //   const anUpdatedVersionOfProduct = { ...anUpdatedVersionOfProductTemplate };
  //   const productUpdated = await service.updateProductById( anUpdatedVersionOfProduct );
  // } );

  // it( 'should delete a product', async () => {
  //   jest.spyOn( repository, 'deleteProductById' ).mockImplementation( jestMockImplementation_DeleteProductById( mockMongoResults ) );
  //   jest.spyOn( repository, 'findProductById' ).mockImplementation( jestMockImplementation_FindProductById( mockMongoResults ) );

  //   const deletedProduct = await service.deleteProductById( "fakeID" );
  //   expect( mockMongoResults ).not.toContain( deletedProduct );
  //   expect( mockMongoResults.length ).toBe( 2 );
  //   expect( mockArrayTemplate.length ).toBe( 3 );
  // } );

  // it( 'should throw if not passing an ID while deleting', async () => {
  //   jest.spyOn( repository, 'deleteProductById' ).mockImplementation( jestMockImplementation_DeleteProductById( mockMongoResults ) );
  //   jest.spyOn( repository, 'findProductById' ).mockImplementation( jestMockImplementation_FindProductById( mockMongoResults ) );

  //   try {
  //     const deletedProduct = await service.deleteProductById( "" );
  //     expect( deletedProduct ).toThrow();
  //   } catch ( error ) {
  //     expect( error.message ).toBe( 'ID cannot be empty.' );
  //   }
  // } );

  // it( 'should throw if product could not be found by ID while trying to deleted', async () => {
  //   jest.spyOn( repository, 'deleteProductById' ).mockImplementation( async ( id: string ) => null );
  //   jest.spyOn( repository, 'findProductById' ).mockImplementation( jestMockImplementation_FindProductById( mockMongoResults ) );

  //   try {
  //     const deletedProduct = await service.deleteProductById( "fakeInvalid" );
  //     expect( deletedProduct ).toThrow();
  //   } catch ( error ) {
  //     expect( error.message ).toBe( 'Product not found.' );
  //   }
  // } );

  // it( 'should throw if product could not be deleted', async () => {
  //   jest.spyOn( repository, 'deleteProductById' ).mockImplementation( async ( id: string ) => null );
  //   jest.spyOn( repository, 'findProductById' ).mockImplementation( jestMockImplementation_FindProductById( mockMongoResults ) );

  //   try {
  //     const deletedProduct = await service.deleteProductById( "fakeID" );
  //     expect( deletedProduct ).toThrow();
  //   } catch ( error ) {
  //     expect( error.message ).toBe( 'Product could not be deleted.' );
  //   }
  // } );


} );

function jestMockImplementation_UpdateProductById ( mockMongoResults: Product[] ): ( product: Product ) => Promise<Product> {
  return async ( product: Product ) => {
    const index = mockMongoResults.findIndex( ( elem => elem.getId() == product.getId() ) );
    mockMongoResults[ index ] = product;
    return mockMongoResults[ index ];
  };
}

function jestMockImplementation_DeleteProductById ( mockMongoResults: Product[] ): ( id: string ) => Promise<Product> {
  return async ( id: string ) => {
    const index = mockMongoResults.findIndex( ( elem => elem.getId() == id ) );
    const deleted = mockMongoResults[ index ];
    mockMongoResults.splice( index, 1 );
    return deleted;
  };
}

function jestMockImplementation_FindProductById ( mockMongoResults: Product[] ): ( id: string ) => Promise<Product> {
  return async ( id: string ) => mockMongoResults.find( ( elem ) => elem.getId() === id );
}

function jestMockImplementation_SaveProduct ( mockMongoResults: Product[] ): ( product: Product ) => Promise<Product> {
  return async ( product: Product ) => {
    mockMongoResults.push( product );
    return product;
  };
}
