import {Entity, model, property} from '@loopback/repository';

@model({settings: {strict: false}})
export class Goods extends Entity {
  @property({
    type: 'string',
    id: true,
    required: true,
    generated: true,
  })
  id: string;

  @property({
    type: 'string',
  })
  checkpoint_id?: string;

  @property({
    type: 'string',
  })
  customer_name?: string;

  @property({
    type: 'string',
  })
  customer_phone?: string;

  @property({
    type: 'number',
  })
  quantity?: number;

  @property({
    type: 'string',
  })
  status?: string;

  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<Goods>) {
    super(data);
  }
}

export interface GoodsRelations {
  // describe navigational properties here
}

export type GoodsWithRelations = Goods & GoodsRelations;
