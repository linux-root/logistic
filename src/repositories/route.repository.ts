import {DefaultCrudRepository, HasManyRepositoryFactory, repository, BelongsToAccessor} from '@loopback/repository';
import {Checkpoint, Route, RouteRelations, User} from '../models';
import {LogisticDataSource} from '../datasources';
import {Getter, inject} from '@loopback/core';
import {CheckpointRepository} from './checkpoint.repository';
import {UserRepository} from './user.repository';

export class RouteRepository extends DefaultCrudRepository<
  Route,
  typeof Route.prototype.id,
  RouteRelations
> {

  public readonly checkpoints: HasManyRepositoryFactory<Checkpoint, typeof Route.prototype.id>;

  public readonly user: BelongsToAccessor<User, typeof Route.prototype.id>;

  constructor(
    @inject('datasources.logistic') dataSource: LogisticDataSource,
    @repository.getter('CheckpointRepository')
    protected checkpointRepositoryGetter: Getter<CheckpointRepository>, @repository.getter('UserRepository') protected userRepositoryGetter: Getter<UserRepository>,
  ) {
    super(Route, dataSource);
    this.user = this.createBelongsToAccessorFor('assigned_to_shipper', userRepositoryGetter,);
    this.checkpoints = this.createHasManyRepositoryFactoryFor('checkpoints', checkpointRepositoryGetter,);
  }
}
