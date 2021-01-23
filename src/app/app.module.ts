import { Module } from '@nestjs/common';
//
import { UserModule } from 'src/user/user.module';
import { CompanyModule } from 'src/company/company.module';
import { GraphQLModule } from '@nestjs/graphql';

@Module({
  imports: [
    CompanyModule,
    UserModule,
    GraphQLModule.forRoot({ autoSchemaFile: true }),
  ],
})
export class AppModule {}
