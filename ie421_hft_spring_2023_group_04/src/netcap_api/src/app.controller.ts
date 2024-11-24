import {
    Controller,
    Get,
    Query,
    Post,
    Body,
    Delete,
    Patch,
} from '@nestjs/common';
import { PingPongService } from './pingPong.service';
import { NodeService } from './node.service';
import { AppService } from './app.service';
import { PingPong as PingPongModule } from '@prisma/client';
import { Node as NodeModule } from '@prisma/client';
import { RawPCAP as RawPCAPModule } from '@prisma/client';
import { PaginatedPingPong } from './types/PaginatedPingPong';
import { RawPCAPService } from './rawpcap.service';
import { RequestsService } from './requests.service';
import {
    PaginatedDataRequests,
    PaginatedOrderRequests,
} from './types/PaginatedRequests';
import { PaginatedRawPCAP } from './types/PaginatedRawPCAP';

@Controller()
export class AppController {
    constructor(
        private readonly appService: AppService,
        private readonly pingPongService: PingPongService,
        private readonly nodeService: NodeService,
        private readonly rawpcapService: RawPCAPService,
        private readonly requestService: RequestsService,
    ) {}

    @Get()
    getHello(): string {
        return this.appService.getHello();
    }

    @Post()
    postHello(@Body() test: any): void {
        console.log('test');
    }

    @Post('rawPCAPService')
    async createRawPCAPService(
        @Body()
        postData: {
            tstamp_sec: string;
            tstamp_nano: string;
            capture_length: string;
            total_length: string;
            raw_data: any;
        },
    ): Promise<RawPCAPModule> {
        const {
            tstamp_sec,
            tstamp_nano,
            capture_length,
            total_length,
            raw_data,
        } = postData;

        const timestamp_sec = Number(tstamp_sec);
        const timestamp_nano = Number(tstamp_nano);
        const capture_length_num = Number(capture_length);
        const total_length_num = Number(total_length);

        for (let key in raw_data) {
            if (raw_data[key] === '(null)') {
                delete raw_data[key];
            }
        }

        raw_data.ip_src_ip = this.hexToIp(raw_data.ip_src_ip);
        raw_data.ip_dst_ip = this.hexToIp(raw_data.ip_dst_ip);

        raw_data.sll_source_address = this.formatSllAddress(
            raw_data.sll_source_address,
            Number(raw_data.sll_address_length),
        );

        const result = await this.rawpcapService.createRawPCAP({
            timestamp_sec,
            timestamp_nano,
            capture_length: capture_length_num,
            total_length: total_length_num,
            raw_data,
        });

        if (
            raw_data.ip_protocol === '06' &&
            (Number(raw_data.fix_msg_seq_num) % 10 === 4 ||
                Number(raw_data.fix_msg_seq_num) % 10 === 5)
        ) {
            const updateRes =
                await this.rawpcapService.updateOrderDataRequests();
            console.log(updateRes);
        }

        return result;
    }

    hexToIp(hex: string) {
        if (!hex || hex.length !== 8) {
            console.error('Invalid hex IP address.');
            return null;
        }

        let ip = [];
        for (let i = 0; i < 8; i += 2) {
            ip.push(parseInt(hex.substr(i, 2), 16));
        }

        return ip.join('.');
    }

    formatSllAddress(hex: string, length: number) {
        if (!hex) {
            console.error('Invalid sll_source_address.');
            return null;
        }

        let result = [];
        for (let i = 0; i < length * 2; i += 2) {
            result.push(hex.substr(i, 2));
        }
        return result.join(':');
    }

    @Get('uniqueClOrdID')
    async getUniqueClOrdID(): Promise<any> {
        return this.rawpcapService.getUniqueClOrdId();
    }

    @Patch('updateOrderDataRequests')
    async updateOrderDataRequests(): Promise<any> {
        return this.rawpcapService.updateOrderDataRequests();
    }

