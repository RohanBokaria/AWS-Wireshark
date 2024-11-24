export type PCAPRawDataType = {
    rawhex: string;
    sll_packet_type: string;
    sll_address_type: string;
    sll_address_length: string;
    sll_source_address: string;
    sll_protocol: string;
    ip_version: string;
    ip_header_length: string;
    ip_type_of_service: string;
    ip_total_length: string;
    ip_id: string;
    ip_offset: string;
    ip_time_to_live: string;
    ip_protocol: string;
    ip_checksum: string;
    ip_src_ip: string;
    ip_dst_ip: string;
    udp_src_port: string;
    udp_dst_port: string;
    udp_total_length: string;
    udp_checksum: string;
    fix_begin_string: string;
    fix_body_length: string;
    fix_msg_type: string;
    fix_sender_comp_id: string;
    fix_target_comp_id: string;
    fix_msg_seq_num: string;
    fix_sent_tstamp: string;
    fix_cl0rdid: string;
    fix_symbol: string;
    fix_ord_status: string;
    fix_side: string;
    fix_ord_type: string;
    fix_ord_qty: string;
    fix_time_in_force: string;
    fix_price: string;
    fix_mdreq_id: string;
    fix_checksum: string;
};

export type RawPCAPType = {
    tstamp_sec: number;
    tstamp_nano: number;
    capture_length: number;
    total_length: number;
    raw_data: PCAPRawDataType;
};

export type FixType = 'ORDER' | 'MKT_REQ' | 'EXEC_ORD' | 'MKT_RES';
export type MsgState =
    | 'GW_IN'
    | 'ACK_OUT'
    | 'DRPCPY_IN'
    | 'OME_IN'
    | 'TICKER_IN'
    | 'PRIV_OUT'
    | 'PUBL_OUT';

export type SingleOrderPacket = {
    id: number;
    fix_type: FixType;
    msg_state: MsgState;
    sender: string;
    target: string;
    tstamp_sec: number;
    tstamp_nano: number;
};

export type OrderPackets = {
    order_id: string;
    order_packets: SingleOrderPacket[];
};
