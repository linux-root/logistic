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
  Route,
  Checkpoint,
} from '../models';
import {RouteRepository} from '../repositories';
import {authenticate} from '@loopback/authentication';

authenticate('jwt')
export class RouteCheckpointController {
  constructor(
    @repository(RouteRepository) protected routeRepository: RouteRepository,
  ) { }

  @get('/routes/{id}/checkpoints', {
    responses: {
      '200': {
        description: 'Array of Checkpoint\'s belonging to Route',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Checkpoint)},
          },
        },
      },
    },
  })
  async find(
    @param.path.string('id') id: string,
    @param.query.object('filter') filter?: Filter<Checkpoint>,
  ): Promise<Checkpoint[]> {
    return this.routeRepository.checkpoints(id).find(filter);
  }

  @post('/routes/{id}/checkpoints', {
    responses: {
      '200': {
        description: 'Route model instance',
        content: {'application/json': {schema: getModelSchemaRef(Checkpoint)}},
      },
    },
  })
  async create(
    @param.path.string('id') id: typeof Route.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Checkpoint, {
            exclude: ['id'],
            optional: ['route_id']
          }),
        },
      },
    }) checkpoint: Omit<Checkpoint, 'id'>,
  ): Promise<Checkpoint> {
    return this.routeRepository.checkpoints(id).create(checkpoint);
  }

  @patch('/routes/{id}/checkpoints', {
    responses: {
      '200': {
        description: 'Route.Checkpoint PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Checkpoint, {partial: true}),
        },
      },
    })
    checkpoint: Partial<Checkpoint>,
    @param.query.object('where', getWhereSchemaFor(Checkpoint)) where?: Where<Checkpoint>,
  ): Promise<Count> {
    return this.routeRepository.checkpoints(id).patch(checkpoint, where);
  }

  @del('/routes/{id}/checkpoints', {
    responses: {
      '200': {
        description: 'Route.Checkpoint DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.string('id') id: string,
    @param.query.object('where', getWhereSchemaFor(Checkpoint)) where?: Where<Checkpoint>,
  ): Promise<Count> {
    return this.routeRepository.checkpoints(id).delete(where);
  }
}
