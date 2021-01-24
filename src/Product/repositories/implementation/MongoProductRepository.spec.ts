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

  it( 'should be defined', () => {
    expect( service ).toBeDefined();
  } );

  afterEach( () => {
    jest.clearAllMocks();
  } );

  it( 'should return mockArray', async () => {
    jest.spyOn( model, 'find' ).mockReturnValue( jestMockResolvedValue_Exec( mockArrayMongo ) );
    const mocks = await service.findAllProducts();
    expect( mocks ).toEqual( mockArrayProduct );
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

  it( 'should find one by email', async () => {
    jest.spyOn( model, 'findOne' ).mockReturnValue( jestMockResolvedValue_Exec( mockMongoFormat ) );
    const foundMock = await service.findProductByEmail( mockProductFormat.getEmail() );
    expect( foundMock ).toEqual( mockProductFormat );
  } );

  it( 'should return null trying to find by email that does not exist', async () => {
    jest.spyOn( model, 'findOne' ).mockReturnValue( jestMockResolvedValue_Exec( null ) );
    const foundMock = await service.findProductByEmail( mockProductFormat.getEmail() );
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
    jest.spyOn( model, 'findOneAndUpdate' ).mockReturnValue( jestMockResolvedValue_Exec( mockMongoFormat ) );
    const foundMock = await service.updateProductById( mockProductFormat );
    expect( foundMock ).toEqual( mockProductFormat );
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
  "_id": "6fc56932-a379-4457-9082-cc4966b7a1f3",
  "name": "FirstFake",
  "email": "fake1@email.com",
  "password": "123123",
} );
const mockMongoFormat = new Product( {
  "_id": "6fc56932-a379-4457-9082-cc4966b7a1f3",
  "name": "FirstFake",
  "email": "fake1@email.com",
  "password": "123123",
} );

const mockArrayMongo = [ {
  "_id": "6fc56932-a379-4457-9082-cc4966b7a1f3",
  "name": "FirstFake",
  "email": "fake1@email.com",
  "password": "123123",
}, {
  "_id": "1718fc5c-48b6-4fd7-84ff-bc0fb639a178",
  "name": "SecondFake",
  "email": "fake2@email.com",
  "password": "123123",
}, {
  "_id": "19ef970c-66df-4282-9f53-3a0459093126",
  "name": "LastFake",
  "email": "fake3@email.com",
  "password": "123123",
} ];

const mockArrayProduct = [ {
  "_id": "6fc56932-a379-4457-9082-cc4966b7a1f3",
  "name": "FirstFake",
  "email": "fake1@email.com",
  "password": "123123",
}, {
  "_id": "1718fc5c-48b6-4fd7-84ff-bc0fb639a178",
  "name": "SecondFake",
  "email": "fake2@email.com",
  "password": "123123",
}, {
  "_id": "19ef970c-66df-4282-9f53-3a0459093126",
  "name": "LastFake",
  "email": "fake3@email.com",
  "password": "123123",
} ];