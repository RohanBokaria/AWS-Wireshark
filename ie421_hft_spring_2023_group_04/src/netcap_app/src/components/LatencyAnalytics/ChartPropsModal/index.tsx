import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { Select, Option, Input } from '@material-tailwind/react';
import { PrimitiveAtom, useAtom } from 'jotai';
import { ChartType } from '../../../types/ChartTypes';

const ChartPropsModal = ({
    stateAtom,
    stateArrayAtom,
}: {
    stateAtom: PrimitiveAtom<ChartType>;
    stateArrayAtom: PrimitiveAtom<ChartType[]>;
}) => {
    const [state, setState] = useAtom(stateAtom);
    const [, setStateArray] = useAtom(stateArrayAtom);

    const analysisOpts = [
        ['Running Average', 'running_avg'],
        ['Distribution Histogram', 'histogram'],
    ];

    const messageOpts = [
        ['Market Orders', 'order'],
        ['Market Data Requests', 'data'],
    ];

    const orderComponenntOpts = [
        ['Gateway Entry', 'gateway_in'],
        ['Ack Exit', 'ack_tstamp'],
        ['OME Entry', 'ome_in'],
        ['Ticker Entry', 'ticker_in'],
        ['Ticker (Public) Exit', 'public_out'],
        ['Ticker (Private) Exit', 'private_out'],
    ];

    const marketComponenntOpts = [
        ['Gateway Entry', 'gateway_in'],
        ['Ack Exit', 'ack_tstamp'],
        ['Drop Copy Entry', 'dropcopy_in'],
        ['Drop Copy Exit', 'private_out'],
    ];

    const refreshOpts = [
        ['0.5s', 500],
        ['1s', 1000],
        ['5s', 5000],
        ['10s', 10000],
    ];

    const granularityAvgOpts = [
        ['Live', 0],
        ['1s', 1000],
        ['5s', 5000],
        ['10s', 10000],
        ['15s', 15000],
        ['30s', 30000],
        ['60s', 60000],
    ];

    const granularityHistOpts = [
        ['5000ns', 5000],
        ['10000ns', 10000],
        ['15000ns', 15000],
        ['20000ns', 20000],
        ['25000ns', 25000],
        ['50000ns', 50000],
        ['100000ns', 100000],
    ];

    const groupingOpts = [
        ['None', 'None'],
        ['Trader', 'source'],
        ['Exchange', 'destination'],
    ];

    return (
        <Transition appear show={state.modalOpen} as={Fragment}>
            <Dialog
                as="div"
                className="relative z-10"
                onClose={() =>
                    setState((cur) => {
                        const newState = cur;
                        newState.modalOpen = false;
                        return newState;
                    })
                }
            >
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black bg-opacity-25" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4 text-center">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <Dialog.Panel className="w-full max-w-[50em] transform rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                                <Dialog.Title
                                    as="h3"
                                    className="text-lg font-medium leading-6 text-gray-900"
                                >
                                    {state.chart_title
                                        ? state.chart_title
                                        : `Chart ${state.chart_id}`}
                                </Dialog.Title>
                                <div className="grid grid-cols-6 gap-4 my-10">
                                    <div className="col-span-6 pb-[2em]">
                                        <Input
                                            color="green"
                                            variant="static"
                                            label="Chart Title"
                                            placeholder={`Chart ${state.chart_id}`}
                                            value={state.chart_title}
                                            onChange={(e) =>
                                                setState((cur) => {
                                                    const newState = cur;
                                                    newState.chart_title =
                                                        e.target.value;
                                                    return newState;
                                                })
                                            }
                                        />
                                    </div>
                                    <div className="col-span-4">
                                        <Select
                                            color="green"
                                            variant="outlined"
                                            label="Analysis Type"
                                            value={state.type}
                                            onChange={(value) =>
                                                setState((cur) => {
                                                    const newState = cur;
                                                    newState.type = value!;
                                                    newState.interval = 5000;
                                                    return newState;
                                                })
                                            }
                                        >
                                            {analysisOpts.map((opt) => (
                                                <Option
                                                    key={opt[1]}
                                                    value={opt[1]}
                                                >
                                                    {opt[0]}
                                                </Option>
                                            ))}
                                        </Select>
                                    </div>
                                    <div className="col-span-2">
                                        <Select
                                            color="green"
                                            variant="outlined"
                                            label="FIX Message Type"
                                            value={state.msg_type}
                                            onChange={(value) =>
                                                setState((cur) => {
                                                    const newState = cur;
                                                    newState.msg_type = value!;
                                                    newState.ref_comp =
                                                        'gateway_in';
                                                    newState.target_comp =
                                                        'ack_tstamp';
                                                    return newState;
                                                })
                                            }
                                        >
                                            {messageOpts.map((opt) => (
                                                <Option
                                                    key={opt[1]}
                                                    value={opt[1]}
                                                >
                                                    {opt[0]}
                                                </Option>
                                            ))}
                                        </Select>
                                    </div>
                                    <div className="col-span-3">
                                        {state.msg_type === 'order' && (
                                            <Select
                                                color="green"
                                                variant="outlined"
                                                label="Reference Component Timestamp"
                                                value={state.ref_comp}
                                                onChange={(value) =>
                                                    setState((cur) => {
                                                        const newState = cur;
                                                        newState.ref_comp =
                                                            value!;
                                                        return newState;
                                                    })
                                                }
                                            >
                                                {orderComponenntOpts.map(
                                                    (opt) => (
                                                        <Option
                                                            key={opt[1]}
                                                            value={opt[1]}
                                                        >
                                                            {opt[0]}
                                                        </Option>
                                                    ),
                                                )}
                                            </Select>
                                        )}
                                        {state.msg_type === 'data' && (
                                            <Select
                                                color="green"
                                                variant="outlined"
                                                label="Reference Component Timestamp"
                                                value={state.ref_comp}
                                                onChange={(value) =>
                                                    setState((cur) => {
                                                        const newState = cur;
                                                        newState.ref_comp =
                                                            value!;
                                                        return newState;
                                                    })
                                                }
                                            >
                                                {marketComponenntOpts.map(
                                                    (opt) => (
                                                        <Option
                                                            key={opt[1]}
                                                            value={opt[1]}
                                                        >
                                                            {opt[0]}
                                                        </Option>
                                                    ),
                                                )}
                                            </Select>
                                        )}
                                    </div>
                                    <div className="col-span-3">
                                        {state.msg_type === 'order' && (
                                            <Select
                                                color="green"
                                                variant="outlined"
                                                label="Target Component Timestamp"
                                                value={state.target_comp}
                                                onChange={(value) =>
                                                    setState((cur) => {
                                                        const newState = cur;
                                                        newState.target_comp =
                                                            value!;
                                                        return newState;
                                                    })
                                                }
                                            >
                                                {orderComponenntOpts.map(
                                                    (opt) => (
                                                        <Option
                                                            key={opt[1]}
                                                            value={opt[1]}
                                                        >
                                                            {opt[0]}
                                                        </Option>
                                                    ),
                                                )}
                                            </Select>
                                        )}
                                        {state.msg_type === 'data' && (
                                            <Select
                                                color="green"
                                                variant="outlined"
                                                label="Target Component Timestamp"
                                                value={state.target_comp}
                                                onChange={(value) =>
                                                    setState((cur) => {
                                                        const newState = cur;
                                                        newState.target_comp =
                                                            value!;
                                                        return newState;
                                                    })
                                                }
                                            >
                                                {marketComponenntOpts.map(
                                                    (opt) => (
                                                        <Option
                                                            key={opt[1]}
                                                            value={opt[1]}
                                                        >
                                                            {opt[0]}
                                                        </Option>
                                                    ),
                                                )}
                                            </Select>
                                        )}
                                    </div>
                                    <div className="col-span-2">
                                        <Select
                                            color="green"
                                            variant="outlined"
                                            label="Refresh Rate"
                                            value={String(state.refresh_rate)}
                                            onChange={(value) =>
                                                setState((cur) => {
                                                    const newState = cur;
                                                    newState.refresh_rate =
                                                        Number(value!);
                                                    return newState;
                                                })
                                            }
                                        >
                                            {refreshOpts.map((opt) => (
                                                <Option
                                                    key={opt[1]}
                                                    value={String(opt[1])}
                                                >
                                                    {opt[0]}
                                                </Option>
                                            ))}
                                        </Select>
                                    </div>
                                    <div className="col-span-2">
                                        {state.type === 'histogram' && (
                                            <Select
                                                color="green"
                                                variant="outlined"
                                                label="Resolution"
                                                value={String(state.interval)}
                                                onChange={(value) =>
                                                    setState((cur) => {
                                                        const newState = cur;
                                                        newState.interval =
                                                            Number(value!);
                                                        return newState;
                                                    })
                                                }
                                            >
                                                {granularityHistOpts.map(
                                                    (opt) => (
                                                        <Option
                                                            key={opt[1]}
                                                            value={String(
                                                                opt[1],
                                                            )}
                                                        >
                                                            {opt[0]}
                                                        </Option>
                                                    ),
                                                )}
                                            </Select>
                                        )}
                                        {state.type === 'running_avg' && (
                                            <Select
                                                color="green"
                                                variant="outlined"
                                                label="Running Avg Interval"
                                                value={String(state.interval)}
                                                onChange={(value) =>
                                                    setState((cur) => {
                                                        const newState = cur;
                                                        newState.interval =
                                                            Number(value!);
                                                        return newState;
                                                    })
                                                }
                                            >
                                                {granularityAvgOpts.map(
                                                    (opt) => (
                                                        <Option
                                                            key={opt[1]}
                                                            value={String(
                                                                opt[1],
                                                            )}
                                                        >
                                                            {opt[0]}
                                                        </Option>
                                                    ),
                                                )}
                                            </Select>
                                        )}
                                    </div>
                                    <div className="col-span-2">
                                        <Select
                                            color="green"
                                            variant="outlined"
                                            label="Grouping"
                                            value={state.group_by}
                                            onChange={(value) =>
                                                setState((cur) => {
                                                    const newState = cur;
                                                    newState.group_by = value!;
                                                    return newState;
                                                })
                                            }
                                        >
                                            {groupingOpts.map((opt) => (
                                                <Option
                                                    key={opt[1]}
                                                    value={opt[1]}
                                                >
                                                    {opt[0]}
                                                </Option>
                                            ))}
                                        </Select>
                                    </div>
                                </div>
                                <div className="flex mt-4 justify-between">
                                    <button
                                        type="button"
                                        className="font-semibold inline-flex justify-center rounded-md border border-transparent bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2"
                                        onClick={() => {
                                            setState((cur) => {
                                                const newState = cur;
                                                newState.modalOpen = false;
                                                return newState;
                                            });
                                            setStateArray((cur) =>
                                                cur.filter(
                                                    (s) =>
                                                        s.chart_id !==
                                                        state.chart_id,
                                                ),
                                            );
                                        }}
                                    >
                                        Delete Chart
                                    </button>
                                    <button
                                        type="button"
                                        className="font-semibold inline-flex justify-center rounded-md border border-transparent bg-lime-100 px-4 py-2 text-sm font-medium text-lime-900 hover:bg-lime-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-lime-500 focus-visible:ring-offset-2"
                                        onClick={() =>
                                            setState((cur) => {
                                                const newState = cur;
                                                newState.modalOpen = false;
                                                return newState;
                                            })
                                        }
                                    >
                                        Done
                                    </button>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
};

export default ChartPropsModal;
