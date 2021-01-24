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
import { toGlobalId } from 'graphql-relay';
import { prisma } from '../main';
//
import { UserGraphModel } from '../user/models/user.model';
import { CompanyGraphModel } from './models/company.model';

@Resolver(_of => CompanyGraphModel)
export class CompanyResolver {
  @Query(_type => CompanyGraphModel)
  async company(@Context() ctx: any) {
    const company = await ctx.companyLoader.load(['']);
    return company;
  }

  @Query(_type => [CompanyGraphModel])
  async companies(@Context() ctx: any) {
    return ctx.companyLoader.load([
      'ckbggxwyj000101ldbvz86dnb',
      'ckdujtmma000001l6fu7faxhp',
    ]);
  }

  @ResolveField(returns => [UserGraphModel])
  users(@Context() ctx: any, @Parent() company: CompanyGraphModel) {
    return ctx.companiesUsersLoader.load(company.id);
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
