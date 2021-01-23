import {
  Args,
  Context,
  Field,
  GqlExecutionContext,
  ID,
  InputType,
  Int,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
//
import { UserService } from './user.service';
import {
  UserGraphModel,
  UserConnectionGraphModel,
  FindUserInput,
  PostGraphModel,
} from './models/user.model';
import {
  ConnectionArguments,
  ConnectionCursor,
  connectionFromArray,
  fromGlobalId,
  toGlobalId,
} from 'graphql-relay';
import { Type } from 'class-transformer';
import { Reflector } from '@nestjs/core';
import { ArgumentMetadata, ExecutionContext, UseGuards } from '@nestjs/common';
import { getArgumentValues } from 'graphql/execution/values';
import { extractMetadata } from '@nestjs/graphql/dist/utils';

// @InputType()
// class Inpiut implements ConnectionArguments {
//   @Field(_returns => ConnectionCursor)
//   before?: ConnectionCursor;
//   @Field(_returns => ConnectionCursor)
//   after?: ConnectionCursor;
//   @Field(_returns => Int, { nullable: true })
//   first?: number;
//   @Field(_returns => Int)
//   last?: number;
// }

const POSTS = [
  {
    id: '3833cae1-47ad-48e5-8808-0e4d14a4dc2a',
    title: 'voluptatem ex et',
    authorId: '2b248314-a41d-4247-9222-3eb454dece6c',
  },
  {
    id: '7b84ac5c-d404-489f-b757-f79544ebc9d5',
    title: 'et est odio',
    authorId: 'b534b6fb-f5ac-4792-9a17-4af6c9ace08b',
  },
  {
    id: 'd6233fee-9973-4575-896c-3a7294d7652d',
    title: 'eum in ipsa',
    authorId: 'fbdad3dd-03d7-471d-a57b-00234cf7e537',
  },
  {
    id: '92b05fae-a1e1-4fa6-9d10-57051279f282',
    title: 'odit voluptas et',
    authorId: 'd8fcb073-bfdb-4f07-899f-43cae2019e73',
  },
  {
    id: 'da79a6b5-3e53-4f93-850f-a2251ebb8dc8',
    title: 'quia reiciendis magni',
    authorId: 'a9c12993-6c2e-44a6-9988-dc640d45663c',
  },
  {
    id: 'e0a7fbd7-ee78-4f4a-8f4b-ffcef014a370',
    title: 'neque sit incidunt',
    authorId: '08b1bd4c-f799-4750-8d85-c52bcaead1cf',
  },
  {
    id: '68d07454-df9d-4e71-bf1b-6edc6bfbd8db',
    title: 'fugit exercitationem dolore',
    authorId: 'ffe0f6e0-f21d-499f-8316-dd0c4b78a050',
  },
  {
    id: '9cc88047-f7e6-43f0-8e2c-b8406d5d3602',
    title: 'ut quod quia',
    authorId: '2b248314-a41d-4247-9222-3eb454dece6c',
  },
  {
    id: '0678388b-1d34-4a73-addf-a9fb16897ab1',
    title: 'iste molestiae ad',
    authorId: 'a9042463-eaa8-4f5a-8062-7e7ba5e10d9f',
  },
];

@Resolver(_of => UserGraphModel)
export class UserResolver {
  constructor(
    private readonly userService: UserService,
    private reflector: Reflector,
  ) {}

  @Query(_type => UserGraphModel)
  async user(@Args('id') id: string, @Context() ctx) {
    // console.log(Reflect.getOwnMetadata(TEST, UserGraphModel.constructor));
    // console.log(this.reflector.get(TEST, UserGraphModel.constructor));
    // const exec = GqlExecutionContext.create(ctx);
    // potentialkeys.forEach(k =>
    //   console.log(
    //     k,
    //     this.reflector.get(k, ctx.getHandler),
    //     // this.reflector.get(k, exec.get.getHandler()),
    //   ),
    // );

    return await this.userService.findOneById(id);
  }

  @ResolveField(_type => [PostGraphModel])
  posts(@Parent() parent: UserGraphModel) {
    // this.prisma.posts.find({ where : { authorId: parent.id}})

    //db - get posts for parent.id user

    return POSTS.filter(post => post.authorId !== parent.id);
  }

  @Query(_type => [UserGraphModel])
  // users(@Args('input') input: Inpiut): UserConnectionGraphModel {
  async users(@Context() ctx: any): Promise<UserGraphModel[]> {
    // console.log(
    //   await ctx.userLoader.loadMany([
    //     'ckbgj6qoa00010nun2hh961p9',
    //     'ckbgmm1wv00000nyz68xj8m0l',
    //   ]),
    // );
    return []; //res.edges.map(({ node }) => ({ ...node }));
  }

  // const res = this.userService.findAll({
  //   // last: input.last,
  //   // before: input.before,
  //   first: 5,
  // });

  // db - grab all the users

  // return connectionFromArray(res.edges, {});

  @ResolveField(_type => ID)
  id(@Parent() parent: UserGraphModel, @Context() ctx: GqlExecutionContext) {
    // console.log(Reflect.getOwnMetadata(TEST, UserGraphModel.constructor));
    // console.log(parent.constructor.);
    // console.log(this.reflector.get(UserGraphModel, ctx.getType()));
    // console.log(this.reflector.get('design:name', UserGraphModel));

    return toGlobalId(
      UserGraphModel.name.substr(0, UserGraphModel.name.length - 10),
      parent.id,
    );
  }

  @ResolveField(_type => ID)
  name(@Parent() parent: UserGraphModel) {
    return parent.name;
  }
}

const potentialkeys = [
  'graphql:resolver_name',
  'graphql:resolver_type',
  'graphql:resolve_property',
  'graphql:delegate_property',
  'graphql:scalar_name',
  'graphql:scalar_type',
  'graphql:plugin',
  '__routeArguments__',
  'graphql:subscription_options',
  'graphql:class_type',
  '__resolveType',
  'GqlModuleOptions',
  'GqlModuleId',
  'Subscription',
];
