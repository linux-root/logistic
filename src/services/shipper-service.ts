import {AbstractUserService} from './user-service';
import {repository} from '@loopback/repository';
import {ShipperRepository} from '../repositories';
import {Credentials, User} from '../models';
import {inject} from '@loopback/context';
import {PasswordHasherBindings} from '../keys';
import {PasswordHasher} from './hash.password.bcryptjs';

export default class ShipperService extends AbstractUserService {
  constructor(
    @inject(PasswordHasherBindings.PASSWORD_HASHER)
    public passwordHasher: PasswordHasher,
    @repository(ShipperRepository) public shipperRepository: ShipperRepository
  ) {
    super(passwordHasher);
  }

  async findUser(credentials: Credentials): Promise<User> {
  const shipper = await this.shipperRepository.findOne({
      where: {email: credentials.email}
    });

  if(shipper != null){
    return new User({
      id: shipper.id,
      email: shipper.email,
      full_name:shipper.full_name,
      password: shipper.password,
      phone: shipper.phone });
  }
    return new User();
  }
}