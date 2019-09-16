import {inject} from '@loopback/core';
import {juggler} from '@loopback/repository';
import * as config from './logistic.datasource.json';

export class LogisticDataSource extends juggler.DataSource {
  static dataSourceName = 'logistic';

  constructor(
    @inject('datasources.config.logistic', {optional: true})
    dsConfig: object = config,
  ) {
    super(dsConfig);
  }
}
