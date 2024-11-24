import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { Prisma, RawPCAP } from '@prisma/client';
import { OrderPackets } from './types/RawPCAP';

@Injectable()
export class RawPCAPService {
    constructor(private prisma: PrismaService) {}

    async node(
        rawPCAPWhereUniqueInput: Prisma.RawPCAPWhereUniqueInput,
    ): Promise<RawPCAP | null> {
        return this.prisma.rawPCAP.findUnique({
            where: rawPCAPWhereUniqueInput,
        });
    }

    async createRawPCAP(data: Prisma.RawPCAPCreateInput): Promise<RawPCAP> {
        return this.prisma.rawPCAP.create({
            data: {
                timestamp_sec: data.timestamp_sec,
                timestamp_nano: data.timestamp_nano,
                capture_length: data.capture_length,
                total_length: data.total_length,
                raw_data: data.raw_data,
            },
        });
    }

    async deleteRawPCAP(
        where: Prisma.RawPCAPWhereUniqueInput,
    ): Promise<RawPCAP> {
        return this.prisma.rawPCAP.delete({
            where,
        });
    }

    async getUniqueClOrdId(): Promise<string[]> {
        return (
            (await this.prisma.$queryRaw`
            SELECT DISTINCT \`raw_data\` ->> '$.fix_cl0rdid' as order_id 
            FROM RawPCAP 
            WHERE \`raw_data\` ->> '$.fix_checksum' IS NOT NULL
            ORDER BY \`raw_data\` ->> '$.fix_cl0rdid'
        `) as any[]
        ).map((clOrdId) => clOrdId.order_id);
    }

    async getRawPCAPs(skip: number, take: number): Promise<any[]> {
        const ret = (await this.prisma.$queryRaw`
            SELECT
                id,
                timestamp_sec AS time,
                capture_length AS length,
                \`raw_data\` ->> '$.ip_src_ip' AS source_ip,
                \`raw_data\` ->> '$.ip_dst_ip' AS destination_ip,
                CASE \`raw_data\` ->> '$.sll_protocol'
                    WHEN '0806' THEN 'ARP'
                    WHEN '0800' THEN 'IPv4'
                END AS network_protocol,
                CASE \`raw_data\` ->> '$.ip_protocol'
                    WHEN '06' THEN 'TCP'
                    WHEN '11' THEN 'UDP'
                END AS ip_protocol,
                CASE
                    WHEN \`raw_data\` ->> '$.tcp_flags' IS NOT NULL 
                    THEN LPAD(CONV(\`raw_data\` ->> '$.tcp_flags', 16, 2), LENGTH(\`raw_data\` ->> '$.tcp_flags')*4, '0')
                END AS tcp_flags,
                CASE 
                    WHEN \`raw_data\` ->> '$.fix_checksum' IS NOT NULL
                    THEN 'FIX'
                END AS application_protocol
            FROM
                RawPCAP
            ORDER BY id ASC
            LIMIT ${skip}, ${take}
        `) as any[];

        const flagsParsed = ret.map((pcap) => {
            const newPcap = pcap;
            for (const key in newPcap) {
                if (!newPcap[key]) newPcap[key] = '-';
            }
            if (newPcap.tcp_flags === '-') {
                return newPcap;
            }

            const TCP_FLAGS = [
                'CWR',
                'ECE',
                'URG',
                'ACK',
                'PSH',
                'RST',
                'SYN',
                'FIN',
            ];
            let activeFlags = [];
            for (let i = 0; i < newPcap.tcp_flags.length; i++) {
                if (parseInt(newPcap.tcp_flags.charAt(i)))
                    activeFlags.push(TCP_FLAGS[i]);
            }

            newPcap.tcp_flags = activeFlags.join(',');
            return newPcap;
        });

        return flagsParsed;
    }

    async rawPCAPs(params: {
        skip?: number;
        take?: number;
        cursor?: Prisma.RawPCAPWhereUniqueInput;
        where?: Prisma.RawPCAPWhereInput;
        orderBy?: Prisma.RawPCAPOrderByWithRelationInput;
    }): Promise<RawPCAP[]> {
        const { skip, take, cursor, where, orderBy } = params;
        return this.prisma.rawPCAP.findMany({
            skip,
            take,
            cursor,
            where,
            orderBy,
        });
    }

