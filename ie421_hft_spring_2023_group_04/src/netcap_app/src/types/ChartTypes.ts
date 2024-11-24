export type ChartType = {
    chart_id: number;
    type: string | 'running_avg' | 'histogram';
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

export type HistogramData = {
    time: number;
    count: number;
};

export type SocketResponse =
    | {
          timestamp: number;
          latency: number;
      }
    | {
          timestamp: number;
          [key: string]: number;
      };
