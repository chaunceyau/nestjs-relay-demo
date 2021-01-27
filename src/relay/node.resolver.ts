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
  Int,
} from '@nestjs/graphql';

import { Node } from './node.interface';
import { prisma } from 'src/main';
import { UserGraphModel } from 'src/user/models/user.model';
import { CompanyGraphModel } from 'src/company/models/company.model';

@Resolver(() => Node)
export class NodeResolver {
  @ResolveField()
  globalId(
    @Root() { id }: { id: string },
    @Info() { parentType: { name } }: { parentType: { name: string } },
  ): string {
    return toGlobalId(name, id);
  }

  private async fetcher(globalId: string): Promise<Node | undefined> {
    console.log({ globalId });
    const { type, id } = fromGlobalId(globalId);

    // if (!repository) {
    //   throw new UserInputError(
    //     `Could not resolve to a node with the global ID of '${globalId}'`,
    //   );
    // }
    const idn = parseInt(id);
    console.log('FETCHER');
    switch (type) {
      case 'Company': {
        const company = await prisma.company.findUnique({ where: { id: idn } });
        return new CompanyGraphModel(company);
        // return { id: company.id.toString() };
        // return { id: toGlobalId('Company', company.id.toString()) };
      }
      default:
      case 'User': {
        const user = await prisma.user.findUnique({ where: { id: idn } });
        return new UserGraphModel(user);
        // return { id: user.id.toString() };
      }
    }
  }

  // TODO: use dataloader
  @Query(() => Node, {
    nullable: true,
    description: 'Fetches an object given its global ID.',
  })
  async node(
    @Args('id', {
      type: () => ID,
      description: 'The global ID of the object.',
    })
    globalId: string,
    @Ctx() context: any,
  ): ReturnType<NodeResolver['fetcher']> {
    const node = await this.fetcher(globalId);
    return node;
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
    return globalIds.map(id => this.fetcher(id));
  }
}
