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
import {ManagerRepository} from '../repositories';

import {validateCredentials} from '../services/validator';
import {inject} from '@loopback/core';
import {
  authenticate,
  TokenService,
  UserService,
} from '@loopback/authentication';
import {UserProfile, securityId, SecurityBindings} from '@loopback/security';
import {Credentials} from '../models';
import {PasswordHasher} from '../services/hash.password.bcryptjs';
import {CredentialsRequestBody, UserProfileSchema} from './specs/user-controller.specs'

import {
  TokenServiceBindings,
  PasswordHasherBindings,
  UserServiceBindings,
} from '../keys';
import * as _ from 'lodash';

export class ManagerController {
  constructor(
    @repository(ManagerRepository)
    public managerRepository : ManagerRepository,
    @inject(PasswordHasherBindings.PASSWORD_HASHER)
    public passwordHasher: PasswordHasher,
    @inject(TokenServiceBindings.TOKEN_SERVICE)
    public jwtService: TokenService,
    @inject(UserServiceBindings.MANAGER_SERVICE)
    public userService: UserService<User, Credentials>,
  ) {}

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

  @post('/managers/login', {
    responses: {
      '200': {
        description: 'Token',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                token: {
                  type: 'string',
                },
              },
            },
          },
        },
      },
    },
  })
  async login(@requestBody(CredentialsRequestBody) credentials: Credentials,): Promise<{token: string}> {
    // ensure the user exists, and the password is correct
    const user = await this.userService.verifyCredentials(credentials);

    // convert a User object into a UserProfile object (reduced set of properties)
    const userProfile = this.userService.convertToUserProfile(user);

    // create a JSON Web Token based on the user profile
    const token = await this.jwtService.generateToken(userProfile);

    return {token};
  }

  @get('/managers/me', {
    responses: {
      '200': {
        description: 'The current user profile',
        content: {
          'application/json': {
            schema: UserProfileSchema,
          },
        },
      },
    },
  })
  @authenticate('jwt')
  async printCurrentUser(
    @inject(SecurityBindings.USER)
      currentUserProfile: UserProfile,
  ): Promise<UserProfile> {
    // (@jannyHou)FIXME: explore a way to generate OpenAPI schema
    // for symbol property
    currentUserProfile.id = currentUserProfile[securityId];
    delete currentUserProfile[securityId];
    return currentUserProfile;
  }
}
