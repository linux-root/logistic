import {DefaultCrudRepository} from '@loopback/repository';
import {Manager, ManagerRelations} from '../models';
import {LogisticDataSource} from '../datasources';
import {inject} from '@loopback/core';

export class ManagerRepository extends DefaultCrudRepository<
  Manager,
  typeof Manager.prototype.id,
  ManagerRelations
> {
  constructor(
    @inject('datasources.logistic') dataSource: LogisticDataSource,
  ) {
    super(Manager, dataSource);
  }
}
