import {DefaultCrudRepository, HasOneRepositoryFactory, repository} from '@loopback/repository';
import {User, Manager, Shipper, UserRelations, ManagerRelations} from '../models';
import {LogisticDataSource} from '../datasources';
import {inject, Getter} from '@loopback/core';
import {ManagerRepository} from './manager.repository';

export class UserRepository extends DefaultCrudRepository<User, typeof User.prototype.id, UserRelations> {
  public readonly manager: HasOneRepositoryFactory<Manager, typeof Manager.prototype.id>;
  constructor( @inject('datasources.logistic') dataSource: LogisticDataSource,
              @repository.getter('ManagerRepository')getManagagerRepository: Getter<ManagerRepository>
  ) {
    super(User, dataSource);
    this.manager = this.createHasOneRepositoryFactoryFor('manager', getManagagerRepository);
  }
}
