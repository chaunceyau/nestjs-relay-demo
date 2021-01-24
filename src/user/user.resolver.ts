import {
  ID,
  Info,
  Args,
  Context,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
//
import { toGlobalId } from 'graphql-relay';
import { GraphQLResolveInfo } from 'graphql';
//
import { prisma } from '../main';
import { POSTS } from '../data';
import { ConnectionArguments } from '../relay/connection.args';
import { connectionFromRepository } from '../relay/connection.factory';
//
import { UserService } from './user.service';
import {
  UserGraphModel,
  UserConnectionGraphModel,
  PostGraphModel,
} from './models/user.model';

@Resolver(_of => UserGraphModel)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Query(_type => UserGraphModel)
  async user(@Args('id') id: string, @Context() ctx) {
    return await this.userService.findOneById(id);
  }

  @Query(_type => UserConnectionGraphModel)
  async users(@Args('input') input: ConnectionArguments, @Context() ctx: any) {
    const res = await connectionFromRepository(input, prisma.user);
    return res;
  }

  @ResolveField(_type => ID)
  id(@Parent() parent: UserGraphModel, @Info() info: GraphQLResolveInfo) {
    return toGlobalId(info.path.typename, parent.id);
  }

  @ResolveField(_type => [PostGraphModel])
  posts(@Parent() parent: UserGraphModel) {
    return POSTS.filter(post => post.authorId !== parent.id);
  }
}
