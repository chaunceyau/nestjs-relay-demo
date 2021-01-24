import { Injectable } from '@nestjs/common';
// import { PrismaClient } from '@prisma/client';
import { connectionFromRepository } from '../relay/connection.factory';
import { prisma } from '../main';

const USERS = [
  { id: '2b248314-a41d-4247-9222-3eb454dece6c', name: 'Sarina' },
  { id: '4eecfffb-953a-4c5d-bf26-6ecd0986d717', name: 'Luther' },
  { id: '0463db37-82cd-4534-9674-54ce378d4ec6', name: 'Rodrick' },
  { id: 'd5e91614-dc2e-46bf-b1dc-9690398e7a86', name: 'Kari' },
  { id: '32b5e80c-a841-4410-83d1-72d6ff571c95', name: 'Wendy' },
  { id: 'f6ba6b63-e1f3-43ce-bbef-fecdb0955cf9', name: 'Alaina' },
  { id: '01db6910-c8aa-44d5-b833-eb344bfa2c44', name: 'Glenna' },
  { id: 'b99bf132-df50-4481-9190-d7ae679dc702', name: 'Clare' },
  { id: 'c2f9de17-ba7f-422d-8a9b-b88d47c6bb4e', name: 'Keyshawn' },
  { id: '0b2130f6-00ac-4f38-8635-4166e6059cf2', name: 'Ronny' },
];

@Injectable()
export class UserService {
  findOneById(id: number) {
    return prisma.user.findUnique({ where: { id } });
  }

  async findAll(params: ForwardPagination | BackwardPagination) {
    console.log(
      JSON.stringify(
        await connectionFromRepository({ first: 2400 }, prisma.user),
      ),
    );
    return;
    // if ('first' in params) {
    //   // forward pagination
    //   const matchIndex = USERS.findIndex(
    //     u => u.id === params.after || USERS[0],
    //   );

    //   const results = USERS.slice(
    //     matchIndex + 1,
    //     matchIndex + 1 + params.first,
    //   );

    //   return {
    //     edges: results.map(u => ({ node: u })),
    //     pageInfo: {
    //       hasNextPage: USERS.length - (matchIndex + 1 + params.first) > 0,
    //       hasPreviousPage: matchIndex > 0,
    //       startCursor: results[0]?.id,
    //       endCursor: results[results.length - 1]?.id,
    //     },
    //   };
    // } else if ('last' in params) {
    //   // forward pagination
    //   const matchIndex = USERS.findIndex(
    //     u => u.id === params.before || USERS[USERS.length - 1],
    //   );
    //   const results = USERS.slice(
    //     matchIndex - params.last > 0 ? matchIndex - params.last : 0,
    //     matchIndex,
    //   );
    //   return {
    //     edges: results.map(u => ({ node: u })),
    //     pageInfo: {
    //       hasNextPage: true,
    //       hasPreviousPage: true,
    //       startCursor: results[0]?.id,
    //       endCursor: results[results.length - 1]?.id,
    //     },
    //   };
    //   // backward pagination
    // }
  }
}

interface ForwardPagination {
  first: number;
  after?: string;
}

interface BackwardPagination {
  last: number;
  before?: string;
}
