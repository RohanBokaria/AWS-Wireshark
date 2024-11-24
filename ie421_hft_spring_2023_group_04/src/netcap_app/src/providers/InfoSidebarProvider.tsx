import { useState } from 'react';
import { createGenericStateContext } from './createGenericStateContext';
import { InfoSidebarType } from '../types/PCAPTypes';

const [useInfoSidebarContext, InfoSidebarContextProvider] =
    createGenericStateContext<
        [InfoSidebarType, React.Dispatch<React.SetStateAction<InfoSidebarType>>]
    >();

const InfoSidebarProvider = ({ children }: { children: React.ReactNode }) => {
    const [infoSidebarState, setInfoSidebarState] = useState<InfoSidebarType>({
        isOpen: false,
        state: {
            order_id: 'err',
            ack_tstamp_sec: -1,
            ack_tstamp_nano: -1,
            gateway_in_sec: -1,
            gateway_in_nano: -1,
            ome_in_sec: -1,
            ome_in_nano: -1,
            ticker_in_sec: -1,
            ticker_in_nano: -1,
            public_out_sec: -1,
            public_out_nano: -1,
            private_out_sec: -1,
            private_out_nano: -1,
            destination: 'err',
            source: 'err',
        },
    });
    return (
        <InfoSidebarContextProvider
            value={[infoSidebarState, setInfoSidebarState]}
        >
            {children}
        </InfoSidebarContextProvider>
    );
};

export { InfoSidebarProvider, useInfoSidebarContext };
