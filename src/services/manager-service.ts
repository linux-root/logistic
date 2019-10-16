import {AbstractUserService} from './user-service';
import {repository} from '@loopback/repository';
import {ManagerRepository} from '../repositories';
import {Credentials, User} from '../models';
import {inject} from '@loopback/context';
import {PasswordHasherBindings} from '../keys';
import {PasswordHasher} from './hash.password.bcryptjs';

export default class ManagerService extends AbstractUserService {
  constructor(
    @inject(PasswordHasherBindings.PASSWORD_HASHER)
    public passwordHasher: PasswordHasher,
    @repository(ManagerRepository) public managerRepository: ManagerRepository
  ) {
    super(passwordHasher);
  }

  async findUser(credentials: Credentials): Promise<User> {
/*  const manager = await this.managerRepository.findOne({
      where: {email: credentials.email}
    });

  if(manager != null){
    return new User({
      id: manager.id,
      email: manager.email,
      full_name:manager.full_name,
      password: manager.password,
      phone: manager.phone });
  }*/
    return new User();
  }
}