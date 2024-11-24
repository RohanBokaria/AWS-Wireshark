import { PingPong } from '@prisma/client';

export type PaginatedPingPong = {
    count: number;
    skip: number;
    take: number;
    result: PingPong[];
};
