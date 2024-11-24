import { useState } from 'react';
import { createGenericStateContext } from './createGenericStateContext';

const [useRawPCAPContext, RawPCAPContextProvider] =
    createGenericStateContext<
        [number, React.Dispatch<React.SetStateAction<number>>]
    >();

const RawPCAPProvider = ({ children }: { children: React.ReactNode }) => {
    const [chartArrayState, setRawPCAPState] = useState<number>(-1);
    return (
        <RawPCAPContextProvider value={[chartArrayState, setRawPCAPState]}>
            {children}
        </RawPCAPContextProvider>
    );
};

export { RawPCAPProvider, useRawPCAPContext };
