import { Prisma } from '@prisma/client';
import DataLoader from 'dataloader';
import {
  ConnectionArguments,
  fromGlobalId,
  getOffsetWithDefault,
  offsetToCursor,
  toGlobalId,
} from 'graphql-relay';
import { groupBy, map } from 'ramda';
// 
import { Connection } from './connection.interface';

export async function connectionFromRepository(
  args: ConnectionArguments,
  repository: Prisma.CompanyDelegate,
): Promise<Connection<any>> {
  const { before, after, first, last } = args;

  const totalCount = await repository.count();

  // offsets
  // const beforeOffset = getOffsetWithDefault(before, totalCount);
  // const afterOffset = getOffsetWithDefault(after, -1);

  // records
  const findManyArgs = {
    take: first || last * -1,
  };

  if (before) {
    Object.assign(findManyArgs, {
      cursor: { id: fromGlobalId(before).id },
      // 1 or -1?
      skip: 1,
    });
  } else if (after) {
    Object.assign(findManyArgs, {
      cursor: { id: fromGlobalId(after).id },
      skip: 1,
    });
  }

  // const companyLoader = new DataLoader(async (companyIds: number[]) => {
  //   const findManyArgs = {};

  //   if (companyIds.length > 0) {
  //     Object.assign(findManyArgs, {
  //       where: { id: { in: companyIds.flat() } },
  //     });
  //   }

  //   const companies: any = await repository.findMany(findManyArgs);
  //   const grouped: any = groupBy((u: any) => u.id.toString(), companies);
  //   // console.log('companies', grouped);
  //   // console.log('mapped', map(companyId => grouped[companyId], companyIds.flat()));

  //   return map(companyId => grouped[companyId], companyIds.flat());
  // });

  const entities = await repository.findMany(findManyArgs);

  const edges = entities.map((entity, index) => ({
    cursor: toGlobalId('User', entity.id.toString()),
    node: entity,
  }));

  // page info
  const { length, 0: firstEdge, [length - 1]: lastEdge } = edges;
  // const lowerBound = after ? afterOffset + 1 : 0;
  // const upperBound = before ? Math.min(beforeOffset, totalCount) : totalCount;

  const pageInfo = {
    startCursor: firstEdge ? firstEdge.cursor : null,
    endCursor: lastEdge ? lastEdge.cursor : null,
    hasPreviousPage: true,
    hasNextPage: true,
    // hasPreviousPage: last ? startOffset > lowerBound : false,
    // hasNextPage: first ? endOffset < upperBound : false,
  };

  return {
    edges,
    pageInfo,
    totalCount,
  };
}
export async function connectionFromRepositoryB(
  args: ConnectionArguments,
  repository: Prisma.UserDelegate,
): Promise<Connection<any>> {
  const { before, after, first, last } = args;

  const totalCount = await repository.count();

  // offsets
  const beforeOffset = getOffsetWithDefault(before, totalCount);
  const afterOffset = getOffsetWithDefault(after, -1);

  let startOffset = Math.max(-1, afterOffset) + 1;
  let endOffset = Math.min(beforeOffset, totalCount);

  if (first) {
    endOffset = Math.min(endOffset, startOffset + first);
  }

  if (last) {
    startOffset = Math.max(startOffset, endOffset - last);
  }

  // skip, take
  const skip = Math.max(startOffset, 0); // sql offset
  const take = Math.max(endOffset - startOffset, 1); // sql limit

  // records
  const entities = await repository.findMany({ skip, take });

  const edges = entities.map((entity, index) => ({
    cursor: offsetToCursor(startOffset + index),
    node: entity,
  }));

  // page info
  const { length, 0: firstEdge, [length - 1]: lastEdge } = edges;
  const lowerBound = after ? afterOffset + 1 : 0;
  const upperBound = before ? Math.min(beforeOffset, totalCount) : totalCount;

  const pageInfo = {
    startCursor: firstEdge ? firstEdge.cursor : null,
    endCursor: lastEdge ? lastEdge.cursor : null,
    hasPreviousPage: last ? startOffset > lowerBound : false,
    hasNextPage: first ? endOffset < upperBound : false,
  };

  return {
    edges,
    pageInfo,
    totalCount,
  };
}
