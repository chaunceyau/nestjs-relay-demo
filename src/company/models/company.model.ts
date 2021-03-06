import { Field, ID, ObjectType } from '@nestjs/graphql';
//
import { Node } from '../../relay/node.interface';
import { EdgeType } from '../../relay/edge.generic';
import { ConnectionType } from '../../relay/connection.generic';
import { Company } from '@prisma/client';

@ObjectType('Company', { implements: () => [Node] })
export class CompanyGraphModel implements Node {
  @Field(_type => ID)
  id: string;

  @Field(_type => String)
  title: string;

  constructor(partial: Partial<Company>) {
    Object.assign(this, partial);
  }
}

@ObjectType('CompanyEdge')
export class CompanyEdgeGraphModel extends EdgeType<CompanyGraphModel>(
  CompanyGraphModel,
) {}

@ObjectType('CompanyConnection')
export class CompanyConnectionGraphModel extends ConnectionType<any>(
  CompanyEdgeGraphModel,
) {}
