import { UserInputError } from 'apollo-server-express';
import { fromGlobalId, toGlobalId } from 'graphql-relay';
import {
  Args,
  Context as Ctx,
  ResolveField,
  ID,
  Info,
  Query,
  Resolver,
  Root,
} from '@nestjs/graphql';

import { Node } from './node.interface';

@Resolver(() => Node)
export class NodeResolver {
  @ResolveField()
  globalId(
    @Root() { id }: { id: string },
    @Info() { parentType: { name } }: { parentType: { name: string } },
  ): string {
    return toGlobalId(name, id);
  }

  private async fetcher(
    globalId: string,
    { repositories }: any,
  ): Promise<Node | undefined> {
    const { type, id } = fromGlobalId(globalId);

    const repository = repositories[type];

    if (!repository) {
      throw new UserInputError(
        `Could not resolve to a node with the global ID of '${globalId}'`,
      );
    }

    return await repository.findOne(id);
  }

  // TODO: use dataloader
  @Query(() => Node, {
    nullable: true,
    description: 'Fetches an object given its global ID.',
  })
  node(
    @Args('id', {
      type: () => ID,
      description: 'The global ID of the object.',
    })
    globalId: string,
    @Ctx() context: any,
  ): ReturnType<NodeResolver['fetcher']> {
    return this.fetcher(globalId, context);
  }

  @Query(() => [Node], {
    nullable: 'items',
    description: 'Fetches objects given their global IDs.',
  })
  nodes(
    @Args('ids', {
      type: () => [ID],
      description: 'The global IDs of the objects.',
    })
    globalIds: Array<string>,
    @Ctx() context: any,
  ): Array<ReturnType<NodeResolver['fetcher']>> {
    return globalIds.map(id => this.fetcher(id, context));
  }
}
