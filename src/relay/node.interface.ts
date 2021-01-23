import { Field, ID, InterfaceType } from '@nestjs/graphql';

@InterfaceType({ description: 'An object with a global ID.' })
export abstract class Node {
  @Field(() => ID, {
    name: 'id',
    description: 'The global ID of the object.',
  })
  readonly id!: string;
}
