import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { useRawPCAPContext } from '../../../providers/RawPCAPProvider';
import { RawPCAPTableType } from '../../../types/RawPCAPTypes';

const pageSize = 100;

const RawPCAPTableCard = () => {
    const [selectedPCAP, setSelectedPCAP] = useRawPCAPContext();
    const [pageState, setPageState] = useState({
        current: 0,
        total: 0,
    });

    const {
        data: rawPCAPData,
        fetchNextPage,
        hasNextPage,
    } = useInfiniteQuery({
        queryKey: ['RawPCAPDataQuery'],
        queryFn: async ({ pageParam = 0 }) => {
            const res = await fetch(
                `http://${process.env.REACT_APP_BACKEND_IP}:3000/getRawPCAP?skip=${pageParam}&take=${pageSize}`,
            );
            const json = await res.json();
            setPageState((cur) => ({
                current:
                    pageParam + pageSize > cur.current
                        ? pageParam + pageSize
                        : cur.current,
                total: json.total,
            }));
            return json;
        },
        getNextPageParam: (lastPage) => Number(lastPage.skip) + pageSize,
        keepPreviousData: true,
    });

    const queryClient = useQueryClient();

    return (
        <div className="rounded-xl p-5 bg-white shadow-md">
            <div
                className="h-[calc(0.5*(100vh-10em))] overflow-y-auto scrollbar scrollbar-thin scrollbar-thumb-rounded-full scrollbar-track-rounded-full scrollbar-thumb-gray-400 scrollbar-track-gray-200"
                onScroll={(e) => {
                    const divTarget = e.target as HTMLDivElement;
                    const bottom =
                        divTarget.scrollHeight - divTarget.scrollTop ===
                        divTarget.clientHeight;
                    if (bottom && hasNextPage) fetchNextPage();
                }}
            >
                <div className="px-4 sm:px-6 lg:px-8">
                    <div className="sm:flex sm:items-center -mx-4">
                        <div className="sm:flex-auto">
                            <h1 className="text-base font-semibold leading-6 text-gray-900">
                                Network Traffic
                            </h1>
                            <p className="mt-2 text-sm text-gray-700">
                                A list of all the packets being sent on the
                                simulated trading network.
                            </p>
                        </div>
                    </div>
                    <div className="mt-8 flow-root">
                        <div className="-mx-4 -my-2">
                            <div className="inline-block min-w-full py-2 align-middle">
                                <table className="min-w-full divide-y divide-gray-300">
                                    <thead>
                                        <tr>
                                            <th
                                                scope="col"
                                                className="sticky top-0 z-10 hidden border-b border-gray-300 bg-white bg-opacity-75 px-3 py-3.5 text-left text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter sm:table-cell text-center"
                                            >
                                                Packet ID
                                            </th>
                                            <th
                                                scope="col"
                                                className="sticky top-0 z-10 hidden border-b border-gray-300 bg-white bg-opacity-75 px-3 py-3.5 text-left text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter sm:table-cell"
                                            >
                                                Recorded Timestamp
                                            </th>
                                            <th
                                                scope="col"
                                                className="sticky top-0 z-10 hidden border-b border-gray-300 bg-white bg-opacity-75 px-3 py-3.5 text-left text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter sm:table-cell"
                                            >
                                                Packet Length
                                            </th>
                                            <th
                                                scope="col"
                                                className="sticky top-0 z-10 hidden border-b border-gray-300 bg-white bg-opacity-75 px-3 py-3.5 text-left text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter sm:table-cell"
                                            >
                                                Source IP
                                            </th>
                                            <th
                                                scope="col"
                                                className="sticky top-0 z-10 hidden border-b border-gray-300 bg-white bg-opacity-75 px-3 py-3.5 text-left text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter sm:table-cell"
                                            >
                                                Destination IP
                                            </th>
                                            <th
                                                scope="col"
                                                className="sticky top-0 z-10 hidden border-b border-gray-300 bg-white bg-opacity-75 px-3 py-3.5 text-left text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter sm:table-cell"
                                            >
                                                Network Protocol
                                            </th>
                                            <th
                                                scope="col"
                                                className="sticky top-0 z-10 hidden border-b border-gray-300 bg-white bg-opacity-75 px-3 py-3.5 text-left text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter sm:table-cell"
                                            >
                                                IP Protocol
                                            </th>
                                            <th
                                                scope="col"
                                                className="sticky top-0 z-10 hidden border-b border-gray-300 bg-white bg-opacity-75 px-3 py-3.5 text-left text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter sm:table-cell"
                                            >
                                                TCP Flags
                                            </th>
                                            <th
                                                scope="col"
                                                className="sticky top-0 z-10 hidden border-b border-gray-300 bg-white bg-opacity-75 px-3 py-3.5 text-left text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter sm:table-cell"
                                            >
                                                Application Protocol
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {rawPCAPData?.pages
                                            .flatMap((page) => page.results)
                                            .map((pcap: RawPCAPTableType) => (
                                                <tr
                                                    key={pcap.id}
                                                    className={
                                                        pcap.id === selectedPCAP
                                                            ? 'bg-lime-100 cursor-pointer'
                                                            : 'bg-white cursor-pointer hover:bg-gray-100'
                                                    }
                                                    onClick={() => {
                                                        setSelectedPCAP((cur) =>
                                                            cur === pcap.id
                                                                ? -1
                                                                : pcap.id,
                                                        );
                                                        queryClient.invalidateQueries(
                                                            {
                                                                queryKey: [
                                                                    'PCAPDetailsQuery',
                                                                ],
                                                            },
                                                        );
                                                    }}
                                                >
                                                    <td className="whitespace-nowrap py-2 pl-4 pr-3 text-sm text-gray-500 sm:pl-0 text-center">
                                                        {pcap.id}
                                                    </td>
                                                    <td className="whitespace-nowrap px-2 py-2 text-sm font-medium text-gray-500">
                                                        {new Date(
                                                            pcap.time * 1000,
                                                        ).toLocaleString()}
                                                    </td>
                                                    <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">{`${pcap.length} B`}</td>
                                                    <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                                                        {pcap.source_ip}
                                                    </td>
                                                    <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                                                        {pcap.destination_ip}
                                                    </td>
                                                    <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                                                        {pcap.network_protocol}
                                                    </td>
                                                    <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                                                        {pcap.ip_protocol}
                                                    </td>
                                                    <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                                                        {pcap.tcp_flags}
                                                    </td>
                                                    <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                                                        {
                                                            pcap.application_protocol
                                                        }
                                                    </td>
                                                </tr>
                                            ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex justify-center mt-2">
                <div className="flex flex-row justify-center items-center bg-gray-100 rounded-2xl px-10">
                    <p className="text-gray-600 px-2">-- Showing</p>
                    <p className="text-lime-800 font-semibold">
                        {pageState.current}
                    </p>
                    <p className="text-gray-600 px-1">out of</p>
                    <p className="text-lime-800 font-semibold">
                        {pageState.total}
                    </p>
                    <p className="text-gray-600 px-1">packets --</p>
                </div>
            </div>
        </div>
    );
};

export default RawPCAPTableCard;
