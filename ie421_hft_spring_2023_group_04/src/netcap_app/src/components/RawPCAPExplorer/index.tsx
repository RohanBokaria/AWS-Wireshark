import { RawPCAPProvider } from '../../providers/RawPCAPProvider';
import HexViewerCard from './HexViewerCard';
import PacketInfoCard from './PacketInfoCard';
import RawPCAPTableCard from './RawPCAPTableCard';

const RawPCAPExplorer = () => {
    return (
        <RawPCAPProvider>
            <h1 className="text-3xl mb-5 font-semibold text-gray-700">
                PCAP Explorer
            </h1>
            <div className="grid grid-cols-3 gap-4">
                <div className="col-span-3">
                    <RawPCAPTableCard />
                </div>
                <div className="h-[calc(0.5*(100vh-18.5em))]">
                    <PacketInfoCard />
                </div>
                <div className="col-span-2 h-[calc(0.5*(100vh-18.5em))]">
                    <HexViewerCard />
                </div>
            </div>
        </RawPCAPProvider>
    );
};

export default RawPCAPExplorer;