    async getRawPCAPCount(): Promise<number> {
        return this.prisma.rawPCAP.count();
    }

    async getPCAPDetails(pcapId: number): Promise<any> {
        return this.prisma.rawPCAP.findUnique({
            where: {
                id: pcapId,
            },
            select: {
                raw_data: true,
            },
        });
    }

    async updateOrderDataRequests(): Promise<any> {
        const orderPackets = (await this.prisma.$queryRaw`
            SELECT 
              * 
            FROM 
              (
                SELECT 
                  \`raw_data\` ->> '$.fix_cl0rdid' as order_id, 
                  JSON_ARRAYAGG(
                    JSON_OBJECT(
                      'id', 
                      id, 
                      'tstamp_sec', 
                      timestamp_sec, 
                      'tstamp_nano', 
                      timestamp_nano,
                      'sender', 
                      \`raw_data\` ->> '$.fix_sender_comp_id',
                      'target', 
                      \`raw_data\` ->> '$.fix_target_comp_id',
                      'fix_type', 
                      CASE \`raw_data\` ->> '$.fix_msg_type' WHEN 'D' THEN 'ORDER' WHEN 'V' THEN 'MKT_REQ' WHEN '8' THEN 'EXEC_ORD' WHEN 'W' THEN 'MKT_RES' END, 
                      'msg_state', 
                      CASE WHEN MOD(
                        \`raw_data\` ->> '$.fix_msg_seq_num', 
                        10
                      ) = 0 THEN 'GW_IN' WHEN MOD(
                        \`raw_data\` ->> '$.fix_msg_seq_num', 
                        10
                      ) = 1 THEN 'ACK_OUT' WHEN MOD(
                        \`raw_data\` ->> '$.fix_msg_seq_num', 
                        10
                      ) = 2 
                      AND \`raw_data\` ->> '$.fix_mdreq_id' IS NOT NULL THEN 'DRPCPY_IN' WHEN MOD(
                        \`raw_data\` ->> '$.fix_msg_seq_num', 
                        10
                      ) = 2 
                      AND \`raw_data\` ->> '$.fix_mdreq_id' IS NULL THEN 'OME_IN' WHEN MOD(
                        \`raw_data\` ->> '$.fix_msg_seq_num', 
                        10
                      ) = 3 THEN 'TICKER_IN' WHEN MOD(
                        \`raw_data\` ->> '$.fix_msg_seq_num', 
                        10
                      ) = 4 
                      AND \`raw_data\` ->> '$.ip_protocol' = '06' THEN 'PRIV_OUT' WHEN MOD(
                        \`raw_data\` ->> '$.fix_msg_seq_num', 
                        10
                      ) = 4 
                      AND \`raw_data\` ->> '$.ip_protocol' = '11' THEN 'PUBL_OUT' WHEN MOD(
                        \`raw_data\` ->> '$.fix_msg_seq_num', 
                        10
                      ) = 5 THEN 'PRIV_OUT' END
                    )
                  ) AS order_packets 
                FROM 
                  RawPCAP 
                WHERE 
                  \`raw_data\` ->> '$.fix_checksum' IS NOT NULL 
                GROUP BY 
                  \`raw_data\` ->> '$.fix_cl0rdid' 
                ORDER BY 
                  \`raw_data\` ->> '$.fix_cl0rdid'
              ) AS orders 
            WHERE 
              order_id NOT IN (
                SELECT 
                  order_id 
                FROM 
                  OrderRequests
              ) 
              AND order_id NOT IN (
                SELECT 
                  order_id 
                FROM 
                  DataRequests
              )

        `) as OrderPackets[];

        const newOrdersRequests = orderPackets
            .filter((packets) => packets.order_id.substring(0, 1) === 'O')
            .map((packets): Prisma.OrderRequestsCreateInput => {
                let order: Prisma.OrderRequestsCreateInput = {
                    order_id: '',
                    source: '',
                    destination: '',
                    gateway_in_sec: 0,
                    gateway_in_nano: 0,
                    ack_tstamp_sec: 0,
                    ack_tstamp_nano: 0,
                    ome_in_sec: 0,
                    ome_in_nano: 0,
                    ticker_in_sec: 0,
                    ticker_in_nano: 0,
                    public_out_sec: 0,
                    public_out_nano: 0,
                    private_out_sec: 0,
                    private_out_nano: 0,
                };

                order.order_id = packets.order_id;
                const traderRegex = /TRADER\d+/;
                const exchangeRegex = /EXCHANGE\d+/;

                for (const packet of packets.order_packets) {
                    if (!order.source) {
                        if (traderRegex.test(packet.sender))
                            order.source = packet.sender;
                        if (traderRegex.test(packet.target))
                            order.source = packet.target;
                    }
                    if (!order.destination) {
                        if (exchangeRegex.test(packet.target))
                            order.destination = packet.target;
                        if (exchangeRegex.test(packet.sender))
                            order.destination = packet.sender;
                    }

                    switch (packet.msg_state) {
                        case 'GW_IN':
                            order.gateway_in_sec = packet.tstamp_sec;
                            order.gateway_in_nano = packet.tstamp_nano;
                            break;
                        case 'ACK_OUT':
                            order.ack_tstamp_sec = packet.tstamp_sec;
                            order.ack_tstamp_nano = packet.tstamp_nano;
                            break;
                        case 'OME_IN':
                            order.ome_in_sec = packet.tstamp_sec;
                            order.ome_in_nano = packet.tstamp_nano;
                            break;
                        case 'TICKER_IN':
                            order.ticker_in_sec = packet.tstamp_sec;
                            order.ticker_in_nano = packet.tstamp_nano;
                            break;
                        case 'PUBL_OUT':
                            order.public_out_sec = packet.tstamp_sec;
                            order.public_out_nano = packet.tstamp_nano;
                            break;
                        case 'PRIV_OUT':
                            order.private_out_sec = packet.tstamp_sec;
                            order.private_out_nano = packet.tstamp_nano;
                            break;
                    }
                }
                return order;
            })
            .filter((order) => {
                for (const key in order) {
                    if (!order[key]) {
                        console.log('INCOMPLETE ORDER SKIPPING...');
                        return false;
                    }
                }
                return true;
            });

        const newDataRequests = orderPackets
            .filter((packets) => packets.order_id.substring(0, 1) === 'M')
            .map((packets): Prisma.DataRequestsCreateInput => {
                let dataReq: Prisma.DataRequestsCreateInput = {
                    order_id: '',
                    source: '',
                    destination: '',
                    gateway_in_sec: 0,
                    gateway_in_nano: 0,
                    ack_tstamp_sec: 0,
                    ack_tstamp_nano: 0,
                    dropcopy_in_sec: 0,
                    dropcopy_in_nano: 0,
                    private_out_sec: 0,
                    private_out_nano: 0,
                };

                dataReq.order_id = packets.order_id;
                const traderRegex = /TRADER\d+/;
                const exchangeRegex = /EXCHANGE\d+/;

                for (const packet of packets.order_packets) {
                    if (!dataReq.source) {
                        if (traderRegex.test(packet.sender))
                            dataReq.source = packet.sender;
                        if (traderRegex.test(packet.target))
                            dataReq.source = packet.target;
                    }
                    if (!dataReq.destination) {
                        if (exchangeRegex.test(packet.target))
                            dataReq.destination = packet.target;
                        if (exchangeRegex.test(packet.sender))
                            dataReq.destination = packet.sender;
                    }

                    switch (packet.msg_state) {
                        case 'GW_IN':
                            dataReq.gateway_in_sec = packet.tstamp_sec;
                            dataReq.gateway_in_nano = packet.tstamp_nano;
                            break;
                        case 'ACK_OUT':
                            dataReq.ack_tstamp_sec = packet.tstamp_sec;
                            dataReq.ack_tstamp_nano = packet.tstamp_nano;
                            break;
                        case 'DRPCPY_IN':
                            dataReq.dropcopy_in_sec = packet.tstamp_sec;
                            dataReq.dropcopy_in_nano = packet.tstamp_nano;
                            break;
                        case 'PRIV_OUT':
                            dataReq.private_out_sec = packet.tstamp_sec;
                            dataReq.private_out_nano = packet.tstamp_nano;
                            break;
                    }
                }
                return dataReq;
            })
            .filter((dataReq) => {
                for (const key in dataReq) {
                    if (!dataReq[key]) {
                        console.log(
                            'INCOMPLETE MARKET DATA REQUEST SKIPPING...',
                        );
                        return false;
                    }
                }
                return true;
            });

        let ret = {
            orderChanges: 0,
            dataRequestChanges: 0,
        };

        try {
            const orderChanges = await this.prisma.orderRequests.createMany({
                data: newOrdersRequests,
            });

            const dataReqChanges = await this.prisma.dataRequests.createMany({
                data: newDataRequests,
            });

            ret = {
                orderChanges: orderChanges.count,
                dataRequestChanges: dataReqChanges.count,
            };
        } catch (error) {
            console.log('Error occurred when creating records, skipping...');
        }
        return ret;
    }

