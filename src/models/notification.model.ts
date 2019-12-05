import {Entity, model, property} from '@loopback/repository';

@model({settings: {strict: false}})
export class Notification extends Entity {
  @property({
    type: 'string',
    required: true,
    mongodb: {dataType: 'ObjectID'}
  })
  notify_to: string;

  @property({
    type: 'string',
  })
  type?: string;

  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  id: string;

  @property({
    type: 'string',
  })
  message?: string;

  @property({
    type: 'string',
    default: 'U'
  })
  status?: string;

  @property({
    type: 'string',
  })
  created_by?: string;

  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<Notification>) {
    super(data);
  }
}

export interface NotificationRelations {
  // describe navigational properties here
}

export type NotificationWithRelations = Notification & NotificationRelations;
