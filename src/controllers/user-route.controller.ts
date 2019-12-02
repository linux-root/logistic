import {
  Count,
  CountSchema,
  Filter,
  repository,
  Where,
} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  getWhereSchemaFor,
  param,
  patch,
  post,
  requestBody,
} from '@loopback/rest';
import {
  User,
  Route,
} from '../models';
import {UserRepository} from '../repositories';

export class UserRouteController {
  constructor(
    @repository(UserRepository) protected userRepository: UserRepository,
  ) { }

  @get('/users/{id}/routes', {
    responses: {
      '200': {
        description: 'Array of Route\'s belonging to User',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Route)},
          },
        },
      },
    },
  })
  async find(
    @param.path.string('id') id: string,
    @param.query.object('filter') filter?: Filter<Route>,
  ): Promise<Route[]> {
    return this.userRepository.routes(id).find(filter);
  }

  @post('/users/{id}/routes', {
    responses: {
      '200': {
        description: 'User model instance',
        content: {'application/json': {schema: getModelSchemaRef(Route)}},
      },
    },
  })
  async create(
    @param.path.string('id') id: typeof User.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Route, {
            exclude: ['id'],
            optional: ['assigned_to_shipper']
          }),
        },
      },
    }) route: Omit<Route, 'id'>,
  ): Promise<Route> {
    return this.userRepository.routes(id).create(route);
  }

  @patch('/users/{id}/routes', {
    responses: {
      '200': {
        description: 'User.Route PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Route, {partial: true}),
        },
      },
    })
    route: Partial<Route>,
    @param.query.object('where', getWhereSchemaFor(Route)) where?: Where<Route>,
  ): Promise<Count> {
    return this.userRepository.routes(id).patch(route, where);
  }

  @del('/users/{id}/routes', {
    responses: {
      '200': {
        description: 'User.Route DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.string('id') id: string,
    @param.query.object('where', getWhereSchemaFor(Route)) where?: Where<Route>,
  ): Promise<Count> {
    return this.userRepository.routes(id).delete(where);
  }
}