    async getGraphData(): Promise<any> {
        return (
            await this.prisma.$queryRaw`
        SELECT 
          JSON_OBJECT('nodes', nodes, 'links', links) AS data
        FROM 
          (
            (
              SELECT 
                JSON_ARRAYAGG(
                  JSON_OBJECT('id', id, 'name', name)
                ) AS nodes 
              FROM 
                (
                  SELECT 
                    DISTINCT id, 
                    CASE SUBSTRING_INDEX(id, '.', -1) DIV 10 WHEN 0 THEN 'Host' WHEN 1 THEN 'Trader' WHEN 3 THEN 'Exchange' WHEN 25 THEN 'UDP Broadcast' END AS name 
                  FROM 
                    (
                      SELECT 
                        \`raw_data\` ->> '$.ip_src_ip' AS id 
                      FROM 
                        RawPCAP 
                      UNION ALL 
                      SELECT 
                        \`raw_data\` ->> '$.ip_dst_ip' AS id 
                      FROM 
                        RawPCAP
                    ) AS ids 
                  WHERE 
                    id NOT LIKE '127.0.0.%' 
                    AND id != 'null' 
                    AND id NOT LIKE '%.1'
                ) AS nodes
            ) AS nodes CROSS 
            JOIN (
              SELECT 
                JSON_ARRAYAGG(
                  JSON_OBJECT(
                    'source', source, 'target', target, 
                    'msg_count', msg_count
                  )
                ) AS links 
              FROM 
                (
                  SELECT 
                    \`raw_data\` ->> '$.ip_src_ip' AS source, 
                    \`raw_data\` ->> '$.ip_dst_ip' AS target, 
                    CONCAT(
                      Count(*), 
                      ' Packet(s) Sent'
                    ) AS msg_count 
                  FROM 
                    RawPCAP 
                  WHERE 
                    \`raw_data\` ->> '$.ip_src_ip' NOT LIKE '127.0.0.%' 
                    AND \`raw_data\` ->> '$.ip_src_ip' NOT LIKE '%.1' 
                    AND \`raw_data\` ->> '$.ip_src_ip' != 'null' 
                    AND \`raw_data\` ->> '$.ip_dst_ip' NOT LIKE '127.0.0.%' 
                    AND \`raw_data\` ->> '$.ip_dst_ip' NOT LIKE '%.1' 
                    AND \`raw_data\` ->> '$.ip_dst_ip' != 'null' 
                  GROUP BY 
                    \`raw_data\` ->> '$.ip_src_ip', 
                    \`raw_data\` ->> '$.ip_dst_ip'
                ) AS links
            ) as links
          )
        `
        )[0].data;
    }

