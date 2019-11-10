import {DefaultCrudRepository, Getter, HasManyRepositoryFactory, repository} from '@loopback/repository';
import {Notification, User, UserRelations} from '../models';
import {LogisticDataSource} from '../datasources';
import {inject} from '@loopback/core';
import {NotificationRepository} from './notification.repository';

export class UserRepository extends DefaultCrudRepository<
  User,
  typeof User.prototype.id,
  UserRelations
> {
  public readonly notifications: HasManyRepositoryFactory<Notification, typeof Notification.prototype.id>;
  constructor(
    @inject('datasources.logistic') dataSource: LogisticDataSource,
    @repository.getter('NotificationRepository') getNotificationRepository: Getter<NotificationRepository>
  ) {
    super(User, dataSource);
    this.notifications = this.createHasManyRepositoryFactoryFor('notifications', getNotificationRepository);
  }
}
