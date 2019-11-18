import {DefaultCrudRepository, repository, HasManyRepositoryFactory} from '@loopback/repository';
import {Route, RouteRelations, Checkpoint} from '../models';
import {LogisticDataSource} from '../datasources';
import {inject, Getter} from '@loopback/core';
import {CheckpointRepository} from './checkpoint.repository';

export class RouteRepository extends DefaultCrudRepository<
  Route,
  typeof Route.prototype.id,
  RouteRelations
> {

  public readonly checkpoints: HasManyRepositoryFactory<Checkpoint, typeof Route.prototype.id>;

  constructor(
    @inject('datasources.logistic') dataSource: LogisticDataSource, @repository.getter('CheckpointRepository') protected checkpointRepositoryGetter: Getter<CheckpointRepository>,
  ) {
    super(Route, dataSource);
    this.checkpoints = this.createHasManyRepositoryFactoryFor('checkpoints', checkpointRepositoryGetter,);
  }
}