    @Get('getRawPCAP')
    async getAllRawPCAP(
        @Query('skip') skip: number,
        @Query('take') take: number,
    ): Promise<any> {
        return {
            results: await this.rawpcapService.getRawPCAPs(skip, take),
            skip: skip,
            take: take,
            total: await this.rawpcapService.getRawPCAPCount(),
        };
    }

    @Get('getRawPCAPDetails')
    async getRawPCAPDetails(@Query('id') pcapId: string): Promise<any> {
        return this.rawpcapService.getPCAPDetails(Number(pcapId));
    }

    @Get('orderRequests')
    async paginatedOrders(
        @Query('skip') skip: number,
        @Query('take') take: number,
    ): Promise<PaginatedOrderRequests> {
        return {
            count: await this.requestService.getOrderRequestsCount(),
            skip: Number(skip),
            take: Number(take),
            result: await this.requestService.orderRequests({
                skip: Number(skip),
                take: Number(take),
            }),
        };
    }

    @Get('marketDataRequests')
    async paginatedData(
        @Query('skip') skip: number,
        @Query('take') take: number,
    ): Promise<PaginatedDataRequests> {
        return {
            count: await this.requestService.getDataRequestsCount(),
            skip: Number(skip),
            take: Number(take),
            result: await this.requestService.dataRequests({
                skip: Number(skip),
                take: Number(take),
            }),
        };
    }

    @Get('rawPCAPs')
    async rawPCAPPaginated(
        @Query('skip') skip: number,
        @Query('take') take: number,
    ): Promise<PaginatedRawPCAP> {
        return {
            count: await this.rawpcapService.getRawPCAPCount(),
            skip: Number(skip),
            take: Number(take),
            result: await this.rawpcapService.rawPCAPs({
                skip: Number(skip),
                take: Number(take),
            }),
        };
    }

    @Get('pingPong')
    async getPingPongById(@Query('id') id: string): Promise<PingPongModule> {
        return this.pingPongService.pingPong({ id: Number(id) });
    }

    @Get('pingPongs')
    async page(
        @Query('skip') skip: number,
        @Query('take') take: number,
    ): Promise<PaginatedPingPong> {
        return {
            count: await this.pingPongService.getPingPongCount(),
            skip: Number(skip),
            take: Number(take),
            result: await this.pingPongService.pingPongs({
                skip: Number(skip),
                take: Number(take),
            }),
        };
    }

    @Get('graphData')
    async fetchGraphData() {
        return this.rawpcapService.getGraphData();
    }

    @Get('socketTest')
    async sendSocketEvent() {
        return 'success';
    }

    @Get('pingPongs')
    async pageFromTime(
        @Query('skip') skip: number,
        @Query('take') take: number,
        @Query('time') time: string,
    ): Promise<PingPongModule[]> {
        console.log(time);
        const { trader_in_sec, trader_in_nano } = this.splitTimePing(time);
        return this.pingPongService.pingPongs({
            skip: Number(skip),
            take: Number(take),
            where: {
                OR: [
                    {
                        trader_in_sec: {
                            gte: Number(trader_in_sec),
                        },
                        trader_in_nano: {
                            gte: Number(trader_in_nano),
                        },
                    },
                    {
                        trader_in_sec: {
                            gt: Number(trader_in_sec),
                        },
                    },
                ],
            },
            orderBy: {
                id: 'asc',
            },
        });
    }

