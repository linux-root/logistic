import {Entity, model, property, hasMany, belongsTo} from '@loopback/repository';
import {Checkpoint} from './checkpoint.model';
import {User} from './user.model';

@model({settings: {}})
export class Route extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  id: string;

  @property({
    type: 'string',
  })
  status?: string;
  @property({
    type: 'string',
  })
  created_by?: string;

  @property({
    type: 'string',
  })
  name?: string;

  @hasMany(() => Checkpoint, {keyTo: 'route_id'})
  checkpoints: Checkpoint[];

  @belongsTo(() => User)
  assigned_to_shipper: string;

  constructor(data?: Partial<Route>) {
    super(data);
  }
}

export interface RouteRelations {
  // describe navigational properties here
}

export type RouteWithRelations = Route & RouteRelations;
