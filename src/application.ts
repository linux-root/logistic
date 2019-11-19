import {BootMixin} from '@loopback/boot';
import {ApplicationConfig} from '@loopback/core';
import {
  RestExplorerBindings,
  RestExplorerComponent,
} from '@loopback/rest-explorer';
import {RepositoryMixin} from '@loopback/repository';
import {RestApplication} from '@loopback/rest';
import {ServiceMixin} from '@loopback/service-proxy';
import * as path from 'path';
import {MySequence} from './sequence';
import {AuthenticationComponent, registerAuthenticationStrategy} from '@loopback/authentication';
import {
  PasswordHasherBindings,
  PusherServiceBinding, PusherServiceConstant,
  TokenServiceBindings,
  TokenServiceConstants,
  UserServiceBindings,
} from './keys';
import {JWTService} from './services/jwt-service';
import {BcryptHasher} from './services/hash.password.bcryptjs';
import {LogisticUserService} from './services/user-service';
import {JWTAuthenticationStrategy} from './authentication-strategies/jwt-strategy';
import {PusherService} from './services/PusherService';
export class LogisticApplication extends BootMixin( ServiceMixin(RepositoryMixin(RestApplication))) {
  constructor(options: ApplicationConfig = {}) {
    super(options);
    registerAuthenticationStrategy(this, JWTAuthenticationStrategy);
    this.setUpBindings();

    // Set up the custom sequence
    this.sequence(MySequence);

    // Set up default home page
    this.static('/', path.join(__dirname, '../public'));

    // Customize @loopback/rest-explorer configuration here
    this.bind(RestExplorerBindings.CONFIG).to({
      path: '/explorer',
    });
    this.component(AuthenticationComponent);
    this.component(RestExplorerComponent);


    this.projectRoot = __dirname;
    // Customize @loopback/boot Booter Conventions here
    this.bootOptions = {
      controllers: {
        // Customize ControllerBooter Conventions here
        dirs: ['controllers'],
        extensions: ['.controller.js'],
        nested: true,
      },
    };
  }

  setUpBindings(): void {
    this.bind(TokenServiceBindings.TOKEN_SECRET).to(
      TokenServiceConstants.TOKEN_SECRET_VALUE,
    );

    this.bind(TokenServiceBindings.TOKEN_EXPIRES_IN).to(
      TokenServiceConstants.TOKEN_EXPIRES_IN_VALUE,
    );

    this.bind(TokenServiceBindings.TOKEN_SERVICE).toClass(JWTService);
    // Bind bcrypt hash services - utilized by 'UserController' and 'MyUserService'
    this.bind(PasswordHasherBindings.ROUNDS).to(10);
    this.bind(PasswordHasherBindings.PASSWORD_HASHER).toClass(BcryptHasher);

    this.bind(UserServiceBindings.USER_SERVICE).toClass(LogisticUserService);

    this.bind(PusherServiceBinding.APP_ID).to(PusherServiceConstant.APP_ID);
    this.bind(PusherServiceBinding.KEY).to(PusherServiceConstant.KEY);
    this.bind(PusherServiceBinding.CLUSTER).to(PusherServiceConstant.CLUSTER);
    this.bind(PusherServiceBinding.SECRET).to(PusherServiceConstant.SECRET);
    this.bind(PusherServiceBinding.PUSHER_SERVICE).toClass(PusherService);
  }
}
