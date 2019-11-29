import {belongsTo, Entity, model, property} from '@loopback/repository';
import {Route} from './route.model';

@model({settings: {strict: false}})
export class Checkpoint extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  id: string;

  @property({
    type: 'number',
  })
  seq: number;

  @property({
      type: 'string',
      mongodb: {dataType: 'ObjectID'}
    }
  )
  route_id: string;

  @property({
    type: 'object',
  })
  geo_coordinate?: object;

  @property({
    type: 'string',
  })
  status?: string;

  @property({
    type: 'string',
  })
  note?: string;

  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<Checkpoint>) {
    super(data);
  }
}

export interface CheckpointRelations {
  // describe navigational properties here
}

export type CheckpointWithRelations = Checkpoint & CheckpointRelations;
