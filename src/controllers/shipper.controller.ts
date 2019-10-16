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
import {Credentials, Shipper, User} from '../models';
import {ShipperRepository} from '../repositories';
import {inject} from '@loopback/core';
import {PasswordHasherBindings, TokenServiceBindings, UserServiceBindings} from '../keys';
import {PasswordHasher} from '../services/hash.password.bcryptjs';
import {CredentialsRequestBody} from './specs/user-controller.specs';
import {
  UserService,
  TokenService
} from '@loopback/authentication';

export class ShipperController {
  constructor(
    @repository(ShipperRepository) public shipperRepository : ShipperRepository,
    @inject(TokenServiceBindings.TOKEN_SERVICE) public jwtService: TokenService,
    @inject(PasswordHasherBindings.PASSWORD_HASHER) public passwordHasher: PasswordHasher,
    @inject(UserServiceBindings.SHIPPER_SERVICE) public userService: UserService<User, Credentials>
  ) {}

  @post('/shippers', {
    responses: {
      '200': {
        description: 'Shipper model instance',
        content: {'application/json': {schema: getModelSchemaRef(Shipper)}},
      },
    },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Shipper, {exclude: ['id']}),
        },
      },
    })
    shipper: Omit<Shipper, 'id'>,
  ): Promise<Shipper> {

    // encrypt the password
    // eslint-disable-next-line require-atomic-updates
    shipper.password = await this.passwordHasher.hashPassword(shipper.password);

    try {
      // create the new user
      const savedUser = await this.shipperRepository.create(shipper);
      delete savedUser.password;

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

  @get('/shippers/count', {
    responses: {
      '200': {
        description: 'Shipper model count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async count(
    @param.query.object('where', getWhereSchemaFor(Shipper)) where?: Where<Shipper>,
  ): Promise<Count> {
    return this.shipperRepository.count(where);
  }

  @get('/shippers', {
    responses: {
      '200': {
        description: 'Array of Shipper model instances',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Shipper)},
          },
        },
      },
    },
  })
  async find(
    @param.query.object('filter', getFilterSchemaFor(Shipper)) filter?: Filter<Shipper>,
  ): Promise<Shipper[]> {
    return this.shipperRepository.find(filter);
  }

  @patch('/shippers', {
    responses: {
      '200': {
        description: 'Shipper PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Shipper, {partial: true}),
        },
      },
    })
    shipper: Shipper,
    @param.query.object('where', getWhereSchemaFor(Shipper)) where?: Where<Shipper>,
  ): Promise<Count> {
    return this.shipperRepository.updateAll(shipper, where);
  }

  @get('/shippers/{id}', {
    responses: {
      '200': {
        description: 'Shipper model instance',
        content: {'application/json': {schema: getModelSchemaRef(Shipper)}},
      },
    },
  })
  async findById(@param.path.string('id') id: string): Promise<Shipper> {
    return this.shipperRepository.findById(id);
  }

  @patch('/shippers/{id}', {
    responses: {
      '204': {
        description: 'Shipper PATCH success',
      },
    },
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Shipper, {partial: true}),
        },
      },
    })
    shipper: Shipper,
  ): Promise<void> {
    await this.shipperRepository.updateById(id, shipper);
  }

  @put('/shippers/{id}', {
    responses: {
      '204': {
        description: 'Shipper PUT success',
      },
    },
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() shipper: Shipper,
  ): Promise<void> {
    await this.shipperRepository.replaceById(id, shipper);
  }

  @del('/shippers/{id}', {
    responses: {
      '204': {
        description: 'Shipper DELETE success',
      },
    },
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.shipperRepository.deleteById(id);
  }

  @post('/shippers/login', {
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
}
