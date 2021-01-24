import { Module } from '@nestjs/common';
//
import { UserModule } from 'src/user/user.module';
import { CompanyModule } from 'src/company/company.module';
import { GraphQLModule } from '@nestjs/graphql';
import { join } from 'path';

@Module({
  imports: [
    CompanyModule,
    UserModule,
    GraphQLModule.forRoot({
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
    }),
  ],
})
export class AppModule {}
