import { useQuery } from '@tanstack/react-query';
import TableCard from './TableCard';
import TableFooter from './TableFooter';
import { DataRequests, OrderRequests } from '../../types/PCAPTypes';
import { useMemo, useState } from 'react';
import { usePCAPPaginationContext } from '../../providers/PCAPPaginationProvider';
import InfoSidebar from './InfoSidebar';

const PCAPExplorer = () => {
    const [paginationState, setPaginationState] = usePCAPPaginationContext();
    const [orderCount, setOrderCount] = useState(0);
    const [dataCount, setDataCount] = useState(0);

    const { data: orderData } = useQuery({
        queryKey: [
            'OrderDataQuery',
            paginationState.orderPageSize,
            paginationState.orderPageIndex,
        ],
        queryFn: async ({ queryKey }) => {
            const [, pageSize, pageIndex] = queryKey;
            const res = await fetch(
                `http://${
                    process.env.REACT_APP_BACKEND_IP
                }:3000/orderRequests?take=${pageSize}&skip=${
                    (pageIndex as number) * (pageSize as number)
                }`,
            );
            const json = await res.json();
            setOrderCount(json.count);
            return json;
        },
        keepPreviousData: true,
    });

    const { data: marketData } = useQuery({
        queryKey: [
            'MarketDataQuery',
            paginationState.dataPageSize,
            paginationState.dataPageIndex,
        ],
        queryFn: async ({ queryKey }) => {
            const [, pageSize, pageIndex] = queryKey;
            const res = await fetch(
                `http://${
                    process.env.REACT_APP_BACKEND_IP
                }:3000/marketDataRequests?take=${pageSize}&skip=${
                    (pageIndex as number) * (pageSize as number)
                }`,
            );
            const json = await res.json();
            setDataCount(json.count);
            return json;
        },
        keepPreviousData: true,
    });

    const orderDataMemo = useMemo<OrderRequests[]>(
        () => (orderData ? orderData.result : []),
        [orderData],
    );

    const marketDataMemo = useMemo<DataRequests[]>(
        () => (marketData ? marketData.result : []),
        [marketData],
    );
    return (
        <>
            <InfoSidebar />
            <h1 className="text-3xl mb-5 font-semibold text-gray-700">
                FIX Requests Explorer
            </h1>
            <div className="grid grid-cols-2 w-full gap-4">
                <div className="rounded-xl px-3 py-5 bg-white shadow-md">
                    <TableCard
                        requestData={orderDataMemo}
                        requestType="ORDER"
                    />
                    <TableFooter
                        requestType="ORDER"
                        handleNext={() => {
                            if (
                                (paginationState.orderPageIndex + 1) *
                                    paginationState.orderPageSize >=
                                orderCount
                            )
                                return;
                            setPaginationState((cur) => ({
                                orderPageIndex: cur.orderPageIndex + 1,
                                orderPageSize: paginationState.orderPageSize,
                                dataPageSize: cur.dataPageSize,
                                dataPageIndex: cur.dataPageIndex,
                            }));
                        }}
                        handlePrev={() => {
                            if (paginationState.orderPageIndex <= 0) return;
                            setPaginationState((cur) => ({
                                orderPageIndex: cur.orderPageIndex - 1,
                                orderPageSize: paginationState.orderPageSize,
                                dataPageSize: cur.dataPageSize,
                                dataPageIndex: cur.dataPageIndex,
                            }));
                        }}
                        totalResultCount={orderCount}
                    />
                </div>
                <div className="rounded-xl px-3 py-5 bg-white shadow-md">
                    <TableCard
                        requestData={marketDataMemo}
                        requestType="MARKET_DATA"
                    />
                    <TableFooter
                        requestType="MARKET_DATA"
                        handleNext={() => {
                            if (
                                (paginationState.dataPageIndex + 1) *
                                    paginationState.dataPageSize >=
                                dataCount
                            )
                                return;
                            setPaginationState((cur) => ({
                                dataPageIndex: cur.dataPageIndex + 1,
                                dataPageSize: paginationState.dataPageSize,
                                orderPageSize: cur.orderPageSize,
                                orderPageIndex: cur.orderPageIndex,
                            }));
                        }}
                        handlePrev={() => {
                            if (paginationState.dataPageIndex <= 0) return;
                            setPaginationState((cur) => ({
                                dataPageIndex: cur.dataPageIndex - 1,
                                dataPageSize: paginationState.dataPageSize,
                                orderPageSize: cur.orderPageSize,
                                orderPageIndex: cur.orderPageIndex,
                            }));
                        }}
                        totalResultCount={dataCount}
                    />
                </div>
            </div>
        </>
    );
};

export default PCAPExplorer;
