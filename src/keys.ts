// Copyright IBM Corp. 2019. All Rights Reserved.
// Node module: loopback4-example-shopping
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import {BindingKey} from '@loopback/context';
import {PasswordHasher} from './services/hash.password.bcryptjs';
import {TokenService, UserService} from '@loopback/authentication';
import {User,Credentials} from './models';
import {PusherService} from './services/PusherService';

export namespace TokenServiceConstants {
  export const TOKEN_SECRET_VALUE = 'myjwts3cr3t';
  export const TOKEN_EXPIRES_IN_VALUE = '6000';
}

export namespace PusherServiceConstant{
  export const APP_ID = '901310';
  export const KEY = '7cbcf0b5e0b8ed0bcc80';
  export const SECRET = '3c4f03a21a92fd0cc477';
  export const CLUSTER = 'ap1';
}

export namespace PusherServiceBinding{
  export const APP_ID = BindingKey.create<String>(
    'pusher.api_id'
  );
  export const KEY = BindingKey.create<String>(
    'pusher.key'
  );
  export const SECRET = BindingKey.create<String>(
    'pusher.secret'
  );
  export const CLUSTER = BindingKey.create<String>(
    'pusher.cluster'
  );
}

export namespace PusherServiceBinding {
  export const PUSHER_SERVICE = BindingKey.create<PusherService>(
    'services.pusher'
  );
}

export namespace TokenServiceBindings {
  export const TOKEN_SECRET = BindingKey.create<string>(
    'authentication.jwt.secret',
  );
  export const TOKEN_EXPIRES_IN = BindingKey.create<string>(
    'authentication.jwt.expires.in.seconds',
  );
  export const TOKEN_SERVICE = BindingKey.create<TokenService>(
    'services.authentication.jwt.tokenservice',
  );
}

export namespace PasswordHasherBindings {
  export const PASSWORD_HASHER = BindingKey.create<PasswordHasher>(
    'services.hasher',
  );
  export const ROUNDS = BindingKey.create<number>('services.hasher.round');
}

export namespace UserServiceBindings {
  export const USER_SERVICE = BindingKey.create<UserService<User, Credentials>>(
    'services.user.service',
  );
  export const MANAGER_SERVICE = BindingKey.create<UserService<User, Credentials>>(
    'services.manager.service',
  );
  export const SHIPPER_SERVICE = BindingKey.create<UserService<User, Credentials>>(
    'services.shipper.service',
  );
}