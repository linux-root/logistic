import {
  repository,
} from '@loopback/repository';
import {
  param,
  get,
  getModelSchemaRef,
} from '@loopback/rest';
import {
  Shipper,
  User,
} from '../models';
import {ShipperRepository} from '../repositories';

export class ShipperUserController {
  constructor(
    @repository(ShipperRepository)
    public shipperRepository: ShipperRepository,
  ) { }

  @get('/shippers/{id}/user', {
    responses: {
      '200': {
        description: 'User belonging to Shipper',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(User)},
          },
        },
      },
    },
  })
  async getUser(
    @param.path.string('id') id: typeof Shipper.prototype.id,
  ): Promise<User> {
    return this.shipperRepository.user(id);
  }
}
