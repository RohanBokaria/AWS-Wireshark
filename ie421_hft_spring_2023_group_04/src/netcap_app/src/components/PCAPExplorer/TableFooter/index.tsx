import { usePCAPPaginationContext } from '../../../providers/PCAPPaginationProvider';

const TableFooter = ({
    handleNext,
    handlePrev,
    totalResultCount,
    requestType,
}: {
    handleNext: () => void;
    handlePrev: () => void;
    totalResultCount: number;
    requestType: 'ORDER' | 'MARKET_DATA';
}) => {
    const [paginationState] = usePCAPPaginationContext();

    return (
        <nav
            className="flex items-center justify-between border-t border-gray-200 bg-white px-4 pt-4 sm:px-6"
            aria-label="Pagination"
        >
            <div className="hidden sm:block">
                {requestType === 'ORDER' && (
                    <p className="text-sm text-gray-700">
                        Showing{' '}
                        <span className="font-medium">
                            {paginationState.orderPageIndex *
                                paginationState.orderPageSize}
                        </span>{' '}
                        to{' '}
                        <span className="font-medium">
                            {Math.min(
                                paginationState.orderPageIndex *
                                    paginationState.orderPageSize +
                                    paginationState.orderPageSize,
                                totalResultCount,
                            )}
                        </span>{' '}
                        of{' '}
                        <span className="font-medium">{totalResultCount}</span>{' '}
                        results
                    </p>
                )}
                {requestType === 'MARKET_DATA' && (
                    <p className="text-sm text-gray-700">
                        Showing{' '}
                        <span className="font-medium">
                            {paginationState.dataPageIndex *
                                paginationState.dataPageSize}
                        </span>{' '}
                        to{' '}
                        <span className="font-medium">
                            {Math.min(
                                paginationState.dataPageIndex *
                                    paginationState.dataPageSize +
                                    paginationState.dataPageSize,
                                totalResultCount,
                            )}
                        </span>{' '}
                        of{' '}
                        <span className="font-medium">{totalResultCount}</span>{' '}
                        results
                    </p>
                )}
            </div>
            <div className="flex flex-1 justify-between sm:justify-end">
                <button
                    onClick={handlePrev}
                    className="relative inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus-visible:outline-offset-0"
                >
                    Previous
                </button>
                <button
                    onClick={handleNext}
                    className="relative ml-3 inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus-visible:outline-offset-0"
                >
                    Next
                </button>
            </div>
        </nav>
    );
};

export default TableFooter;
