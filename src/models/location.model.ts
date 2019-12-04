import {Model, model, property} from '@loopback/repository';

@model({settings: {strict: false}})
export class Location extends Model {
  @property({
    type: 'string',
    required: true,
  })
  shipper_id: string;

  @property({
    type: 'number',
    required: true,
  })
  lat: number;

  @property({
    type: 'number',
    required: true,
  })
  lng: number;

  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<Location>) {
    super(data);
  }
}

export interface LocationRelations {
  // describe navigational properties here
}

export type LocationWithRelations = Location & LocationRelations;
