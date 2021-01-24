import { join } from 'path';
import DataLoader from 'dataloader';
import { groupBy, map } from 'ramda';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
//
import { prisma } from '../main';
import { UserModule } from '../user/user.module';
import { CompanyModule } from '../company/company.module';

@Module({
  imports: [
    CompanyModule,
    UserModule,
    GraphQLModule.forRoot({
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      context: () => ({
        userLoader: new DataLoader(async (userIds: number[]) => {
          const users = await prisma.user.findMany({
            where: { id: { in: userIds.flat() } },
          });

          const grouped = groupBy(u => u.id.toString(), users);

          return map(userId => grouped[userId], userIds.flat());
        }),
        companiesUsersLoader: new DataLoader(async (companyIds: number[]) => {
          const users = await prisma.user.findMany({
            where: { companyId: { in: companyIds.flat() } },
          });

          // console.log({ users });

          const grouped = groupBy(u => u.companyId, users);

          return map(companyId => grouped[companyId], companyIds.flat());
        }),
        companyLoader: new DataLoader(async (companyIds: number[]) => {
          const companies = await prisma.company.findMany({
            where: { id: { in: companyIds.flat() } },
          });

          const grouped = groupBy(u => u.id.toString(), companies);

          return map(companyId => grouped[companyId], companyIds.flat());
        }),
      }),
    }),
  ],
})
export class AppModule {}
