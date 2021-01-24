import { Field, ID, ObjectType } from '@nestjs/graphql';

import { Node } from '../../relay/node.interface';
import { EdgeType } from '../../relay/edge.generic';
import { ConnectionType } from '../../relay/connection.generic';

@ObjectType('User', { implements: Node })
export class UserGraphModel implements Node {
  @Field(_type => ID)
  id: string;

  @Field(_type => String)
  email: string;
}

@ObjectType('UserEdge')
export class UserEdgeGraphModel extends EdgeType<UserGraphModel>(
  UserGraphModel,
) {}

@ObjectType('UserConnection')
export class UserConnectionGraphModel extends ConnectionType<any>(
  UserEdgeGraphModel,
) {}
