import {DefaultCrudRepository} from '@loopback/repository';
import {Notification, NotificationRelations} from '../models';
import {LogisticDataSource} from '../datasources';
import {inject} from '@loopback/core';

export class NotificationRepository extends DefaultCrudRepository<
  Notification,
  typeof Notification.prototype.type,
  NotificationRelations
> {
  constructor(
    @inject('datasources.logistic') dataSource: LogisticDataSource,
  ) {
    super(Notification, dataSource);
  }
}
