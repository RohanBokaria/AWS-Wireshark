import { createContext, useContext } from 'react';

export const createGenericStateContext = <T extends unknown>() => {
    const genericStateContext = createContext<T | undefined>(undefined);

    const useGenericContext = () => {
        const isContextDefined = useContext(genericStateContext);
        if (!isContextDefined) {
            throw new Error(
                'useGenericStateContext must be used within a Provider',
            );
        }
        return isContextDefined;
    };

    return [useGenericContext, genericStateContext.Provider] as const;
};
