import React, { useState } from 'react';
import { ChartType } from '../types/ChartTypes';
import { createGenericStateContext } from './createGenericStateContext';

const [useChartArrayContext, ChartArrayContextProvider] =
    createGenericStateContext<
        [
            Map<number, ChartType>,
            React.Dispatch<React.SetStateAction<Map<number, ChartType>>>,
        ]
    >();

const ChartArrayProvider = ({ children }: { children: React.ReactNode }) => {
    const [chartArrayState, setChartArrayState] = useState<
        Map<number, ChartType>
    >(new Map());
    return (
        <ChartArrayContextProvider
            value={[chartArrayState, setChartArrayState]}
        >
            {children}
        </ChartArrayContextProvider>
    );
};

export { ChartArrayProvider, useChartArrayContext };