    prev_analysis = {};

    async avgCompLatencyDiff(
        time: number,
        start_comp: string,
        end_comp: string,
        isLive: boolean,
        cid: string,
    ): Promise<any> {
        const start_comp_sec_field = `${start_comp}_sec` as
            | keyof Prisma.DataRequestsScalarFieldEnum
            | keyof Prisma.OrderRequestsScalarFieldEnum;
        const start_comp_nano_field = `${start_comp}_nano` as
            | keyof Prisma.DataRequestsScalarFieldEnum
            | keyof Prisma.OrderRequestsScalarFieldEnum;
        const end_comp_sec_field = `${end_comp}_sec` as
            | keyof Prisma.DataRequestsScalarFieldEnum
            | keyof Prisma.OrderRequestsScalarFieldEnum;
        const end_comp_nano_field = `${end_comp}_nano` as
            | keyof Prisma.DataRequestsScalarFieldEnum
            | keyof Prisma.OrderRequestsScalarFieldEnum;

        if (!this.prev_analysis[cid])
            this.prev_analysis[cid] = {
                time: 0,
                latency: 0,
            };

        if (!isLive) {
            let avg = await this.prisma.orderRequests.aggregate({
                where: {
                    ack_tstamp_sec: {
                        gte: time,
                    },
                },
                _avg: {
                    [start_comp_sec_field]: true,
                    [start_comp_nano_field]: true,
                    [end_comp_sec_field]: true,
                    [end_comp_nano_field]: true,
                },
            });

            if (avg._avg[start_comp_sec_field as any] == null) {
                console.log('IT IS NULL');
                this.prev_analysis[cid]['time'] = time;
                return this.prev_analysis[cid];
            }

            console.log('IT IS NOT NULL');
            console.log(avg._avg);

            let res = {
                time: time,
                latency: this.calculateDiffAvg(
                    avg._avg[end_comp_sec_field as any],
                    avg._avg[end_comp_nano_field as any],
                    avg._avg[start_comp_sec_field as any],
                    avg._avg[start_comp_nano_field as any],
                ),
            };

            this.prev_analysis[cid] = res;

            return res;
        } else {
            const avg = await this.prisma.orderRequests.findMany({
                orderBy: [
                    {
                        ack_tstamp_sec: 'desc',
                    },
                    {
                        ack_tstamp_nano: 'desc',
                    },
                ],
                take: 1,
            });

            console.log('average: ');
            console.log(avg);

            if (avg[0] == null) {
                this.prev_analysis[cid]['time'] = time;
                return this.prev_analysis[cid];
            }

            let res = {
                time: time,
                latency: this.calculateDiffAvg(
                    avg[0][end_comp_sec_field as any],
                    avg[0][end_comp_nano_field as any],
                    avg[0][start_comp_sec_field as any],
                    avg[0][start_comp_nano_field as any],
                ),
            };

            this.prev_analysis[cid] = res;

            return res;
        }
    }

