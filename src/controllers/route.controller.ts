import {
  Count,
  CountSchema,
  Filter,
  repository,
  Where,
} from '@loopback/repository';
import {
  post,
  param,
  get,
  getFilterSchemaFor,
  getModelSchemaRef,
  getWhereSchemaFor,
  patch,
  put,
  del,
  requestBody,
} from '@loopback/rest';
import {Route} from '../models';
import {RouteRepository} from '../repositories';
import {authenticate} from '@loopback/authentication';
import {inject} from '@loopback/context';
import {UserProfile, securityId, SecurityBindings} from '@loopback/security';

export class RouteController {
  constructor(
    @repository(RouteRepository)
    public routeRepository : RouteRepository,
  ) {}

  @post('/routes', {
    responses: {
      '200': {
        description: 'Route model instance',
        content: {'application/json': {schema: getModelSchemaRef(Route)}},
      },
    },
  })
  @authenticate('jwt')
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Route, {exclude: ['id']}),
        },
      },
    })
    route: Omit<Route, 'id'>,  @inject(SecurityBindings.USER) currentUserProfile: UserProfile,
  ): Promise<Route> {
    const createdByID = currentUserProfile[securityId];
    console.log(`manager ${createdByID} has just added new routed name ${route.name}`);
    route.created_by = createdByID;
    return this.routeRepository.create(route);
  }

  @get('/routes/count', {
    responses: {
      '200': {
        description: 'Route model count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async count(
    @param.query.object('where', getWhereSchemaFor(Route)) where?: Where<Route>,
  ): Promise<Count> {
    return this.routeRepository.count(where);
  }

  @get('/routes', {
    responses: {
      '200': {
        description: 'Array of Route model instances',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Route)},
          },
        },
      },
    },
  })
  async find(
    @param.query.object('filter', getFilterSchemaFor(Route)) filter?: Filter<Route>,
  ): Promise<Route[]> {
    return this.routeRepository.find(filter);
  }

  @patch('/routes', {
    responses: {
      '200': {
        description: 'Route PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Route, {partial: true}),
        },
      },
    })
    route: Route,
    @param.query.object('where', getWhereSchemaFor(Route)) where?: Where<Route>,
  ): Promise<Count> {
    return this.routeRepository.updateAll(route, where);
  }

  @get('/routes/{id}', {
    responses: {
      '200': {
        description: 'Route model instance',
        content: {'application/json': {schema: getModelSchemaRef(Route)}},
      },
    },
  })
  async findById(@param.path.string('id') id: string): Promise<Route> {
    return this.routeRepository.findById(id);
  }

  @patch('/routes/{id}', {
    responses: {
      '204': {
        description: 'Route PATCH success',
      },
    },
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Route, {partial: true}),
        },
      },
    })
    route: Route,
  ): Promise<void> {
    await this.routeRepository.updateById(id, route);
  }

  @put('/routes/{id}', {
    responses: {
      '204': {
        description: 'Route PUT success',
      },
    },
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() route: Route,
  ): Promise<void> {
    await this.routeRepository.replaceById(id, route);
  }

  @del('/routes/{id}', {
    responses: {
      '204': {
        description: 'Route DELETE success',
      },
    },
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.routeRepository.deleteById(id);
  }
}
