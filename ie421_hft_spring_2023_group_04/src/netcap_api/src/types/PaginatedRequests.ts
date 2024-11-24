import { OrderRequests, DataRequests } from '@prisma/client';

export type PaginatedOrderRequests = {
    count: number;
    skip: number;
    take: number;
    result: OrderRequests[];
};

export type PaginatedDataRequests = {
    count: number;
    skip: number;
    take: number;
    result: DataRequests[];
};
