import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Model } from 'mongoose';
import { ProductDocument } from '../../entities/Product.schema';
import { MongoProductRepository } from './MongoProductRepository';
import { Product } from '../../entities/Product';

describe( 'Mongo Product Service', () => {
  let service: MongoProductRepository;
  let model: Model<ProductDocument>;

  beforeEach( async () => {
    const module: TestingModule = await Test.createTestingModule( {
      providers: [
        MongoProductRepository,
        {
          provide: getModelToken( 'Product' ),
          useValue: mockUseValue,
        },
      ],
    } ).compile();

    service = module.get<MongoProductRepository>( MongoProductRepository );
    model = module.get<Model<ProductDocument>>( getModelToken( 'Product' ) );
  } );

  afterEach( () => {
    jest.clearAllMocks();
  } );

  it( 'should be defined', () => {
    expect( service ).toBeDefined();
  } );

  it( 'should return mockArray', async () => {
    jest.spyOn( model, 'find' ).mockReturnValue( jestMockResolvedValue_Exec( mockArrayMongo ) );
    const mocks = await service.findAllProducts();
    expect( mocks ).toEqual( mockArrayProduct );
    expect( mocks.length ).toEqual( mockArrayProduct.length );
  } );

  it( 'should find one by id', async () => {
    jest.spyOn( model, 'findById' ).mockReturnValue( jestMockResolvedValue_Exec( mockMongoFormat ) );
    const foundMock = await service.findProductById( mockProductFormat.getId() );
    expect( foundMock ).toEqual( mockProductFormat );
  } );

  it( 'should return null if product is not found', async () => {
    jest.spyOn( model, 'findById' ).mockReturnValue( jestMockResolvedValue_Exec( null ) );
    const foundMock = await service.findProductById( mockProductFormat.getId() );
    expect( foundMock ).toEqual( null );
  } );

  it( 'should save new product', async () => {
    jest.spyOn( model, 'create' ).mockImplementation(
      jest.fn().mockResolvedValueOnce( mockMongoFormat )
    );
    const foundMock = await service.saveProduct( mockProductFormat );
    expect( foundMock ).toEqual( mockProductFormat );
  } );

  it( 'should find one by id and update', async () => {
    const mockUpdatedProductFormat = new Product( {
      "id": "mockID", "productName": "NEWmockName", "productDescription": "NEWjustAMock", "image": "NEWdummyImage", "productPrice": 33.33
    } );
    const mockUpdatedMongoFormat = {
      "_id": "mockID", "productName": "NEWmockName", "productDescription": "NEWjustAMock", "image": "NEWdummyImage", "productPrice": 33.33
    };
    jest.spyOn( model, 'findOneAndUpdate' ).mockReturnValue( jestMockResolvedValue_Exec( mockUpdatedMongoFormat ) );
    const foundMock = await service.updateProductById( mockUpdatedProductFormat );
    expect( foundMock ).not.toEqual( mockProductFormat );
    expect( foundMock ).toEqual( mockUpdatedProductFormat );
  } );

  it( 'should find one by id and delete', async () => {
    jest.spyOn( model, 'findOneAndDelete' ).mockReturnValue( jestMockResolvedValue_Exec( mockMongoFormat ) );
    const foundMock = await service.deleteProductById( mockProductFormat.getId() );
    expect( foundMock ).toEqual( mockProductFormat );
  } );

} );

const mockUseValue = {
  new: jest.fn(),
  constructor: jest.fn(),
  find: jest.fn(),
  findOne: jest.fn(),
  findById: jest.fn(),
  update: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
  remove: jest.fn(),
  findOneAndUpdate: jest.fn(),
  findOneAndDelete: jest.fn(),
  exec: jest.fn(),
};

function jestMockResolvedValue_Exec ( valueToReturn ) {
  return {
    exec: jest.fn().mockResolvedValueOnce( valueToReturn ),
  } as any;
}

const mockProductFormat = new Product( {
  "id": "mockID", "productName": "mockName", "productDescription": "justAMock", "image": "dummyImage", "productPrice": 33.33
} );

const mockMongoFormat = {
  "_id": "mockID", "productName": "mockName", "productDescription": "justAMock", "image": "dummyImage", "productPrice": 33.33
};


const mockArrayMongo = [ {
  "_id": "mockID", "productName": "mockName", "productDescription": "justAMock", "image": "dummyImage", "productPrice": 33.33
}, {
    "_id": "secondMock", "productName": "secondMockName", "productDescription": "secondMockDescription", "image": "secondDummyImage", "productPrice": 66.66
}, {
    "_id": "thirdMock", "productName": "thirdMockName", "productDescription": "thirdMockDescription", "image": "thirdDummyImage", "productPrice": 99.99
} ];

const mockArrayProduct = [
  new Product( {
    "id": "mockID", "productName": "mockName", "productDescription": "justAMock", "image": "dummyImage", "productPrice": 33.33
  } ),
  new Product( {
    "id": "secondMock", "productName": "secondMockName", "productDescription": "secondMockDescription", "image": "secondDummyImage", "productPrice": 66.66
  } ),
  new Product( {
    "id": "thirdMock", "productName": "thirdMockName", "productDescription": "thirdMockDescription", "image": "thirdDummyImage", "productPrice": 99.99
  } )
];