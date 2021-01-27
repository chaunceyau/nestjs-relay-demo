import { ConnectionCursor, connectionDefinitions, Edge } from 'graphql-relay';
import { Field, ObjectType } from '@nestjs/graphql';
import { Type } from '@nestjs/common';

export function EdgeType<N>(NodeType: Type<N>): any {

  @ObjectType({ isAbstract: true })
  abstract class EdgeClass implements Edge<N> {
    @Field(() => NodeType, {
      description: 'The item at the end of the edge.',
    })
    readonly node!: N;

    @Field(() => String, { description: 'A cursor for use in pagination.' })
    readonly cursor!: ConnectionCursor;
  }

  return EdgeClass;
}
