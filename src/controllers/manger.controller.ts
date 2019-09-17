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
  HttpErrors
} from '@loopback/rest';
import {Manager, User} from '../models';
import {Credentials, ManagerRepository} from '../repositories';
import {PasswordHasherBindings, TokenServiceBindings, UserServiceBindings} from '../keys';
import {validateCredentials} from '../services/validator';
import {TokenService, UserService} from '@loopback/authentication';
import {inject} from '@loopback/core';
import {PasswordHasher} from '../services/hash.password.bcryptjs';
import * as _ from 'lodash';

export class MangerController {
  constructor(
    @repository(ManagerRepository)
    public managerRepository : ManagerRepository,

    @inject(PasswordHasherBindings.PASSWORD_HASHER)
    public passwordHasher: PasswordHasher,

    @inject(TokenServiceBindings.TOKEN_SERVICE)
    public jwtService: TokenService,

    @inject(UserServiceBindings.USER_SERVICE)
    public userService: UserService<User, Credentials>
  ) {}

  @post('/managers', {
    responses: {
      '200': {
        description: 'Manager model instance',
        content: {'application/json': {schema: getModelSchemaRef(Manager)}},
      },
    },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Manager, {exclude: ['id']}),
        },
      },
    })
    manager: Omit<Manager, 'id'>,
  ): Promise<Manager> {
 manager.password = await this.passwordHasher.hashPassword(manager.password);
    try {
      // create the new user
      const savedUser = await this.managerRepository.create(manager);
      delete savedUser.password; //delete password before returning to client

      return savedUser;
    } catch (error) {
      // MongoError 11000 duplicate key
      if (error.code === 11000 && error.errmsg.includes('index: uniqueEmail')) {
        throw new HttpErrors.Conflict('Email value is already taken');
      } else {
        throw error;
      }
    }
  }

  @get('/managers/count', {
    responses: {
      '200': {
        description: 'Manager model count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async count(
    @param.query.object('where', getWhereSchemaFor(Manager)) where?: Where<Manager>,
  ): Promise<Count> {
    return this.managerRepository.count(where);
  }

  @get('/managers', {
    responses: {
      '200': {
        description: 'Array of Manager model instances',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Manager)},
          },
        },
      },
    },
  })
  async find(
    @param.query.object('filter', getFilterSchemaFor(Manager)) filter?: Filter<Manager>,
  ): Promise<Manager[]> {
    return this.managerRepository.find(filter);
  }

  @patch('/managers', {
    responses: {
      '200': {
        description: 'Manager PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Manager, {partial: true}),
        },
      },
    })
    manager: Manager,
    @param.query.object('where', getWhereSchemaFor(Manager)) where?: Where<Manager>,
  ): Promise<Count> {
    return this.managerRepository.updateAll(manager, where);
  }

  @get('/managers/{id}', {
    responses: {
      '200': {
        description: 'Manager model instance',
        content: {'application/json': {schema: getModelSchemaRef(Manager)}},
      },
    },
  })
  async findById(@param.path.string('id') id: string): Promise<Manager> {
    return this.managerRepository.findById(id);
  }

  @patch('/managers/{id}', {
    responses: {
      '204': {
        description: 'Manager PATCH success',
      },
    },
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Manager, {partial: true}),
        },
      },
    })
    manager: Manager,
  ): Promise<void> {
    await this.managerRepository.updateById(id, manager);
  }

  @put('/managers/{id}', {
    responses: {
      '204': {
        description: 'Manager PUT success',
      },
    },
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() manager: Manager,
  ): Promise<void> {
    await this.managerRepository.replaceById(id, manager);
  }

  @del('/managers/{id}', {
    responses: {
      '204': {
        description: 'Manager DELETE success',
      },
    },
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.managerRepository.deleteById(id);
  }
}
