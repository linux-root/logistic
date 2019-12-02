import {
  repository,
} from '@loopback/repository';
import {
  param,
  get,
  getModelSchemaRef,
} from '@loopback/rest';
import {
  Route,
  User,
} from '../models';
import {RouteRepository} from '../repositories';

export class RouteUserController {
  constructor(
    @repository(RouteRepository)
    public routeRepository: RouteRepository,
  ) { }

  @get('/routes/{id}/user', {
    responses: {
      '200': {
        description: 'User belonging to Route',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(User)},
          },
        },
      },
    },
  })
  async getUser(
    @param.path.string('id') id: typeof Route.prototype.id,
  ): Promise<User> {
    return this.routeRepository.user(id);
  }
}
