import React, { useState } from 'react';
import { PCAPPaginationType } from '../types/PCAPTypes';
import { createGenericStateContext } from './createGenericStateContext';

const [usePCAPPaginationContext, PCAPPaginationContextProvider] =
    createGenericStateContext<
        [
            PCAPPaginationType,
            React.Dispatch<React.SetStateAction<PCAPPaginationType>>,
        ]
    >();

const PCAPPaginationProvider = ({
    children,
}: {
    children: React.ReactNode;
}) => {
    const [paginationState, setPaginationState] = useState<PCAPPaginationType>({
        orderPageIndex: 0,
        orderPageSize: 20,
        dataPageIndex: 0,
        dataPageSize: 20,
    });

    return (
        <PCAPPaginationContextProvider
            value={[paginationState, setPaginationState]}
        >
            {children}
        </PCAPPaginationContextProvider>
    );
};

export { PCAPPaginationProvider, usePCAPPaginationContext };
