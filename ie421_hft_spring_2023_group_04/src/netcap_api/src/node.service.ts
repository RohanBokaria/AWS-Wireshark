import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { Prisma, Node } from '@prisma/client';
import { type } from 'os';

@Injectable()
export class NodeService {
    constructor(private prisma: PrismaService) {}

    async node(
        nodeWhereUniqueInput: Prisma.NodeWhereUniqueInput,
    ): Promise<Node | null> {
        return this.prisma.node.findUnique({
            where: nodeWhereUniqueInput,
        });
    }

    async nodeCheck(host_name: string): Promise<number> {
        let placeCount = await this.prisma.node.count({
            where: {
                host_name: host_name,
            },
        });
        return placeCount;
    }

    async nodes(): Promise<Node[]> {
        return this.prisma.node.findMany();
    }

    async createNode(data: Prisma.NodeCreateInput): Promise<Node> {
        return this.prisma.node.create({
            data: {
                host_name: data.host_name,
                port: data.port,
                message_num: data.message_num,
                status: data.status,
                type: data.type,
            },
        });
    }

    async updateNodeById(params: {
        where: Prisma.NodeWhereUniqueInput;
        data: Prisma.NodeUpdateInput;
    }): Promise<Node> {
        const { where, data } = params;
        return this.prisma.node.update({
            data,
            where,
        });
    }

    async updateNodeByHostName(params: {
        host_name: string;
        curr_type: string;
    }): Promise<Node> {
        const { host_name, curr_type } = params;
        let placeCount = await this.prisma.node.count({
            where: {
                host_name: host_name,
            },
        });
        if (placeCount == 0) {
            console.log('create');
            return this.prisma.node.create({
                data: {
                    host_name: host_name,
                    port: '3000',
                    message_num: 1,
                    status: 1,
                    type: curr_type,
                },
            });
        } else {
            console.log('update');
            return this.prisma.node.update({
                where: {
                    host_name: host_name,
                },
                data: {
                    message_num: { increment: 1 },
                },
            });
        }
    }

    async deleteNode(where: Prisma.NodeWhereUniqueInput): Promise<Node> {
        return this.prisma.node.delete({
            where,
        });
    }
}
