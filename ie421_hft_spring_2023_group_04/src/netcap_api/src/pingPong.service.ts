import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { Prisma, PingPong } from '@prisma/client';

@Injectable()
export class PingPongService {
    constructor(private prisma: PrismaService) {}

    async pingPong(
        pingPongWhereUniqueInput: Prisma.PingPongWhereUniqueInput,
    ): Promise<PingPong | null> {
        return this.prisma.pingPong.findUnique({
            where: pingPongWhereUniqueInput,
        });
    }

    async getAllPingPongs(): Promise<PingPong[]> {
        return this.prisma.pingPong.findMany();
    }

    async pingPongs(params: {
        skip?: number;
        take?: number;
        cursor?: Prisma.PingPongWhereUniqueInput;
        where?: Prisma.PingPongWhereInput;
        orderBy?: Prisma.PingPongOrderByWithRelationInput;
    }): Promise<PingPong[]> {
        const { skip, take, cursor, where, orderBy } = params;
        return this.prisma.pingPong.findMany({
            skip,
            take,
            cursor,
            where,
            orderBy,
        });
    }

    async getPingPongCount(): Promise<number> {
        return this.prisma.pingPong.count();
    }

    async createPingPong(data: Prisma.PingPongCreateInput): Promise<PingPong> {
        return this.prisma.pingPong.create({
            data: {
                order_id: data.order_id,
                source_ip: data.source_ip,
                gateway_ip: data.gateway_ip,
                trader_in_sec: data.trader_in_sec,
                trader_in_nano: data.trader_in_nano,
                trader_out_sec: data.trader_out_sec,
                trader_out_nano: data.trader_out_nano,
                gateway_in_sec: data.gateway_in_sec,
                gateway_in_nano: data.gateway_in_nano,
                gateway_out_sec: data.gateway_out_sec,
                gateway_out_nano: data.gateway_out_nano,
                ome_in_sec: data.ome_in_sec,
                ome_in_nano: data.ome_in_nano,
                ome_out_sec: data.ome_out_sec,
                ome_out_nano: data.ome_out_nano,
                ticker_out_sec: data.ticker_out_sec,
                ticker_out_nano: data.ticker_out_nano,
                latency: data.latency,
            },
        });
    }

    async updatePingPong(params: {
        where: Prisma.PingPongWhereUniqueInput;
        data: Prisma.PingPongUpdateInput;
    }): Promise<PingPong> {
        const { where, data } = params;
        return this.prisma.pingPong.update({
            data,
            where,
        });
    }

    async deletePingPong(
        where: Prisma.PingPongWhereUniqueInput,
    ): Promise<PingPong> {
        return this.prisma.pingPong.delete({
            where,
        });
    }

    prev_avgPingPong = {
        time: 0,
        latency: 0,
    };
}
