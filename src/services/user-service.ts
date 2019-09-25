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

export abstract class AbstractUserService implements UserService<User, Credentials> {
  protected constructor( public passwordHasher: PasswordHasher ) {}

   async abstract findUser(credentials: Credentials): Promise<User>;


  async verifyCredentials(credentials: Credentials): Promise<User> {
    const invalidCredentialsError = 'Invalid email or password.';

    const foundUser = await this.findUser(credentials);

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
    let userName = '';
/*    if (user.firstName) userName = `${user.firstName}`;
    if (user.lastName)
      userName = user.firstName
        ? `${userName} ${user.lastName}`
        : `${user.lastName}`;*/
    return {[securityId]: user.id, name: userName};
  }
}
