import { Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';
import {
    EllipsisHorizontalIcon,
    ServerStackIcon,
    CpuChipIcon,
} from '@heroicons/react/20/solid';

type NetworkNode = {
    status: number;
    host_name: string;
    port: number;
    type: string;
    message_num: number;
};

function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(' ');
}

const statusStyles = new Map<number, string>([
    [1, 'text-green-700 bg-green-50 ring-green-600/20'],
    [0, 'text-gray-600 bg-gray-50 ring-gray-500/10'],
]);

const NodeStatusCard = ({ node }: { node: NetworkNode }) => {
    return (
        <li
            key={node.host_name}
            className="overflow-hidden rounded-xl border border-gray-200"
        >
            <div className="flex items-center gap-x-4 border-b border-gray-900/5 bg-gray-50 p-6">
                {node.type === 'Exchange' ? (
                    <ServerStackIcon className="h-12 w-12 p-1 flex-none rounded-lg bg-white object-cover ring-1 ring-gray-900/10 fill-pink-700" />
                ) : (
                    <CpuChipIcon className="h-12 w-12 p-1 flex-none rounded-lg bg-white object-cover ring-1 ring-gray-900/10 fill-blue-700" />
                )}
                <div className="text-sm font-medium leading-6 text-gray-900">
                    {node.host_name}
                </div>
                <Menu as="div" className="relative ml-auto">
                    <Menu.Button className="-m-2.5 block p-2.5 text-gray-400 hover:text-gray-500">
                        <span className="sr-only">Open options</span>
                        <EllipsisHorizontalIcon
                            className="h-5 w-5"
                            aria-hidden="true"
                        />
                    </Menu.Button>
                    <Transition
                        as={Fragment}
                        enter="transition ease-out duration-100"
                        enterFrom="transform opacity-0 scale-95"
                        enterTo="transform opacity-100 scale-100"
                        leave="transition ease-in duration-75"
                        leaveFrom="transform opacity-100 scale-100"
                        leaveTo="transform opacity-0 scale-95"
                    >
                        <Menu.Items className="absolute right-0 z-10 mt-0.5 w-32 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 focus:outline-none">
                            <Menu.Item>
                                {({ active }) => (
                                    <a
                                        href="#"
                                        className={classNames(
                                            active ? 'bg-gray-50' : '',
                                            'block px-3 py-1 text-sm leading-6 text-gray-900',
                                        )}
                                    >
                                        Start / Pause
                                        <span className="sr-only">
                                            , {node.host_name}
                                        </span>
                                    </a>
                                )}
                            </Menu.Item>
                        </Menu.Items>
                    </Transition>
                </Menu>
            </div>
            <dl className="-my-3 divide-y divide-gray-100 px-6 py-4 text-sm leading-6">
                <div className="flex justify-between gap-x-4 py-3">
                    <dt className="text-gray-500">Status</dt>
                    <dd
                        className={classNames(
                            statusStyles.get(node.status) ?? '',
                            'rounded-md py-1 px-2 text-xs font-medium ring-1 ring-inset',
                        )}
                    >
                        {node.status === 1 ? 'Running' : 'Paused'}
                    </dd>
                </div>
                <div className="flex justify-between gap-x-4 py-3">
                    <dt className="text-gray-500">Type</dt>
                    <dd className="text-gray-700">{node.type}</dd>
                </div>
                <div className="flex justify-between gap-x-4 py-3">
                    <dt className="text-gray-500">Port</dt>
                    <dd className="text-gray-700">{node.port}</dd>
                </div>
                <div className="flex justify-between gap-x-4 py-3">
                    <dt className="text-gray-500"># of Messages</dt>
                    <dd className="text-gray-700">{node.message_num}</dd>
                </div>
            </dl>
        </li>
    );
};

export default NodeStatusCard;
