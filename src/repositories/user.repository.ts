import {DefaultCrudRepository, HasManyRepositoryFactory, repository} from '@loopback/repository';
import {Notification, User, UserRelations, Route} from '../models';
import {LogisticDataSource} from '../datasources';
import {inject, Getter} from '@loopback/core';
import {NotificationRepository} from './notification.repository';
import {RouteRepository} from './route.repository';

export class UserRepository extends DefaultCrudRepository<
  User,
  typeof User.prototype.id,
  UserRelations
> {
  public readonly notifications: HasManyRepositoryFactory<Notification, typeof Notification.prototype.id>;

  public readonly routes: HasManyRepositoryFactory<Route, typeof User.prototype.id>;

  constructor(
    @inject('datasources.logistic') dataSource: LogisticDataSource,
    @repository.getter('NotificationRepository') getNotificationRepository: Getter<NotificationRepository>, @repository.getter('RouteRepository') protected routeRepositoryGetter: Getter<RouteRepository>,
  ) {
    super(User, dataSource);
    this.routes = this.createHasManyRepositoryFactoryFor('routes', routeRepositoryGetter,);
    this.notifications = this.createHasManyRepositoryFactoryFor('notifications', getNotificationRepository);
  }
}
