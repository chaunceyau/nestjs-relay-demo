import { Field, ID, ObjectType } from '@nestjs/graphql';
import { UserGraphModel } from 'src/user/models/user.model';
//
import { Node } from '../../relay/node.interface';

@ObjectType('Company', { implements: Node })
export class CompanyGraphModel implements Node {
  @Field(_type => ID)
  id: string;

  @Field(_type => String)
  title: string;

  // @Field(_type => [UserGraphModel])
  // users: UserGraphModel[];
}

// @ObjectType('UserConnection')
// export class UserConnectionGraphModel extends Connection(UserGraphModel) {}
