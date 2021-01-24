import { Test, TestingModule } from '@nestjs/testing';
import { Product } from './entities/Product';
import { ProductDTO } from './entities/Product.dto';
import { MongoProductRepository } from './repositories/implementation/MongoProductRepository';
import { ProductService } from './product.service';

describe( 'Product Service', () => {

  let mockMongoResults: Product[] = [];
  let mockArrayTemplate: Product[] = [];
  let aNewProductTemplate: ProductDTO;
  let aNewProductButSameEmailTemplate: ProductDTO;
  let anUpdatedVersionOfProductTemplate: ProductDTO;

  const MockFactory = {
    saveProduct: jest.fn(),
    findAllProducts: jest.fn(),
    findProductByEmail: jest.fn(),
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

    mockArrayTemplate = [ new Product( {
      "_id": "6fc56932-a379-4457-9082-cc4966b7a1f3",
      "name": "FirstFake",
      "email": "fake1@email.com",
      "password": "123123",
    } ), new Product( {
      "_id": "1718fc5c-48b6-4fd7-84ff-bc0fb639a178",
      "name": "SecondFake",
      "email": "fake2@email.com",
      "password": "123123",
    } ), new Product( {
      "_id": "19ef970c-66df-4282-9f53-3a0459093126",
      "name": "LastFake",
      "email": "fake3@email.com",
      "password": "123123",
    } ) ];

    aNewProductTemplate = {
      "name": "sample",
      "email": "email@email.com",
      "password": "123123"
    };

    aNewProductButSameEmailTemplate = {
      "name": "sample",
      "email": "fake1@email.com",
      "password": "123123"
    };

    anUpdatedVersionOfProductTemplate = {
      "name": "Not a Sample",
      "email": "AnotherEmail@email.com",
      "password": "UwU"
    };

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

  it( 'should throw if not passing a name while saving', async () => {
    jest.spyOn( repository, 'saveProduct' ).mockImplementation( jestMockImplementation_SaveProduct( mockMongoResults ) );

    const aNewProduct: ProductDTO = { ...aNewProductTemplate };
    aNewProduct.name = '';
    try {
      const productSaved = await service.saveProduct( aNewProduct );
      expect( productSaved ).toThrow();
    } catch ( error ) {
      expect( error.message ).toBe( `Name is required.` );
    }
  } );

  it( 'should throw if not passing a email while saving', async () => {
    jest.spyOn( repository, 'saveProduct' ).mockImplementation( jestMockImplementation_SaveProduct( mockMongoResults ) );

    const aNewProduct: ProductDTO = { ...aNewProductTemplate };
    aNewProduct.email = '';
    try {
      const productSaved = await service.saveProduct( aNewProduct );
      expect( productSaved ).toThrow();
    } catch ( error ) {
      expect( error.message ).toBe( `Email is required.` );
    }
  } );

  it( 'should throw if not passing a password while saving', async () => {
    jest.spyOn( repository, 'saveProduct' ).mockImplementation( jestMockImplementation_SaveProduct( mockMongoResults ) );

    const aNewProduct: ProductDTO = { ...aNewProductTemplate };
    aNewProduct.password = '';
    try {
      const productSaved = await service.saveProduct( aNewProduct );
      expect( productSaved ).toThrow();
    } catch ( error ) {
      expect( error.message ).toBe( `Password is required.` );
    }
  } );

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

    expect( productSaved.getEmail() ).toBe( aNewProductTemplate.email );
    expect( productSaved.getName() ).toBe( aNewProductTemplate.name );
  } );

  it( 'should hash the new product password', async () => {
    jest.spyOn( repository, 'saveProduct' ).mockImplementation( jestMockImplementation_SaveProduct( mockMongoResults ) );

    const aNewProduct: ProductDTO = { ...aNewProductTemplate };
    const productSaved = await service.saveProduct( aNewProduct );
    expect( productSaved.getPassword() ).not.toBe( aNewProductTemplate.password );
    expect( await productSaved.isCorrectPassword( aNewProduct.password ) ).toBeTruthy();
  } );

  it( 'should throw if email is already in use', async () => {
    jest.spyOn( repository, 'saveProduct' ).mockImplementation( jestMockImplementation_SaveProduct( mockMongoResults ) );
    jest.spyOn( repository, 'findProductByEmail' ).mockImplementation( jestMockImplementation_FindProductByEmail( mockMongoResults ) );

    const aNewProductButSameEmail: ProductDTO = { ...aNewProductButSameEmailTemplate };
    try {
      const productSaved = await service.saveProduct( aNewProductButSameEmail );
      expect( productSaved ).toThrow();
    } catch ( error ) {
      expect( error.message ).toBe( `Product already exists. Can't save.` );
    }
  } );

  it( 'should find a product using a email', async () => {
    jest.spyOn( repository, 'findProductByEmail' ).mockImplementation( jestMockImplementation_FindProductByEmail( mockMongoResults ) );

    const lookupMock: Product = mockArrayTemplate[ 0 ];

    const productFound = await service.findProductByEmail( lookupMock.getEmail() );
    const comparation = JSON.stringify( productFound ) == JSON.stringify( lookupMock );
    expect( comparation ).toBe( true );
  } );

  it( 'should throw error when not passing a email', async () => {
    jest.spyOn( repository, 'findProductByEmail' ).mockImplementation( jestMockImplementation_FindProductByEmail( mockMongoResults ) );

    try {
      const productFound = await service.findProductByEmail( null );
      expect( productFound ).toThrow();
    } catch ( error ) {
      expect( error.message ).toBe( `Email cannot be empty.` );
    }
  } );

  it( 'should throw error when a product is not found', async () => {
    jest.spyOn( repository, 'findProductByEmail' ).mockImplementation( jestMockImplementation_FindProductByEmail( mockMongoResults ) );

    try {
      const productFound = await service.findProductByEmail( 'notInDatabase@email.com' );
      expect( productFound ).toThrow();
    } catch ( error ) {
      expect( error.message ).toBe( `Product not found.` );
    }
  } );

  it( 'should update an existing product', async () => {
    jest.spyOn( repository, 'updateProductById' ).mockImplementation( jestMockImplementation_UpdateProductById( mockMongoResults ) );
    jest.spyOn( repository, 'findProductByEmail' ).mockImplementation( jestMockImplementation_FindProductByEmail( mockMongoResults ) );

    const anUpdatedVersionOfProduct = { ...anUpdatedVersionOfProductTemplate };
    const productUpdated = await service.updateProduct( mockMongoResults[ 0 ].getEmail(), anUpdatedVersionOfProduct );
    expect( mockMongoResults ).toContain( productUpdated );
  } );

  it( 'should update an existing product while passing an id', async () => {
    jest.spyOn( repository, 'updateProductById' ).mockImplementation( jestMockImplementation_UpdateProductById( mockMongoResults ) );
    jest.spyOn( repository, 'findProductByEmail' ).mockImplementation( jestMockImplementation_FindProductByEmail( mockMongoResults ) );

    const anUpdatedVersionOfProduct = { ...anUpdatedVersionOfProductTemplate };
    anUpdatedVersionOfProduct._id = mockMongoResults[ 0 ].getId();

    const productUpdated = await service.updateProduct( mockMongoResults[ 0 ].getEmail(), anUpdatedVersionOfProduct );
    expect( mockMongoResults ).toContain( productUpdated );
  } );

  it( 'should throw if not passing originalEmail when trying to update', async () => {
    jest.spyOn( repository, 'updateProductById' ).mockImplementation( jestMockImplementation_UpdateProductById( mockMongoResults ) );
    jest.spyOn( repository, 'findProductByEmail' ).mockImplementation( jestMockImplementation_FindProductByEmail( mockMongoResults ) );

    const anUpdatedVersionOfProduct = { ...anUpdatedVersionOfProductTemplate };
    try {
      const productUpdated = await service.updateProduct( '', anUpdatedVersionOfProduct );
      expect( productUpdated ).toThrow();
    } catch ( error ) {
      expect( error.message ).toBe( 'Must provide original email.' );
    }
  } );

  it( 'should throw on error while updating', async () => {
    jest.spyOn( repository, 'updateProductById' ).mockImplementation( async ( product: Product ) => null );
    jest.spyOn( repository, 'findProductByEmail' ).mockImplementation( jestMockImplementation_FindProductByEmail( mockMongoResults ) );

    const anUpdatedVersionOfProduct = { ...anUpdatedVersionOfProductTemplate };
    try {
      const productUpdated = await service.updateProduct( mockMongoResults[ 0 ].getEmail(), anUpdatedVersionOfProduct );
      expect( productUpdated ).toThrow();
    } catch ( error ) {
      expect( error.message ).toBe( 'Server Error while saving data.' );
    }
  } );

  it( 'should give the updated version of the product', async () => {
    jest.spyOn( repository, 'updateProductById' ).mockImplementation( jestMockImplementation_UpdateProductById( mockMongoResults ) );
    jest.spyOn( repository, 'findProductByEmail' ).mockImplementation( jestMockImplementation_FindProductByEmail( mockMongoResults ) );

    const anUpdatedVersionOfProduct = { ...anUpdatedVersionOfProductTemplate };
    const productUpdated = await service.updateProduct( mockMongoResults[ 0 ].getEmail(), anUpdatedVersionOfProduct );

    expect( productUpdated.getEmail() ).toBe( anUpdatedVersionOfProductTemplate.email );
    expect( productUpdated.getName() ).toBe( anUpdatedVersionOfProductTemplate.name );
    expect( productUpdated.getId() ).toBe( "6fc56932-a379-4457-9082-cc4966b7a1f3" );
  } );

  it( 'should encrypt the password while updating', async () => {
    jest.spyOn( repository, 'deleteProductById' ).mockImplementation( jestMockImplementation_DeleteProductById( mockMongoResults ) );
    jest.spyOn( repository, 'findProductByEmail' ).mockImplementation( jestMockImplementation_FindProductByEmail( mockMongoResults ) );

    const anUpdatedVersionOfProduct = { ...anUpdatedVersionOfProductTemplate };
    const productUpdated = await service.updateProduct( mockMongoResults[ 0 ].getEmail(), anUpdatedVersionOfProduct );
    expect( anUpdatedVersionOfProductTemplate.password ).not.toBe( productUpdated.getPassword() );
    expect( await productUpdated.isCorrectPassword( anUpdatedVersionOfProductTemplate.password ) ).toBeTruthy();
  } );

  it( 'should delete a product', async () => {
    jest.spyOn( repository, 'deleteProductById' ).mockImplementation( jestMockImplementation_DeleteProductById( mockMongoResults ) );
    jest.spyOn( repository, 'findProductByEmail' ).mockImplementation( jestMockImplementation_FindProductByEmail( mockMongoResults ) );

    const deletedProduct = await service.deleteProduct( "fake1@email.com" );
    expect( mockMongoResults ).not.toContain( deletedProduct );
    expect( mockMongoResults.length ).toBe( 2 );
    expect( mockArrayTemplate.length ).toBe( 3 );
  } );

  it( 'should throw if not passing an email while deleting', async () => {
    jest.spyOn( repository, 'deleteProductById' ).mockImplementation( jestMockImplementation_DeleteProductById( mockMongoResults ) );
    jest.spyOn( repository, 'findProductByEmail' ).mockImplementation( jestMockImplementation_FindProductByEmail( mockMongoResults ) );

    try {
      const deletedProduct = await service.deleteProduct( "" );
      expect( deletedProduct ).toThrow();
    } catch ( error ) {
      expect( error.message ).toBe( 'Email cannot be empty.' );
    }
  } );

  it( 'should throw if product could not be found by email while trying to deleted', async () => {
    jest.spyOn( repository, 'deleteProductById' ).mockImplementation( async ( id: string ) => null );
    jest.spyOn( repository, 'findProductByEmail' ).mockImplementation( jestMockImplementation_FindProductByEmail( mockMongoResults ) );

    try {
      const deletedProduct = await service.deleteProduct( "fakeInvalid@email.com" );
      expect( deletedProduct ).toThrow();
    } catch ( error ) {
      expect( error.message ).toBe( 'Product not found.' );
    }
  } );

  it( 'should throw if product could not be deleted', async () => {
    jest.spyOn( repository, 'deleteProductById' ).mockImplementation( async ( id: string ) => null );
    jest.spyOn( repository, 'findProductByEmail' ).mockImplementation( jestMockImplementation_FindProductByEmail( mockMongoResults ) );

    try {
      const deletedProduct = await service.deleteProduct( "fake1@email.com" );
      expect( deletedProduct ).toThrow();
    } catch ( error ) {
      expect( error.message ).toBe( 'Product could not be deleted.' );
    }
  } );


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

function jestMockImplementation_FindProductByEmail ( mockMongoResults: Product[] ): ( email: string ) => Promise<Product> {
  return async ( email: string ) => mockMongoResults.find( ( elem ) => elem.getEmail() === email );
}

function jestMockImplementation_SaveProduct ( mockMongoResults: Product[] ): ( product: Product ) => Promise<Product> {
  return async ( product: Product ) => {
    mockMongoResults.push( product );
    return product;
  };
}
