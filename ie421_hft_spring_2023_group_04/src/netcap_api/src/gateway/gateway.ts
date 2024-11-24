import { OnModuleInit } from '@nestjs/common';
import {
    MessageBody,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
} from '@nestjs/websockets';
import { RawPCAPService } from 'src/rawpcap.service';
import { Server } from 'socket.io';
import { RealDataRequestBody } from 'src/types/RealDataRequestBody';

@WebSocketGateway({ cors: true })
export class LiveDataGateway implements OnModuleInit {
    constructor(private readonly rawPCAPService: RawPCAPService) {}

    @WebSocketServer()
    server: Server;

    chartIntervals = new Map<number, NodeJS.Timer>();

    currentRequestBody: RealDataRequestBody[];

    onModuleInit() {
        this.server.on('connection', (socket) => {
            console.log(socket.id, 'connected');
            socket.on('disconnect', () => {
                console.log(socket.id, 'disconnected, clearing intervals');
                this.removeStaleIntervals([], this.currentRequestBody);
            });
        });
    }

    @SubscribeMessage('clientRequest')
    async onClientRequest(@MessageBody() body: RealDataRequestBody[]) {
        console.log(JSON.stringify(body, null, 2));
        if (this.isDuplicateRequest(body)) {
            console.log('duplicate!');
            return;
        }
        //this.removeStaleIntervals(body, this.currentRequestBody);
        this.currentRequestBody = body;
        for (const data of body) {
            this.analyze(data);
        }
    }

    @SubscribeMessage('activity')
    async onActivity(@MessageBody() body: { source: string; target: string }) {
        if (!body.source || /^127\.0\.0\..*/.test(body.source)) return;
        if (!body.target || /^127\.0\.0\..*/.test(body.target)) return;

        this.server.emit('graph', body);
    }

    async analyze(body: RealDataRequestBody) {
        switch (body.type) {
            case 'running_avg':
                this.average_component(
                    body,
                    body.ref_comp,
                    body.target_comp,
                    `${body.chart_id}`,
                );
                break;
            case 'histogram':
                this.histogram(
                    body,
                    body.ref_comp,
                    body.target_comp,
                    body.interval,
                );
                break;
        }
    }

    isDuplicateRequest(requestData: RealDataRequestBody[]): boolean {
        if (!this.currentRequestBody) return false;
        if (!requestData) return true;
        if (requestData.length != this.currentRequestBody.length) return false;
        return !requestData.filter(
            (data, i) =>
                !this.isDataBodyEquivalent(this.currentRequestBody[i], data),
        ).length;
    }

    removeStaleIntervals(
        cur: RealDataRequestBody[],
        orig: RealDataRequestBody[],
    ) {
        const removedData = orig
            ? cur
                ? orig.filter(
                      (dataBody) =>
                          !cur.filter((curDataBody) =>
                              this.isDataBodyEquivalent(dataBody, curDataBody),
                          ).length,
                  )
                : orig
            : [];
        const removedIds = removedData.map((data) => data.chart_id);

        for (const id of removedIds) {
            console.log(`Stopping interval for chart ${id}`);
            clearInterval(this.chartIntervals.get(id));
            this.chartIntervals.delete(id);
        }
    }

    isDataBodyEquivalent(
        first: RealDataRequestBody,
        second: RealDataRequestBody,
    ) {
        const firstKeys = Object.keys(first);
        const secondKeys = Object.keys(second);
        for (const key of firstKeys) {
            if (first[key] != second[key]) return false;
        }

        for (const key of secondKeys) {
            if (first[key] != second[key]) return false;
        }

        return true;
    }

    async average_component(
        body: RealDataRequestBody,
        start_comp: string,
        end_comp: string,
        cid: string,
    ) {
        this.chartIntervals.get(body.chart_id) &&
            clearInterval(this.chartIntervals.get(body.chart_id));
        if (body.stop) {
            console.log(`Stopping interval for chart ${body.chart_id}`);
            return;
        }

        this.chartIntervals.set(
            body.chart_id,
            setInterval(async () => {
                const time = Math.floor(Date.now() / 1000);
                const time_gte = time - body.interval;
                let avg_result: any;

                let res = {};
                if (body.group_by == 'None') {
                    if (body.interval == 0) {
                        avg_result =
                            await this.rawPCAPService.avgCompLatencyDiff(
                                time_gte,
                                start_comp,
                                end_comp,
                                true,
                                cid,
                            );
                        res = avg_result;
                    } else {
                        avg_result =
                            await this.rawPCAPService.avgCompLatencyDiff(
                                time_gte,
                                start_comp,
                                end_comp,
                                false,
                                cid,
                            );
                        res = avg_result;
                    }
                } else {
                    if (body.interval == 0) {
                        avg_result =
                            await this.rawPCAPService.avgCompLatencyDiffGroup(
                                time_gte,
                                start_comp,
                                end_comp,
                                body.group_by,
                                true,
                                cid,
                            );
                        res = avg_result;
                    } else {
                        avg_result =
                            await this.rawPCAPService.avgCompLatencyDiffGroup(
                                time_gte,
                                start_comp,
                                end_comp,
                                body.group_by,
                                false,
                                cid,
                            );
                        res = avg_result;
                    }
                }

                console.log(
                    `\nMessage sent to Chart ${body.chart_id}\n`,
                    JSON.stringify(res, null, 2),
                );
                this.server.emit(body.chart_id.toString(), res);
            }, body.refresh_rate),
        );
    }

    async histogram(
        body: RealDataRequestBody,
        start_comp: string,
        end_comp: string,
        interval: number,
    ) {
        this.chartIntervals.get(body.chart_id) &&
            clearInterval(this.chartIntervals.get(body.chart_id));
        if (body.stop) {
            console.log(`Stopping interval for chart ${body.chart_id}`);
            return;
        }
        this.chartIntervals.set(
            body.chart_id,
            setInterval(async () => {
                let res = {};
                if (body.group_by == 'None') {
                    res = await this.rawPCAPService.getLatencyHistogramData(
                        start_comp,
                        end_comp,
                        interval,
                        body.msg_type,
                    );
                    console.log(res);
                } else {
                    res = await this.rawPCAPService.getLatencyHistogramGroup(
                        start_comp,
                        end_comp,
                        interval,
                        body.group_by,
                        body.msg_type,
                    );
                    console.log(res);
                }

                console.log(
                    `\nMessage sent to Chart ${body.chart_id}\n`,
                    JSON.stringify(res, null, 2),
                );
                this.server.emit(body.chart_id.toString(), res);
            }, body.refresh_rate),
        );
    }
}
