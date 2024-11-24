import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { useInfoSidebarContext } from '../../../providers/InfoSidebarProvider';
import { DataRequests, OrderRequests } from '../../../types/PCAPTypes';

const InfoSidebar = () => {
    const [infoSidebarState, setInfoSidebarState] = useInfoSidebarContext();
    const subtractStrings = (num1: string, num2: string): string => {
        // Convert the strings to arrays of digits and reverse them
        const digits1: number[] = Array.from(num1).map(Number).reverse();
        const digits2: number[] = Array.from(num2).map(Number).reverse();

        // Perform the subtraction
        const maxLength = Math.max(digits1.length, digits2.length);
        let carry = 0;
        const difference: number[] = [];

        for (let i = 0; i < maxLength; i++) {
            const digit1 = digits1[i] || 0;
            const digit2 = digits2[i] || 0;

            let digitDiff = digit1 - digit2 + carry;

            if (digitDiff < 0) {
                digitDiff += 10;
                carry = -1;
            } else {
                carry = 0;
            }

            difference.push(digitDiff);
        }

        // Remove leading zeros from the difference
        while (
            difference.length > 1 &&
            difference[difference.length - 1] === 0
        ) {
            difference.pop();
        }

        // Reverse the difference and convert it back to a string
        const result = difference.reverse().join('');

        return result;
    };

    const fields: { name: string; value: string }[] = Array.from(
        new Set<string>(
            Object.keys(infoSidebarState.state)
                .filter((key) => /.*(_nano|_sec)$/.test(key))
                .map((key) => key.replace(/(_nano|_sec)$/, '')),
        ),
    ).map((field) => ({
        name: field
            .split('_')
            .map((word) => `${word.charAt(0).toUpperCase()}${word.slice(1)}`)
            .join(' '),
        value:
            String(
                infoSidebarState.state[
                    `${field}_sec` as keyof (OrderRequests | DataRequests)
                ],
            ) +
            String(
                infoSidebarState.state[
                    `${field}_nano` as keyof (OrderRequests | DataRequests)
                ],
            ),
    }));

    return (
        <Transition.Root show={infoSidebarState.isOpen} as={Fragment}>
            <Dialog
                as="div"
                className="relative z-10"
                onClose={() => {
                    setInfoSidebarState((cur) => ({
                        isOpen: false,
                        state: cur.state,
                    }));
                }}
            >
                <Transition.Child
                    as={Fragment}
                    enter="ease-in-out duration-500"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in-out duration-500"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-hidden">
                    <div className="absolute inset-0 overflow-hidden">
                        <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
                            <Transition.Child
                                as={Fragment}
                                enter="transform transition ease-in-out duration-500 sm:duration-700"
                                enterFrom="translate-x-full"
                                enterTo="translate-x-0"
                                leave="transform transition ease-in-out duration-500 sm:duration-700"
                                leaveFrom="translate-x-0"
                                leaveTo="translate-x-full"
                            >
                                <Dialog.Panel className="pointer-events-auto relative w-96">
                                    <Transition.Child
                                        as={Fragment}
                                        enter="ease-in-out duration-500"
                                        enterFrom="opacity-0"
                                        enterTo="opacity-100"
                                        leave="ease-in-out duration-500"
                                        leaveFrom="opacity-100"
                                        leaveTo="opacity-0"
                                    >
                                        <div className="absolute left-0 top-0 -ml-8 flex pr-2 pt-4 sm:-ml-10 sm:pr-4">
                                            <button
                                                type="button"
                                                className="rounded-md text-gray-300 hover:text-white focus:outline-none focus:ring-2 focus:ring-white"
                                                onClick={() =>
                                                    setInfoSidebarState(
                                                        (cur) => ({
                                                            isOpen: false,
                                                            state: cur.state,
                                                        }),
                                                    )
                                                }
                                            >
                                                <span className="sr-only">
                                                    Close panel
                                                </span>
                                                <XMarkIcon
                                                    className="h-6 w-6"
                                                    aria-hidden="true"
                                                />
                                            </button>
                                        </div>
                                    </Transition.Child>
                                    <div className="h-full overflow-y-auto bg-white p-8">
                                        <div className="pb-8">
                                            <h3 className="font-medium text-gray-900">
                                                General Request Information
                                            </h3>
                                            <dl className="mt-2 divide-y divide-gray-200 border-b border-t border-gray-200">
                                                <div className="flex justify-between py-3 text-sm font-medium">
                                                    <dt className="text-gray-500">
                                                        Request ID
                                                    </dt>
                                                    <dd className="text-gray-900">
                                                        {
                                                            infoSidebarState
                                                                .state.order_id
                                                        }
                                                    </dd>
                                                </div>
                                                <div className="flex justify-between py-3 text-sm font-medium">
                                                    <dt className="text-gray-500">
                                                        Trader ID
                                                    </dt>
                                                    <dd className="text-gray-900">
                                                        {
                                                            infoSidebarState
                                                                .state.source
                                                        }
                                                    </dd>
                                                </div>
                                                <div className="flex justify-between py-3 text-sm font-medium">
                                                    <dt className="text-gray-500">
                                                        Exchange ID
                                                    </dt>
                                                    <dd className="text-gray-900">
                                                        {
                                                            infoSidebarState
                                                                .state
                                                                .destination
                                                        }
                                                    </dd>
                                                </div>
                                            </dl>
                                        </div>
                                        <div className="pb-8">
                                            <h3 className="font-medium text-gray-900">
                                                Absolute Timing Information
                                            </h3>
                                            <dl className="mt-2 divide-y divide-gray-200 border-b border-t border-gray-200">
                                                {fields.map((field) => (
                                                    <div
                                                        key={
                                                            field.name +
                                                            field.value
                                                        }
                                                        className="flex justify-between py-3 text-sm font-medium"
                                                    >
                                                        <dt className="text-gray-500">
                                                            {field.name}
                                                        </dt>
                                                        <dd className="text-gray-900">
                                                            {field.value}
                                                        </dd>
                                                    </div>
                                                ))}
                                            </dl>
                                        </div>
                                        <div className="pb-8">
                                            <h3 className="font-medium text-gray-900">
                                                Relative Timing Information
                                            </h3>
                                            <dl className="mt-2 divide-y divide-gray-200 border-b border-t border-gray-200">
                                                {fields
                                                    .filter(
                                                        (field) =>
                                                            field.name !==
                                                            'Gateway In',
                                                    )
                                                    .map((field) => (
                                                        <div
                                                            key={
                                                                field.name +
                                                                field.value
                                                            }
                                                            className="flex justify-between py-3 text-sm font-medium"
                                                        >
                                                            <dt className="text-gray-500">
                                                                {field.name}
                                                            </dt>
                                                            <dd className="text-gray-900">
                                                                {subtractStrings(
                                                                    field.value,
                                                                    fields.filter(
                                                                        (
                                                                            field,
                                                                        ) =>
                                                                            field.name ===
                                                                            'Gateway In',
                                                                    )[0].value,
                                                                )}
                                                            </dd>
                                                        </div>
                                                    ))}
                                            </dl>
                                        </div>
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </div>
            </Dialog>
        </Transition.Root>
    );
};

export default InfoSidebar;
