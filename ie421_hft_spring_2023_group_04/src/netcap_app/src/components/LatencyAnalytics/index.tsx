import { useEffect, useState } from 'react';
import { socket } from './socket';
import ChartCard from './ChartCard';
import { PlusIcon } from '@heroicons/react/20/solid';
import { atom, PrimitiveAtom, useAtom } from 'jotai';
import { splitAtom } from 'jotai/utils';
import { ChartType } from '../../types/ChartTypes';
import ChartPropsModal from './ChartPropsModal';

const chartStateArrayAtom = atom<ChartType[]>([]);
const chartStateSplitAtom = splitAtom(chartStateArrayAtom);
const placeholderStateAtom = atom<ChartType>({
    chart_id: -1,
    chart_title: 'ERROR',
    type: 'err',
    interval: -1,
    group_by: 'err',
    refresh_rate: -1,
    history_length: -1,
    modalOpen: false,
    stop: true,
    ref_comp: 'err',
    target_comp: 'err',
    msg_type: 'err',
});

const LatencyAnalytics = () => {
    const [chartStateArray, setChartStateArray] = useAtom(chartStateArrayAtom);
    const [chartStates] = useAtom(chartStateSplitAtom);
    const [activeChartAtom, setActiveChart] =
        useState<PrimitiveAtom<ChartType>>(placeholderStateAtom);

    const [id, setId] = useState(0);

    useEffect(() => {
        socket.connect();
        return () => {
            socket.disconnect();
        };
    }, []);

    useEffect(() => {
        socket.emit('clientRequest', chartStateArray);
    }, [chartStateArray]);

    useEffect(() => {
        console.log(chartStateArray);
    }, [chartStateArray]);

    const defaultChartState = {
        chart_id: id,
        chart_title: '',
        type: 'running_avg',
        interval: 1000,
        refresh_rate: 1000,
        history_length: 20,
        group_by: 'None',
        modalOpen: false,
        stop: false,
        ref_comp: 'gateway_in',
        target_comp: 'ack_tstamp',
        msg_type: 'order',
    };

    return (
        <>
            <h1 className="text-3xl mb-5 font-semibold text-gray-700">
                Latency Analytics
            </h1>
            <ChartPropsModal
                stateAtom={activeChartAtom}
                stateArrayAtom={chartStateArrayAtom}
            />
            <div className="grid grid-cols-1 gap-x-3 gap-y-4 lg:grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 xl:gap-x-4">
                {Array.from(chartStates).map((chartStateAtom) => (
                    <ChartCard
                        key={chartStateAtom.toString()}
                        chartStateAtom={chartStateAtom}
                        setActiveChart={setActiveChart}
                    />
                ))}
                <div
                    className="flex justify-center items-center rounded-lg hover:bg-white/50 cursor-pointer flex-col py-[5em]"
                    onClick={() => {
                        setChartStateArray((cur) => [
                            ...cur,
                            defaultChartState,
                        ]);
                        setId((cur) => cur + 1);
                    }}
                >
                    <PlusIcon className="h-10 fill-gray-500" />
                    <h1 className="text-gray-500 font-semibold">
                        Add New Chart
                    </h1>
                </div>
            </div>
        </>
    );
};

export default LatencyAnalytics;
