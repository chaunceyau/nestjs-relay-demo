import {
  Args,
  Context,
  ID,
  Info,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { GraphQLResolveInfo } from 'graphql';
import {
  connectionFromPromisedArray,
  fromGlobalId,
  toGlobalId,
} from 'graphql-relay';
import { prisma } from 'src/main';
import { ConnectionArguments } from 'src/relay/connection.args';
import { connectionFromRepository } from 'src/relay/connection.factory';
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
    const company = await ctx.companyLoader.load(['']);
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
    
    console.log('COMPANIES', input);

    let cursor;

    if (input.after) {
      cursor = parseInt(fromGlobalId(input.after).id);
    } else if (input.before) {
      cursor = parseInt(fromGlobalId(input.before).id);
    }

    console.log('cursor', cursor);
    if (cursor) {
      Object.assign(findManyArgs, {
        cursor: {
          id: cursor,
        },
      });
    }

    return connectionFromPromisedArray(
      prisma.company.findMany(findManyArgs),
      { first: 1 },
      // ctx.companyLoader.loadMany([1, 2, 3]),
      // {},
    );
    // return connectionFromRepository({}, ctx.companyLoader.load([1]));
    // return connectionFromPromisedArray(ctx.companyLoader.load([1,2,3]), {
    //   first: 5,
    // });
  }

  @ResolveField(_returns => UserConnectionGraphModel)
  async users(@Context() ctx: any, @Parent() company: CompanyGraphModel) {
    return connectionFromPromisedArray(
      ctx.companiesUsersLoader.load(company.id),
      {}, // { first: 1 },
    );
  }

  @ResolveField(_type => ID)
  id(@Parent() parent: UserGraphModel, @Info() info: GraphQLResolveInfo) {
    return toGlobalId(info.path.typename, parent.id);
  }
}
// const company = ctx.companyLoader.load(['ckbggxwyj000101ldbvz86dnb']);
// const companies = await prisma.company.findMany({
//   where: {
//     id: { in: ['ckbggxwyj000101ldbvz86dnb', 'ckdujtmma000001l6fu7faxhp'] },
//   },
// });