    @Post('pingPong')
    async createPingPong(
        @Body()
        postData: {
            order_id: number;
            source_ip: string;
            gateway_ip: string;
            trader_in: string;
            trader_out: string;
            latency: number;
            gateway_in: string;
            gateway_out: string;
            ticker_out: string;
            ome_in: string;
            ome_out: string;
        },
    ): Promise<PingPongModule> {
        const {
            order_id,
            source_ip,
            gateway_ip,
            trader_in,
            trader_out,
            latency,
            gateway_in,
            gateway_out,
            ome_in,
            ome_out,
            ticker_out,
        } = postData;
        const {
            trader_in_sec,
            trader_in_nano,
            trader_out_sec,
            trader_out_nano,
            gateway_in_sec,
            gateway_in_nano,
            gateway_out_sec,
            gateway_out_nano,
            ome_in_sec,
            ome_in_nano,
            ome_out_sec,
            ome_out_nano,
            ticker_out_sec,
            ticker_out_nano,
        } = this.splitTime(
            trader_in,
            trader_out,
            gateway_in,
            gateway_out,
            ome_in,
            ome_out,
            ticker_out,
        );

        const result = this.pingPongService.createPingPong({
            order_id,
            source_ip,
            gateway_ip,
            trader_in_sec,
            trader_in_nano,
            trader_out_sec,
            trader_out_nano,
            gateway_in_sec,
            gateway_in_nano,
            gateway_out_sec,
            gateway_out_nano,
            ome_in_sec,
            ome_in_nano,
            ome_out_sec,
            ome_out_nano,
            ticker_out_sec,
            ticker_out_nano,
            latency,
        });

        await this.nodeService.updateNodeByHostName({
            host_name: source_ip,
            curr_type: 'Trader',
        });
        await this.nodeService.updateNodeByHostName({
            host_name: gateway_ip,
            curr_type: 'Exchange',
        });

        return result;
    }

    splitTime(
        trader_in: string,
        trader_out: string,
        gateway_in: string,
        gateway_out: string,
        ticker_out: string,
        ome_in: string,
        ome_out: string,
    ): any {
        return {
            trader_in_sec: BigInt(trader_in.substring(0, 10)),
            trader_in_nano: BigInt(trader_in.substring(10)),
            trader_out_sec: BigInt(trader_out.substring(0, 10)),
            trader_out_nano: BigInt(trader_out.substring(10)),
            gateway_in_sec: BigInt(gateway_in.substring(0, 10)),
            gateway_in_nano: BigInt(gateway_in.substring(10)),
            gateway_out_sec: BigInt(gateway_out.substring(0, 10)),
            gateway_out_nano: BigInt(gateway_out.substring(10)),
            ome_in_sec: BigInt(ome_in.substring(0, 10)),
            ome_in_nano: BigInt(ome_in.substring(10)),
            ome_out_sec: BigInt(ome_out.substring(0, 10)),
            ome_out_nano: BigInt(ome_out.substring(10)),
            ticker_out_sec: BigInt(ticker_out.substring(0, 10)),
            ticker_out_nano: BigInt(ticker_out.substring(10)),
        };
    }

    splitTimePing(ping_time: string): any {
        return {
            sec: BigInt(ping_time.substring(0, 10)),
            nano: BigInt(ping_time.substring(10)),
        };
    }

    @Delete('pingPong')
    async deletePost(@Query('id') id: string): Promise<PingPongModule> {
        return this.pingPongService.deletePingPong({ id: Number(id) });
    }

    @Get('node')
    async getNodeByHostName(
        @Query('host_name') host_name: string,
    ): Promise<NodeModule | string> {
        const check = await this.nodeService.nodeCheck(host_name);
        if (check != 0) {
            const result = this.nodeService.node({ host_name: host_name });
            return result;
        } else {
            return 'cannot find';
        }
    }

    @Get('nodes')
    async getAllNodes(): Promise<NodeModule[]> {
        return await this.nodeService.nodes();
    }

    @Post('node')
    async createNode(
        @Body()
        postData: {
            host_name: string;
            port: string;
            message_num: number;
            status: number;
            type: string;
        },
    ): Promise<NodeModule> {
        const { host_name, port, message_num, status, type } = postData;
        return this.nodeService.createNode({
            host_name,
            port,
            message_num,
            status,
            type,
        });
    }

    @Delete('node')
    async deleteNode(
        @Query('host_name') host_name: string,
    ): Promise<NodeModule> {
        return this.nodeService.deleteNode({ host_name: host_name });
    }

    // @Get('test')
    // async testAvg(): Promise<any> {
    //   return await this.pingPongService.avgPingPong();

    // }
}
