import {
  Count,
  CountSchema,
  Filter,
  repository,
  Where,
} from '@loopback/repository';
import {inject} from '@loopback/core';
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
  Notification,
} from '../models';
import {UserRepository} from '../repositories';
import {PusherService} from '../services/PusherService';
import {PusherServiceBinding} from '../keys';

export class UserNotificationController {
  constructor(
    @repository(UserRepository) protected userRepository: UserRepository,
    @inject(PusherServiceBinding.PUSHER_SERVICE) protected pusherService : PusherService
  ) { }

  @get('/users/{id}/notifications', {
    responses: {
      '200': {
        description: 'Array of Notification\'s belonging to User',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Notification)},
          },
        },
      },
    },
  })
  async find(
    @param.path.string('id') id: string,
    @param.query.object('filter') filter?: Filter<Notification>,
  ): Promise<Notification[]> {
    return this.userRepository.notifications(id).find(filter);
  }

  @post('/users/{id}/notifications', {
    responses: {
      '200': {
        description: 'User model instance',
        content: {'application/json': {schema: getModelSchemaRef(Notification)}},
      },
    },
  })
  async create(
    @param.path.string('id') id: typeof User.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Notification, {
            exclude: ['type'],
            optional: ['notify_to']
          }),
        },
      },
    }) notification: Omit<Notification, 'type'>,
  ): Promise<Notification> {
    this.pusherService.channelClient.trigger('my-channel', 'my-event', notification);
    return this.userRepository.notifications(id).create(notification);
  }

  @patch('/users/{id}/notifications', {
    responses: {
      '200': {
        description: 'User.Notification PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Notification, {partial: true}),
        },
      },
    })
    notification: Partial<Notification>,
    @param.query.object('where', getWhereSchemaFor(Notification)) where?: Where<Notification>,
  ): Promise<Count> {
    return this.userRepository.notifications(id).patch(notification, where);
  }

  @del('/users/{id}/notifications', {
    responses: {
      '200': {
        description: 'User.Notification DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.string('id') id: string,
    @param.query.object('where', getWhereSchemaFor(Notification)) where?: Where<Notification>,
  ): Promise<Count> {
    return this.userRepository.notifications(id).delete(where);
  }
}
