import {Entity, model, property} from '@loopback/repository';

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

  constructor(data?: Partial<Route>) {
    super(data);
  }
}

export interface RouteRelations {
  // describe navigational properties here
}

export type RouteWithRelations = Route & RouteRelations;
