import { RawPCAP } from '@prisma/client';

export type PaginatedRawPCAP = {
    count: number;
    skip: number;
    take: number;
    result: RawPCAP[];
};
