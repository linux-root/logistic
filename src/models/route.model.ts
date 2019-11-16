import {Entity, model, property, hasMany} from '@loopback/repository';
import {Checkpoint} from './checkpoint.model';

@model({settings: {}})
export class Route extends Entity {
  @property({
    type: 'string',
    id: true,
    required: true,
    generated: false,
  })
  id: string;

  @property({
    type: 'string',
  })
  status?: string;

  @property({
    type: 'string',
  })
  assigned_to_shipper?: string;

  @property({
    type: 'string',
  })
  created_by?: string;

  @property({
    type: 'string',
  })
  name?: string;

  @hasMany(() => Checkpoint ,{keyTo: 'route_id'})
  checkpoints: Checkpoint[];

  constructor(data?: Partial<Route>) {
    super(data);
  }
}

export interface RouteRelations {
  // describe navigational properties here
}

export type RouteWithRelations = Route & RouteRelations;
