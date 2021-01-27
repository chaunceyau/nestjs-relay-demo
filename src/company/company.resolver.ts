import {
  Args,
  Context,
  ID,
  Info,
  Int,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { Prisma } from '@prisma/client';
import { GraphQLResolveInfo } from 'graphql';
import {
  connectionFromArray,
  connectionFromPromisedArray,
  cursorForObjectInConnection,
  cursorToOffset,
  fromGlobalId,
  toGlobalId,
} from 'graphql-relay';
import { prisma } from 'src/main';
import { ConnectionArguments } from 'src/relay/connection.args';
import {
  connectionFromRepository,
  connectionFromRepositoryB,
} from 'src/relay/connection.factory';
//
import {
  UserConnectionGraphModel,
  UserGraphModel,
} from '../user/models/user.model';
import {
  CompanyConnectionGraphModel,
  CompanyGraphModel,
} from './models/company.model';

@Resolver(_of => CompanyGraphModel)
export class CompanyResolver {
  @Query(_type => CompanyGraphModel)
  async company(@Context() ctx: any) {
    const company = await ctx.companyLoader.load(2);
    return company;
  }

  @Query(_type => CompanyConnectionGraphModel)
  async companies(
    @Args('input') input: ConnectionArguments,
    @Context() ctx: any,
  ) {
    const findManyArgs = {
      take: input.first + 1,
    };

    let cursor;

    if (input.after) {
      cursor = parseInt(fromGlobalId(input.after).id);
    } else if (input.before) {
      cursor = parseInt(fromGlobalId(input.before).id);
    }

    if (cursor) {
      Object.assign(findManyArgs, {
        cursor: {
          id: cursor,
        },
      });
    }

    return connectionFromPromisedArray(prisma.company.findMany(findManyArgs), {
      first: findManyArgs.take,
    });
  }

  @ResolveField(_returns => UserConnectionGraphModel)
  async users(
    @Args('cursor', { nullable: true }) cursor: string,
    @Args('first', { type: () => Int, nullable: true }) first: number,
    @Args('last', { type: () => Int, nullable: true }) last: number,
    // @Args('input') input: ConnectionArguments,
    @Context() ctx: any,
    @Parent() company: CompanyGraphModel,
  ) {
    console.log({ cursor });
    return connectionFromRepositoryB({ first, after: cursor }, prisma.user);
    // parseInt(fromGlobalId(company.id)
    const findManyArgs: Prisma.UserFindManyArgs = {
      where: { companyId: parseInt(company.id) },
    };

    if (first) {
      findManyArgs['take'] = first;
      // findManyArgs['take'] = first + 1;
    } else if (last) {
      findManyArgs['take'] = last * -1;
      // findManyArgs['take'] = last * -1 - 1;
    }

    console.log(`fromGlobalId("YXJyYXljb25uZWN0aW9uOjA=")`);
    console.log(fromGlobalId('YXJyYXljb25uZWN0aW9uOjI='));

    if (cursor) {
      console.log('CCURUURURSOOORRR', fromGlobalId(cursor));
      console.log(cursorToOffset(cursor));
      findManyArgs['cursor'] = { id: parseInt(fromGlobalId(cursor).id) };
      // Object.assign(findManyArgs, { cursor });
    }

    console.log({ findManyArgs });

    const connectionArgs = {};

    if (first) {
      connectionArgs['first'] = first;
      if (cursor) {
        connectionArgs['after'] = cursor;
      }
    } else if (last) {
      connectionArgs['last'] = last;
      if (cursor) {
        connectionArgs['before'] = cursor;
      }
    }
    const dbUsers = await prisma.user.findMany(findManyArgs);
    console.log(
      connectionFromArray(
        dbUsers.map(u => new UserGraphModel(u)),
        {
          first,
        },
      ),
    );
    return connectionFromArray(
      dbUsers.map(u => new UserGraphModel(u)),
      {
        first,
      },
    );
    // return connectionFromPromisedArray(
    //   ctx.companiesUsersLoader.load(company.id),
    //   {},
    // );
  }

  @ResolveField(_type => ID)
  id(@Parent() parent: UserGraphModel, @Info() info: GraphQLResolveInfo) {
    return toGlobalId(info.parentType.name, parent.id);
  }
}
