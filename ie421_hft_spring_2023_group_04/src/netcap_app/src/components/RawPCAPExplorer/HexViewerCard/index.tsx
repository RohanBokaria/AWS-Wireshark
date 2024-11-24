import { useQuery } from '@tanstack/react-query';
import { useRawPCAPContext } from '../../../providers/RawPCAPProvider';

const HexViewerCard = () => {
    const [selectedPacket] = useRawPCAPContext();
    const { data: rawHex } = useQuery({
        queryKey: ['PCAPRawHexQuery', selectedPacket],
        queryFn: async ({ queryKey }) => {
            const [_, selectedPacket] = queryKey;
            const res = await fetch(
                `http://${process.env.REACT_APP_BACKEND_IP}:3000/getRawPCAPDetails?id=${selectedPacket}`,
            );
            return (await res.json()).raw_data.rawhex.match(/.{1,2}/g) || [];
        },
    });
    return (
        <div className="h-full rounded-xl p-5 bg-white shadow-md overflow-auto scrollbar scrollbar-thin scrollbar-thumb-rounded-full scrollbar-track-rounded-full scrollbar-thumb-gray-400 scrollbar-track-gray-200 flex justify-between items-start">
            {rawHex ? (
                <>
                    <div className="grid grid-cols-2 min-w-[25em] w-[35em] gap-4 mr-10">
                        <div className="grid grid-cols-8 h-min">
                            {rawHex
                                ?.filter((_: string, i: number) => i % 16 < 8)
                                .map((pair: string, i: number) => (
                                    <div key={`L${i}`}>{pair}</div>
                                ))}
                        </div>
                        <div className="grid grid-cols-8 h-min">
                            {rawHex
                                ?.filter((_: string, i: number) => i % 16 > 7)
                                .map((pair: string, i: number) => (
                                    <div key={`R${i}`}>{pair}</div>
                                ))}
                        </div>
                    </div>
                    <div className="min-w-[10em] w-[20em] grid grid-cols-2 gap-4">
                        <div className="grid grid-cols-8 h-min">
                            {rawHex
                                ?.filter((_: string, i: number) => i % 16 < 8)
                                .map((pair: string, i: number) =>
                                    parseInt(pair, 16) < 32 ||
                                    parseInt(pair, 16) > 126 ? (
                                        <div key={`L_ASC${i}`}>.</div>
                                    ) : (
                                        <div key={`L_ASC${i}`}>
                                            {String.fromCharCode(
                                                parseInt(pair, 16),
                                            )}
                                        </div>
                                    ),
                                )}
                        </div>
                        <div className="grid grid-cols-8 h-min">
                            {rawHex
                                ?.filter((_: string, i: number) => i % 16 > 7)
                                .map((pair: string, i: number) =>
                                    parseInt(pair, 16) < 32 ||
                                    parseInt(pair, 16) > 126 ? (
                                        <div key={`R_ASC${i}`}>.</div>
                                    ) : (
                                        <div key={`R_ASC${i}`}>
                                            {String.fromCharCode(
                                                parseInt(pair, 16),
                                            )}
                                        </div>
                                    ),
                                )}
                        </div>
                    </div>
                </>
            ) : (
                <div className="w-full h-full flex justify-center items-center font-semibold text-2xl text-gray-300">
                    Select a Packet to View Raw Hex Data
                </div>
            )}
        </div>
    );
};

export default HexViewerCard;
