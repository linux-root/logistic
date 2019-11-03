// Copyright IBM Corp. 2019. All Rights Reserved.
// Node module: @loopback/authentication
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
import {HttpErrors} from '@loopback/rest';
import {Credentials} from '../models';
import {User} from '../models';
import {UserService} from '@loopback/authentication';
import {UserProfile, securityId} from '@loopback/security';
import {PasswordHasher} from './hash.password.bcryptjs';
import {UserRepository} from '../repositories';
import {repository} from '@loopback/repository';
import {PasswordHasherBindings} from '../keys';
import {inject} from '@loopback/context';

export class LogisticUserService implements UserService<User, Credentials> {
  public constructor(
    @inject(PasswordHasherBindings.PASSWORD_HASHER)
    public passwordHasher: PasswordHasher,
    @repository(UserRepository)
    public userRepository: UserRepository
  ) {}

  async verifyCredentials(credentials: Credentials): Promise<User> {
    const invalidCredentialsError = 'Invalid email or password.';

    const foundUser = await this.userRepository.findOne({where: {email: credentials.email}});

    if (!foundUser) {
      throw new HttpErrors.Unauthorized(invalidCredentialsError);
    }
    const passwordMatched = await this.passwordHasher.comparePassword(
      credentials.password,
      foundUser.password,
    );

    if (!passwordMatched) {
      throw new HttpErrors.Unauthorized(invalidCredentialsError);
    }

    return foundUser;
  }

  convertToUserProfile(user: User): UserProfile {
    // since first name and lastName are optional, no error is thrown if not provided

    return {[securityId]: user.id, name: user.full_name, is_manager: user.is_manager};
  }
}
