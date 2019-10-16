import {DefaultCrudRepository, HasOneRepositoryFactory, repository} from '@loopback/repository';
import {User, Manager, Shipper, UserRelations, ManagerRelations} from '../models';
import {LogisticDataSource} from '../datasources';
import {inject, Getter} from '@loopback/core';
import {ManagerRepository} from './manager.repository';
import {ShipperRepository} from './shipper.repository';

export class UserRepository extends DefaultCrudRepository<User, typeof User.prototype.id, UserRelations> {
  public readonly manager: HasOneRepositoryFactory<Manager, typeof Manager.prototype.id>;
  public readonly shipper: HasOneRepositoryFactory<Shipper, typeof Shipper.prototype.id>;

  constructor( @inject('datasources.logistic') dataSource: LogisticDataSource,
               @repository.getter('ManagerRepository') getManagagerRepository: Getter<ManagerRepository>,
               @repository.getter('ShipperRepository') getShipperRepository: Getter<ShipperRepository>
  ) {
    super(User, dataSource);
    this.manager = this.createHasOneRepositoryFactoryFor('manager', getManagagerRepository);
    this.shipper = this.createHasOneRepositoryFactoryFor('shipper', getShipperRepository)
  }
}
