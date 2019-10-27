import {
  repository,
} from '@loopback/repository';
import {
  param,
  get,
  getModelSchemaRef,
} from '@loopback/rest';
import {
  Manager,
  User,
} from '../models';
import {ManagerRepository} from '../repositories';

export class ManagerUserController {
  constructor(
    @repository(ManagerRepository)
    public managerRepository: ManagerRepository,
  ) { }

  @get('/managers/{id}/user', {
    responses: {
      '200': {
        description: 'User belonging to Manager',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(User)},
          },
        },
      },
    },
  })
  async getUser(
    @param.path.string('id') id: typeof Manager.prototype.id,
  ): Promise<User> {
    return this.managerRepository.user(id);
  }
}