    async avgCompLatencyDiffGroup(
        time: number,
        start_comp: string,
        end_comp: string,
        group: string,
        isLive: boolean,
        cid: string,
    ): Promise<any> {
        const start_comp_sec_field = `${start_comp}_sec` as
            | keyof Prisma.DataRequestsScalarFieldEnum
            | keyof Prisma.OrderRequestsScalarFieldEnum;
        const start_comp_nano_field = `${start_comp}_nano` as
            | keyof Prisma.DataRequestsScalarFieldEnum
            | keyof Prisma.OrderRequestsScalarFieldEnum;
        const end_comp_sec_field = `${end_comp}_sec` as
            | keyof Prisma.DataRequestsScalarFieldEnum
            | keyof Prisma.OrderRequestsScalarFieldEnum;
        const end_com_nano_field = `${end_comp}_nano` as
            | keyof Prisma.DataRequestsScalarFieldEnum
            | keyof Prisma.OrderRequestsScalarFieldEnum;
        const group_cid = `${cid}-g`;

        if (!this.prev_analysis[group_cid]) this.prev_analysis[group_cid] = {};

        const group_by_field = group as
            | keyof Prisma.DataRequestsScalarFieldEnum
            | keyof Prisma.OrderRequestsScalarFieldEnum;

        if (!isLive) {
            let avg = await this.prisma.orderRequests.groupBy({
                by: [group_by_field as any],
                where: {
                    ack_tstamp_sec: {
                        //It may shows null because we have no data in the db
                        //gte: 1682877199,
                        gte: time,
                    },
                },
                _avg: {
                    [start_comp_sec_field]: true,
                    [start_comp_nano_field]: true,
                    [end_comp_sec_field]: true,
                    [end_com_nano_field]: true,
                },
                orderBy: {
                    [group_by_field]: 'asc',
                },
            });

            if (avg.length == 0) {
                this.prev_analysis[group_cid]['time'] = time;
                return this.prev_analysis[group_cid];
            }

            let map = {};

            map['time'] = time.toString();

            for (let i = 0; i < avg.length; i++) {
                const lantency = this.calculateDiffAvg(
                    avg[i]._avg[end_comp_sec_field as any],
                    avg[i]._avg[end_com_nano_field as any],
                    avg[i]._avg[start_comp_sec_field as any],
                    avg[i]._avg[start_comp_nano_field as any],
                );
                map[avg[i][group_by_field as any]] = lantency;
            }

            this.prev_analysis[group_cid] = map;

            return map;
        } else {
            const avg = await this.prisma.orderRequests.findMany({
                distinct: [group_by_field as any],
                orderBy: [
                    {
                        ack_tstamp_sec: 'desc',
                    },
                    {
                        ack_tstamp_nano: 'desc',
                    },
                ],
            });

            if (avg.length == 0) {
                this.prev_analysis[group_cid]['time'] = time;
                return this.prev_analysis[group_cid];
            }

            let map = {};

            map['time'] = time.toString();

            for (let i = 0; i < avg.length; i++) {
                const lantency = this.calculateDiffAvg(
                    avg[i][end_comp_sec_field as any],
                    avg[i][end_com_nano_field as any],
                    avg[i][start_comp_sec_field as any],
                    avg[i][start_comp_nano_field as any],
                );
                map[avg[i][group_by_field as any]] = lantency;
            }

            this.prev_analysis[group_cid] = map;

            return map;
        }
    }

