import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class RequestsService {
    constructor(private prisma: PrismaService) {}

    async orderRequests(params: {
        skip?: number;
        take?: number;
        cursor?: Prisma.OrderRequestsWhereUniqueInput;
        where?: Prisma.OrderRequestsWhereInput;
        orderBy?: Prisma.OrderRequestsOrderByWithRelationInput;
    }) {
        const { skip, take, cursor, where, orderBy } = params;
        return this.prisma.orderRequests.findMany({
            skip,
            take,
            cursor,
            where,
            orderBy,
        });
    }

    async getOrderRequestsCount(): Promise<number> {
        return this.prisma.orderRequests.count();
    }

    async dataRequests(params: {
        skip?: number;
        take?: number;
        cursor?: Prisma.DataRequestsWhereUniqueInput;
        where?: Prisma.DataRequestsWhereInput;
        orderBy?: Prisma.DataRequestsOrderByWithRelationInput;
    }) {
        const { skip, take, cursor, where, orderBy } = params;
        return this.prisma.dataRequests.findMany({
            skip,
            take,
            cursor,
            where,
            orderBy,
        });
    }

    async getDataRequestsCount(): Promise<number> {
        return this.prisma.dataRequests.count();
    }
}
