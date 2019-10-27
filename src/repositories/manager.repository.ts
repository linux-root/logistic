import {DefaultCrudRepository, repository, BelongsToAccessor} from '@loopback/repository';
import {Manager, ManagerRelations, User} from '../models';
import {LogisticDataSource} from '../datasources';
import {inject, Getter} from '@loopback/core';
import {UserRepository} from './user.repository';

export class ManagerRepository extends DefaultCrudRepository<
  Manager,
  typeof Manager.prototype.id,
  ManagerRelations
> {

  public readonly user: BelongsToAccessor<User, typeof Manager.prototype.id>;

  constructor(
    @inject('datasources.logistic') dataSource: LogisticDataSource, @repository.getter('UserRepository') protected userRepositoryGetter: Getter<UserRepository>,
  ) {
    super(Manager, dataSource);
    this.user = this.createBelongsToAccessorFor('user', userRepositoryGetter,);
  }
}