    calculateDiffAvg(
        out_time_sec: any,
        out_time_nano: any,
        in_time_sec: any,
        in_time_nano: any,
    ) {
        const sec_dif = Number(out_time_sec - in_time_sec);
        const nano_dif = Number(out_time_nano - in_time_nano);
        return Math.abs(Number(nano_dif + sec_dif * 1000000000));
    }

    async getLatencyHistogramData(
        start_comp: string,
        end_comp: string,
        interval: number,
        msg_type: string,
    ): Promise<any> {
        const start_comp_sec = `${start_comp}_sec`;
        const start_comp_nano = `${start_comp}_nano`;
        const end_comp_sec = `${end_comp}_sec`;
        const end_comp_nano = `${end_comp}_nano`;
        const bucket = `${interval}`;

        const sql = `
            SELECT
                FLOOR(
                    ((${end_comp_sec} - ${start_comp_sec}) * 1000000000 + (${end_comp_nano} - ${start_comp_nano})) / ${bucket}
                ) AS IntervalStart,
                COUNT(*) AS Count
            FROM
                ${msg_type === 'order' ? 'OrderRequests' : 'DataRequests'}
            GROUP BY
                IntervalStart
            ORDER BY 
                IntervalStart
        `;

        const histogramData = await this.prisma.$queryRawUnsafe<
            HistogramDataRow[]
        >(sql);

        const histogram = histogramData.map((row) => ({
            time: row.IntervalStart * interval,
            count: Number(row.Count),
        }));

        console.log(histogram);
        return histogram;
    }

    async getLatencyHistogramGroup(
        start_comp: string,
        end_comp: string,
        interval: number,
        group: string,
        msg_type: string,
    ): Promise<any> {
        const start_comp_sec = `${start_comp}_sec`;
        const start_comp_nano = `${start_comp}_nano`;
        const end_comp_sec = `${end_comp}_sec`;
        const end_comp_nano = `${end_comp}_nano`;
        const group_by_field = `${group}`;
        const bucket = `${interval}`;

        const sql = `
            SELECT
                ${group_by_field},
                FLOOR(
                    ((${end_comp_sec} - ${start_comp_sec}) * 1000000000 + (${end_comp_nano} - ${start_comp_nano})) / ${bucket}
                ) AS IntervalStart,
                COUNT(*) AS Count
            FROM
                ${msg_type === 'order' ? 'OrderRequests' : 'DataRequests'}
            GROUP BY
                ${group_by_field}, IntervalStart
            ORDER BY
                ${group_by_field}, IntervalStart
        `;

        const histogramData = await this.prisma.$queryRawUnsafe<
            HistogramDataRow[]
        >(sql);

        const intervalData = {};
        const histograms = [];
        for (const row of histogramData) {
            const time = row.IntervalStart * interval;
            if (!intervalData[time]) intervalData[time] = {};
            intervalData[time][row[group_by_field]] = Number(row.Count);
        }

        for (const time in intervalData) {
            histograms.push({
                time: Number(time),
                ...intervalData[time],
            });
        }

        return histograms;
    }
}
