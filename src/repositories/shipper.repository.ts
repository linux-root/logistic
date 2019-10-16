import {DefaultCrudRepository, repository, BelongsToAccessor} from '@loopback/repository';
import {Shipper, ShipperRelations, User} from '../models';
import {LogisticDataSource} from '../datasources';
import {inject, Getter} from '@loopback/core';
import {UserRepository} from './user.repository';

export class ShipperRepository extends DefaultCrudRepository<
  Shipper,
  typeof Shipper.prototype.id,
  ShipperRelations
> {

  public readonly user: BelongsToAccessor<User, typeof Shipper.prototype.id>;

  constructor(
    @inject('datasources.logistic') dataSource: LogisticDataSource, @repository.getter('UserRepository') protected userRepositoryGetter: Getter<UserRepository>,
  ) {
    super(Shipper, dataSource);
    this.user = this.createBelongsToAccessorFor('user', userRepositoryGetter,);
  }
}
