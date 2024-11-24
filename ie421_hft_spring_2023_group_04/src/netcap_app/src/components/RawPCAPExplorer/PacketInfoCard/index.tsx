import { useQuery } from '@tanstack/react-query';
import { useRawPCAPContext } from '../../../providers/RawPCAPProvider';
import {
    Accordion,
    AccordionHeader,
    AccordionBody,
} from '@material-tailwind/react';
import { useState } from 'react';

const Icon = ({ open }: { open: boolean }) => {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`${
                open ? 'rotate-180' : ''
            } h-5 w-5 transition-transform`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19 9l-7 7-7-7"
            />
        </svg>
    );
};

const PacketInfoCard = () => {
    const [selectedPacket] = useRawPCAPContext();
    const { data: packetInfo } = useQuery({
        queryKey: ['PCAPDetailsQuery', selectedPacket],
        queryFn: async ({ queryKey }) => {
            const [_, selectedPacket] = queryKey;
            const res = await fetch(
                `http://${process.env.REACT_APP_BACKEND_IP}:3000/getRawPCAPDetails?id=${selectedPacket}`,
            );
            const result = (await res.json()).raw_data;
            const layers: { [key: string]: any[] } = {};
            for (const key in result) {
                if (key === 'rawhex') continue;
                const prefix = key.split('_')[0];
                if (!(prefix in layers)) layers[prefix] = [];
                layers[prefix].push([key, result[key]]);
            }

            return layers;
        },
    });

    const [openSLL, setOpenSLL] = useState(true);
    const [openIP, setOpenIP] = useState(true);
    const [openTCP, setOpenTCP] = useState(true);
    const [openUDP, setOpenUDP] = useState(true);
    const [openFIX, setOpenFIX] = useState(true);

    const handleOpenSLL = () => setOpenSLL((cur) => !cur);
    const handleOpenIP = () => setOpenIP((cur) => !cur);
    const handleOpenTCP = () => setOpenTCP((cur) => !cur);
    const handleOpenUDP = () => setOpenUDP((cur) => !cur);
    const handleOpenFIX = () => setOpenFIX((cur) => !cur);

    return (
        <div className="h-full rounded-xl p-5 bg-white shadow-md overflow-auto scrollbar scrollbar-thin scrollbar-thumb-rounded-full scrollbar-track-rounded-full scrollbar-thumb-gray-400 scrollbar-track-gray-200">
            {!packetInfo && (
                <div className="flex w-full h-full justify-center items-center font-semibold text-gray-300 text-2xl flex-col">
                    <h1>Select a Packet</h1>
                    <h1>For More Information</h1>
                </div>
            )}
            {packetInfo && 'sll' in packetInfo && (
                <Accordion open={openSLL} icon={<Icon open={openSLL} />}>
                    <AccordionHeader onClick={handleOpenSLL}>
                        Link Layer Information
                    </AccordionHeader>
                    <AccordionBody>
                        <table>
                            <tbody>
                                {packetInfo.sll.map((elem) => (
                                    <tr
                                        key={elem[0]}
                                        className="divide-x divide-gray-200"
                                    >
                                        <td className="whitespace-nowrap py-1 pl-4 pr-4 text-sm font-medium text-gray-900 sm:pl-0">
                                            {elem[0]
                                                .split('_')
                                                .map((tok: string, i: number) =>
                                                    i == 0
                                                        ? tok.toUpperCase()
                                                        : tok[0].toUpperCase() +
                                                          tok.substring(1),
                                                )
                                                .join(' ')}
                                        </td>
                                        <td className="whitespace-nowrap py-1 px-4 text-sm text-gray-500">
                                            {elem[1]}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </AccordionBody>
                </Accordion>
            )}
            {packetInfo && 'ip' in packetInfo && (
                <Accordion open={openIP} icon={<Icon open={openIP} />}>
                    <AccordionHeader onClick={handleOpenIP}>
                        IP Information
                    </AccordionHeader>
                    <AccordionBody>
                        <table>
                            <tbody>
                                {packetInfo.ip.map((elem) => (
                                    <tr
                                        key={elem[0]}
                                        className="divide-x divide-gray-200"
                                    >
                                        <td className="whitespace-nowrap py-1 pl-4 pr-4 text-sm font-medium text-gray-900 sm:pl-0">
                                            {elem[0]
                                                .split('_')
                                                .map((tok: string, i: number) =>
                                                    i == 0
                                                        ? tok.toUpperCase()
                                                        : tok[0].toUpperCase() +
                                                          tok.substring(1),
                                                )
                                                .join(' ')}
                                        </td>
                                        <td className="whitespace-nowrap py-1 px-4 text-sm text-gray-500">
                                            {elem[1]}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </AccordionBody>
                </Accordion>
            )}
            {packetInfo && 'tcp' in packetInfo && (
                <Accordion open={openTCP} icon={<Icon open={openTCP} />}>
                    <AccordionHeader onClick={handleOpenTCP}>
                        TCP Information
                    </AccordionHeader>
                    <AccordionBody>
                        <table>
                            <tbody>
                                {packetInfo.tcp.map((elem) => (
                                    <tr
                                        key={elem[0]}
                                        className="divide-x divide-gray-200"
                                    >
                                        <td className="whitespace-nowrap py-1 pl-4 pr-4 text-sm font-medium text-gray-900 sm:pl-0">
                                            {elem[0]
                                                .split('_')
                                                .map((tok: string, i: number) =>
                                                    i == 0
                                                        ? tok.toUpperCase()
                                                        : tok[0].toUpperCase() +
                                                          tok.substring(1),
                                                )
                                                .join(' ')}
                                        </td>
                                        <td className="whitespace-nowrap py-1 px-4 text-sm text-gray-500">
                                            {elem[1]}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </AccordionBody>
                </Accordion>
            )}
            {packetInfo && 'udp' in packetInfo && (
                <Accordion open={openUDP} icon={<Icon open={openUDP} />}>
                    <AccordionHeader onClick={handleOpenUDP}>
                        UDP Information
                    </AccordionHeader>
                    <AccordionBody>
                        <table>
                            <tbody>
                                {packetInfo.udp.map((elem) => (
                                    <tr
                                        key={elem[0]}
                                        className="divide-x divide-gray-200"
                                    >
                                        <td className="whitespace-nowrap py-1 pl-4 pr-4 text-sm font-medium text-gray-900 sm:pl-0">
                                            {elem[0]
                                                .split('_')
                                                .map((tok: string, i: number) =>
                                                    i == 0
                                                        ? tok.toUpperCase()
                                                        : tok[0].toUpperCase() +
                                                          tok.substring(1),
                                                )
                                                .join(' ')}
                                        </td>
                                        <td className="whitespace-nowrap py-1 px-4 text-sm text-gray-500">
                                            {elem[1]}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </AccordionBody>
                </Accordion>
            )}
            {packetInfo && 'fix' in packetInfo && (
                <Accordion open={openFIX} icon={<Icon open={openFIX} />}>
                    <AccordionHeader onClick={handleOpenFIX}>
                        FIX Information
                    </AccordionHeader>
                    <AccordionBody>
                        <table>
                            <tbody>
                                {packetInfo.fix.map((elem) => (
                                    <tr
                                        key={elem[0]}
                                        className="divide-x divide-gray-200"
                                    >
                                        <td className="whitespace-nowrap py-1 pl-4 pr-4 text-sm font-medium text-gray-900 sm:pl-0">
                                            {elem[0]
                                                .split('_')
                                                .map((tok: string, i: number) =>
                                                    i == 0
                                                        ? tok.toUpperCase()
                                                        : tok[0].toUpperCase() +
                                                          tok.substring(1),
                                                )
                                                .join(' ')}
                                        </td>
                                        <td className="whitespace-nowrap py-1 px-4 text-sm text-gray-500">
                                            {elem[1]}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </AccordionBody>
                </Accordion>
            )}
        </div>
    );
};

export default PacketInfoCard;
