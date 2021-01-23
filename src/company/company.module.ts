import { Module } from '@nestjs/common';
import { CompanyResolver } from './company.resolver';

@Module({
  providers: [CompanyResolver]
})
export class CompanyModule {}
