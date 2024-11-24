export type OrderRequests = {
    order_id: string;
    ack_tstamp_sec: number;
    ack_tstamp_nano: number;
    gateway_in_sec: number;
    gateway_in_nano: number;
    ome_in_sec: number;
    ome_in_nano: number;
    ticker_in_sec: number;
    ticker_in_nano: number;
    public_out_sec: number;
    public_out_nano: number;
    private_out_sec: number;
    private_out_nano: number;
    destination: string;
    source: string;
};

export type DataRequests = {
    order_id: string;
    ack_tstamp_sec: number;
    ack_tstamp_nano: number;
    gateway_in_sec: number;
    gateway_in_nano: number;
    dropcopy_in_sec: number;
    dropcopy_in_nano: number;
    private_out_sec: number;
    private_out_nano: number;
    destination: string;
    source: string;
};

export type InfoSidebarType = {
    isOpen: boolean;
    state: OrderRequests | DataRequests;
};

export type PCAPPaginationType = {
    orderPageIndex: number;
    orderPageSize: number;
    dataPageIndex: number;
    dataPageSize: number;
};
