import {model, property} from '@loopback/repository';
import {User} from './user.model';

@model({settings: {}})
export class Manager extends User {

  constructor(data?: Partial<Manager>) {
    super(data);
  }
}

export interface ManagerRelations {
  // describe navigational properties here
}

export type ManagerWithRelations = Manager & ManagerRelations;
