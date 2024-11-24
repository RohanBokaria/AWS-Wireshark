import {
    CartesianGrid,
    Legend,
    Line,
    LineChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';
import { PauseIcon, PlayIcon, Cog8ToothIcon } from '@heroicons/react/20/solid';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import {
    ChartType,
    HistogramData,
    SocketResponse,
} from '../../../types/ChartTypes';
import { socket } from '../socket';
import dateFormat from 'dateformat';
import { useAtom, PrimitiveAtom } from 'jotai';

const ChartCard = ({
    chartStateAtom,
    setActiveChart,
}: {
    chartStateAtom: PrimitiveAtom<ChartType>;
    setActiveChart: Dispatch<SetStateAction<PrimitiveAtom<ChartType>>>;
}) => {
    const [chartState, setChartState] = useAtom(chartStateAtom);

    const [socketArray, setSocketArray] = useState<SocketResponse[]>([]);
    const [histArray, setHistArray] = useState<HistogramData[]>([]);
    const [xAxisKeys, setXAxisKeys] = useState<string[]>([]);

    useEffect(() => {
        socket.on(`${chartState.chart_id}`, (body: any) => {
            if (chartState.type === 'running_avg') {
                setXAxisKeys(Object.keys(body).filter((key) => key != 'time'));
                setSocketArray((cur) => [...cur, body]);
            } else {
                setXAxisKeys(
                    Array.from(
                        new Set(
                            body.flatMap((cur: any) =>
                                Object.keys(cur).filter((key) => key != 'time'),
                            ),
                        ),
                    ),
                );
                setHistArray(body as HistogramData[]);
            }
        });
        return () => {
            socket.off(`${chartState.chart_id}`);
        };
    }, [socketArray]);

    const pastelColors = [
        '#77DD77',
        '#836953',
        '#89cff0',
        '#99c5c4',
        '#9adedb',
        '#aa9499',
        '#aaf0d1',
        '#b2fba5',
    ];

    return (
        <div className="shadow-md w-auto rounded-lg bg-white p-5">
            <div className="relative mb-5">
                <div
                    className="absolute inset-0 flex items-center"
                    aria-hidden="true"
                ></div>
                <div className="relative flex justify-between items-center">
                    <span
                        className="bg-white pr-3 cursor-pointer"
                        onClick={() =>
                            setChartState((cur) => {
                                const newState = cur;
                                newState.stop = !cur.stop;
                                return newState;
                            })
                        }
                    >
                        {chartState.stop ? (
                            <PlayIcon className="h-5 fill-lime-400 hover:fill-lime-600" />
                        ) : (
                            <PauseIcon className="h-5 fill-gray-400 hover:fill-gray-300" />
                        )}
                    </span>
                    <span className="bg-white px-3 text-gray-500 font-semibold">
                        {chartState.chart_title
                            ? chartState.chart_title
                            : `Chart ${chartState.chart_id}`}
                    </span>
                    <span className="bg-white pl-3">
                        <Cog8ToothIcon
                            className="w-5 h-5 fill-gray-400 cursor-pointer hover:fill-gray-300"
                            onClick={() =>
                                setChartState((cur) => {
                                    setActiveChart(chartStateAtom);
                                    const newState = cur;
                                    newState.modalOpen = true;
                                    return newState;
                                })
                            }
                        />
                    </span>
                </div>
            </div>
            <div className="h-[15rem]">
                <ResponsiveContainer>
                    {chartState.type === 'running_avg' ? (
                        <LineChart data={socketArray.slice(-50)}>
                            <CartesianGrid strokeDasharray={'3 3'} />
                            <YAxis
                                type="number"
                                tickFormatter={(value) =>
                                    Number(value.toFixed(10)).toExponential()
                                }
                            />
                            <XAxis
                                tickFormatter={(value) => {
                                    try {
                                        return dateFormat(
                                            new Date(Number(value) * 10 ** 3),
                                            'MM:ss',
                                        );
                                    } catch {
                                        return '';
                                    }
                                }}
                                dataKey={'time'}
                            />
                            <Tooltip />
                            <Legend />
                            {xAxisKeys.map((key, index) => (
                                <Line
                                    type={'monotone'}
                                    key={`${key}-${index}`}
                                    dataKey={key}
                                    dot={false}
                                    stroke={
                                        pastelColors[
                                            pastelColors.length % index
                                        ]
                                    }
                                    isAnimationActive={false}
                                />
                            ))}
                        </LineChart>
                    ) : (
                        <LineChart data={histArray}>
                            <CartesianGrid strokeDasharray={'3 3'} />
                            <YAxis type="number" />
                            <XAxis dataKey={'time'} />
                            <Tooltip />
                            <Legend />
                            {xAxisKeys.map((key, index) => (
                                <Line
                                    type={'monotone'}
                                    key={`${key}-${index}`}
                                    dataKey={key}
                                    dot={false}
                                    stroke={
                                        pastelColors[
                                            pastelColors.length % index
                                        ]
                                    }
                                    isAnimationActive={false}
                                />
                            ))}
                        </LineChart>
                    )}
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default ChartCard;
