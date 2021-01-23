import {
  Args,
  Context,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
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
    // const company = ctx.companyLoader.load(['ckbggxwyj000101ldbvz86dnb']);
    const companies = await prisma.company.findMany({
      where: {
        id: { in: ['ckbggxwyj000101ldbvz86dnb', 'ckdujtmma000001l6fu7faxhp'] },
      },
    });

    return companies.map(c => ({
      id: c.id,
      title: c.title,
    }));
  }

  @ResolveField(returns => [UserGraphModel])
  users(@Context() ctx: any, @Parent() company: CompanyGraphModel) {
    // return [{ id: '123', name: '1234lm' }];
    return ctx.companiesUsersLoader.load(company.id);
  }
}
