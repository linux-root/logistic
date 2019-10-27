import {model, property, Entity, belongsTo} from '@loopback/repository';
import {User} from './user.model';

@model({settings: {strict: false}})
export class Shipper extends Entity {

  @property({
    type: 'string',
    id: true
  })
  id: string;
  @property({
    type: 'number',
  })
  citizen_id?: number;

  @property({
    type: 'string',
  })
  working_time?: string;

  @property({
    type: 'boolean',
  })
  is_active?: boolean;

  @belongsTo(() => User)
  userId: string;
  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<Shipper>) {
    super(data);
  }
}

export interface ShipperRelations {
  // describe navigational properties here
}

export type ShipperWithRelations = Shipper & ShipperRelations;
