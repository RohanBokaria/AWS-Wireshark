import { interval } from 'rxjs';

export type RealDataRequestBody = {
    chart_id: number;
    type: string;
    interval: number;
    group_by: string;
    refresh_rate: number;
    history_length: number;
    modalOpen: boolean;
    chart_title: string;
    stop: boolean;
    ref_comp: string;
    target_comp: string;
    msg_type: string;
};
