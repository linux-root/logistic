// Copyright IBM Corp. 2019. All Rights Reserved.
// Node module: @loopback/authentication
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
import {PusherServiceBinding} from '../keys';
import {inject} from '@loopback/context';
import Pusher = require('pusher');

export class PusherService{
  public channelClient : Pusher;

  public constructor (@inject(PusherServiceBinding.APP_ID) public appId: string, @inject(PusherServiceBinding.KEY) key: string,
                     @inject(PusherServiceBinding.SECRET) secret : string, @inject(PusherServiceBinding.CLUSTER) cluster: string) {
     this.channelClient = new Pusher({
      appId: appId,
      key: key,
      secret: secret,
      cluster: cluster,
      useTLS: true
    });
  }

}
