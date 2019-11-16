import {DefaultCrudRepository} from '@loopback/repository';
import {Checkpoint, CheckpointRelations} from '../models';
import {LogisticDataSource} from '../datasources';
import {inject} from '@loopback/core';

export class CheckpointRepository extends DefaultCrudRepository<
  Checkpoint,
  typeof Checkpoint.prototype.id,
  CheckpointRelations
> {
  constructor(
    @inject('datasources.logistic') dataSource: LogisticDataSource,
  ) {
    super(Checkpoint, dataSource);
  }
}
