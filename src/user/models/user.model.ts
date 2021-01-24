import { ConnectionArguments } from 'graphql-relay';
import { Field, ID, InputType, Int, ObjectType } from '@nestjs/graphql';

import { Node } from '../../relay/node.interface';
import { ConnectionType } from '../../relay/connection.generic';
import { EdgeType } from 'src/relay/edge.generic';

@ObjectType('User', { implements: Node })
export class UserGraphModel implements Node {
  @Field(_type => ID)
  id: string;

  @Field(_type => String)
  name: string;
}

@ObjectType('UserEdge')
export class UserEdgeGraphModel extends EdgeType<UserGraphModel>(
  UserGraphModel,
) {}

@InputType()
export class FindUserInput implements ConnectionArguments {
  @Field(_type => Int, { nullable: true })
  first?: number;
  @Field(_type => Int, { nullable: true })
  last?: number;
  @Field(_type => String, { nullable: true })
  after?: string;
  @Field(_type => String, { nullable: true })
  before?: string;
}

@ObjectType('UserConnection')
export class UserConnectionGraphModel extends ConnectionType<any>(
  UserEdgeGraphModel,
) {}
