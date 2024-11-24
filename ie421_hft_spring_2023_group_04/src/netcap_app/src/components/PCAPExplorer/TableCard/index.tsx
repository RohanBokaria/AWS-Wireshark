import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    useReactTable,
} from '@tanstack/react-table';
import { useInfoSidebarContext } from '../../../providers/InfoSidebarProvider';
import { DataRequests, OrderRequests } from '../../../types/PCAPTypes';

const TableCard = ({
    requestData,
    requestType,
}: {
    requestData: OrderRequests[] | DataRequests[];
    requestType: 'ORDER' | 'MARKET_DATA';
}) => {
    const [, setInfoSidebarState] = useInfoSidebarContext();

    const orderColumns: ColumnDef<OrderRequests>[] = [
        {
            header: 'Order ID',
            accessorKey: 'order_id',
        },
        {
            header: 'Trader ID',
            accessorKey: 'source',
        },
        {
            header: 'Exchange ID',
            accessorKey: 'destination',
        },
        {
            header: 'Time Sent',
            accessorFn: (row) =>
                new Date(
                    row.gateway_in_sec * 1000 +
                        Number(String(row.gateway_in_nano).slice(0, 4)),
                ).toLocaleString(),
        },
        {
            header: 'Time Processed',
            accessorFn: (row) =>
                new Date(
                    row.private_out_sec * 1000 +
                        Number(String(row.private_out_nano).slice(0, 4)),
                ).toLocaleString(),
        },
        {
            header: 'Packet Details',
            accessorFn: (row) => {
                return row;
            },
            cell: ({ getValue }) => {
                return (
                    <button
                        className={
                            'rounded-md bg-lime-100 px-2.5 py-1.5 text-sm font-semibold text-lime-900 shadow-sm hover:bg-lime-200'
                        }
                        onClick={() =>
                            setInfoSidebarState({
                                isOpen: true,
                                state: getValue() as OrderRequests,
                            })
                        }
                    >
                        View Details
                    </button>
                );
            },
        },
    ];

    const mktDataColumns: ColumnDef<DataRequests>[] = [
        {
            header: 'Order ID',
            accessorKey: 'order_id',
        },
        {
            header: 'Trader ID',
            accessorKey: 'source',
        },
        {
            header: 'Exchange ID',
            accessorKey: 'destination',
        },
        {
            header: 'Time Sent',
            accessorFn: (row) =>
                new Date(
                    row.gateway_in_sec * 1000 +
                        Number(String(row.gateway_in_nano).slice(0, 4)),
                ).toLocaleString(),
        },
        {
            header: 'Time Processed',
            accessorFn: (row) =>
                new Date(
                    row.private_out_sec * 1000 +
                        Number(String(row.private_out_nano).slice(0, 4)),
                ).toLocaleString(),
        },
        {
            header: 'Packet Details',
            accessorFn: (row) => {
                return row;
            },
            cell: ({ getValue }) => {
                return (
                    <button
                        className={
                            'rounded-md bg-lime-100 px-2.5 py-1.5 text-sm font-semibold text-lime-900 shadow-sm hover:bg-lime-200'
                        }
                        onClick={() =>
                            setInfoSidebarState({
                                isOpen: true,
                                state: getValue() as DataRequests,
                            })
                        }
                    >
                        View Details
                    </button>
                );
            },
        },
    ];
    const orderTable = useReactTable({
        data: requestData as OrderRequests[],
        columns: orderColumns,
        getCoreRowModel: getCoreRowModel(),
    });

    const mktDataTable = useReactTable({
        data: requestData as DataRequests[],
        columns: mktDataColumns,
        getCoreRowModel: getCoreRowModel(),
    });

    if (requestData.length < 1) return <></>;
    return (
        <div className="h-[calc(100vh-15rem)] overflow-y-auto scrollbar scrollbar-thin scrollbar-thumb-rounded-full scrollbar-track-rounded-full scrollbar-thumb-gray-400 scrollbar-track-gray-200">
            <div className="px-4 sm:px-6 lg:px-8">
                <div className="sm:flex sm:items-center -mx-4">
                    <div className="sm:flex-auto">
                        <h1 className="text-base font-semibold leading-6 text-gray-900">
                            {requestType === 'ORDER'
                                ? 'Market Order Requests'
                                : 'Market Data Requests'}
                        </h1>
                        <p className="mt-2 text-sm text-gray-700">
                            A list of all completed simulated market{' '}
                            {requestType === 'ORDER'
                                ? 'orders'
                                : 'data requests'}{' '}
                            on the network.
                        </p>
                    </div>
                </div>
                <div className="mt-8 flow-root">
                    <div className="-mx-4 -my-2">
                        <div className="inline-block min-w-full py-2 align-middle">
                            <table className="min-w-full border-separate border-spacing-0">
                                <thead>
                                    {requestType === 'ORDER' &&
                                        orderTable
                                            .getHeaderGroups()
                                            .map((headerGroup) => (
                                                <tr key={headerGroup.id}>
                                                    {headerGroup.headers.map(
                                                        (header) => (
                                                            <th
                                                                key={header.id}
                                                                scope="col"
                                                                className="sticky top-0 z-10 hidden border-b border-gray-300 bg-white bg-opacity-75 px-2 py-3.5 text-left text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter sm:table-cell"
                                                            >
                                                                {header.isPlaceholder
                                                                    ? null
                                                                    : flexRender(
                                                                          header
                                                                              .column
                                                                              .columnDef
                                                                              .header,
                                                                          header.getContext(),
                                                                      )}
                                                            </th>
                                                        ),
                                                    )}
                                                </tr>
                                            ))}
                                    {requestType === 'MARKET_DATA' &&
                                        mktDataTable
                                            .getHeaderGroups()
                                            .map((headerGroup) => (
                                                <tr key={headerGroup.id}>
                                                    {headerGroup.headers.map(
                                                        (header) => (
                                                            <th
                                                                key={header.id}
                                                                scope="col"
                                                                className="sticky top-0 z-10 hidden border-b border-gray-300 bg-white bg-opacity-75 px-2 py-3.5 text-left text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter sm:table-cell"
                                                            >
                                                                {header.isPlaceholder
                                                                    ? null
                                                                    : flexRender(
                                                                          header
                                                                              .column
                                                                              .columnDef
                                                                              .header,
                                                                          header.getContext(),
                                                                      )}
                                                            </th>
                                                        ),
                                                    )}
                                                </tr>
                                            ))}
                                </thead>
                                <tbody className="divide-y divide-gray-200 bg-white">
                                    {requestType === 'ORDER' &&
                                        orderTable
                                            .getRowModel()
                                            .rows.map((row) => (
                                                <tr key={row.id}>
                                                    {row
                                                        .getVisibleCells()
                                                        .map((cell) => (
                                                            <td
                                                                className="whitespace-nowrap px-2 py-4 text-sm text-gray-500"
                                                                key={cell.id}
                                                            >
                                                                {flexRender(
                                                                    cell.column
                                                                        .columnDef
                                                                        .cell,
                                                                    cell.getContext(),
                                                                )}
                                                            </td>
                                                        ))}
                                                </tr>
                                            ))}
                                    {requestType === 'MARKET_DATA' &&
                                        mktDataTable
                                            .getRowModel()
                                            .rows.map((row) => (
                                                <tr key={row.id}>
                                                    {row
                                                        .getVisibleCells()
                                                        .map((cell) => (
                                                            <td
                                                                className="whitespace-nowrap px-2 py-4 text-sm text-gray-500"
                                                                key={cell.id}
                                                            >
                                                                {flexRender(
                                                                    cell.column
                                                                        .columnDef
                                                                        .cell,
                                                                    cell.getContext(),
                                                                )}
                                                            </td>
                                                        ))}
                                                </tr>
                                            ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TableCard;
