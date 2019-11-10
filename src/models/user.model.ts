import {Entity, hasMany, model, property} from '@loopback/repository';
import {Notification} from './notification.model';

@model({settings: {strict: false}})
export class User extends Entity {
  @property({
    type: 'string',
    id: true
  })
  id: string;

  @property({
    type: 'string',
    required: true
  })
  email: string;

  @property({
    type: 'string',
    required: true
  })
  password: string;

  @property({
    type: 'string',
  })
  phone?: string;

  @property({
    type: 'string',
  })
  full_name?: string;

  @property({
    type: 'boolean',
  })
  is_manager?: boolean;

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


  @hasMany(() => Notification, {keyTo: 'notify_to'})
  notifications?: [];

  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<User>) {
    super(data);
  }
}

export interface UserRelations {
  // describe navigational properties here
}

export type UserWithRelations = User & UserRelations;
