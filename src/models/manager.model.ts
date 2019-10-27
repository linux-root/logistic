import {model, property, belongsTo, Entity} from '@loopback/repository';
import {User} from './user.model';

@model({settings: {}})
export class Manager extends Entity {

  @property({
    type: 'string',
    id: true
  })
  id: string;

  @belongsTo(() => User)
  userId: string;

  constructor(data?: Partial<Manager>) {
    super(data);
  }
}

export interface ManagerRelations {
  // describe navigational properties here
}

export type ManagerWithRelations = Manager & ManagerRelations;
