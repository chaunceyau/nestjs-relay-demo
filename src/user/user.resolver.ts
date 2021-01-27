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
import { connectionFromPromisedArray, toGlobalId } from 'graphql-relay';
import { GraphQLResolveInfo } from 'graphql';
//
import { prisma } from '../main';
// import { POSTS } from '../data';
import { ConnectionArguments } from '../relay/connection.args';
import { connectionFromRepository } from '../relay/connection.factory';
//
import { UserService } from './user.service';
import { UserGraphModel, UserConnectionGraphModel } from './models/user.model';

@Resolver(_of => UserGraphModel)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Query(_type => UserGraphModel)
  async user(@Args('id') id: number, @Context() ctx) {
    return await this.userService.findOneById(id);
  }

  @Query(_type => UserConnectionGraphModel)
  async users(@Args('input') input: ConnectionArguments, @Context() ctx: any) {
    return connectionFromPromisedArray(
      prisma.user.findMany({ take: input.first }),
      {},
    );
    // return []
  }

  @ResolveField(_type => ID)
  id(@Parent() parent: UserGraphModel, @Info() info: GraphQLResolveInfo) {
    console.log(
      'resolving id',
      info.parentType.name,
      parent.id,
      toGlobalId(info.parentType.name, parent.id),
    );
    return toGlobalId(info.parentType.name, parent.id);
  }

  // @ResolveField(_type => [PostGraphModel])
  // posts(@Parent() parent: UserGraphModel) {
  //   return POSTS.filter(post => post.authorId !== parent.id);
  // }
}
