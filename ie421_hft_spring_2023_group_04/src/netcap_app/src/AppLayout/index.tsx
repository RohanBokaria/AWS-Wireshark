import { Fragment, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import {
    Bars3Icon,
    ChartPieIcon,
    CircleStackIcon,
    CubeIcon,
    HomeIcon,
    XMarkIcon,
} from '@heroicons/react/24/outline';
import Dashboard from '../components/Dashboard';
import { Link, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import LatencyAnalytics from '../components/LatencyAnalytics';
import PCAPExplorer from '../components/PCAPExplorer';
import { PCAPPaginationProvider } from '../providers/PCAPPaginationProvider';
import { InfoSidebarProvider } from '../providers/InfoSidebarProvider';
import { ChartArrayProvider } from '../providers/ChartArrayProvider';
import RawPCAPExplorer from '../components/RawPCAPExplorer';
import NetcapLogo from '../assets/NetcapLogo.svg';

const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: HomeIcon, current: true },
    {
        name: 'Latency Analytics',
        href: '/latency_analytics',
        icon: ChartPieIcon,
        current: false,
    },
    {
        name: 'Order Explorer',
        href: '/order_explorer',
        icon: CircleStackIcon,
        current: false,
    },
    {
        name: 'PCAP Explorer',
        href: '/pcap_explorer',
        icon: CircleStackIcon,
        current: false,
    },
];

function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(' ');
}

const AppLayout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const curPage = useLocation();
    return (
        <>
            <div>
                <Transition.Root show={sidebarOpen} as={Fragment}>
                    <Dialog
                        as="div"
                        className="relative z-50 lg:hidden"
                        onClose={setSidebarOpen}
                    >
                        <Transition.Child
                            as={Fragment}
                            enter="transition-opacity ease-linear duration-300"
                            enterFrom="opacity-0"
                            enterTo="opacity-100"
                            leave="transition-opacity ease-linear duration-300"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                        >
                            <div className="fixed inset-0 bg-gray-900/80" />
                        </Transition.Child>

                        <div className="fixed inset-0 flex">
                            <Transition.Child
                                as={Fragment}
                                enter="transition ease-in-out duration-300 transform"
                                enterFrom="-translate-x-full"
                                enterTo="translate-x-0"
                                leave="transition ease-in-out duration-300 transform"
                                leaveFrom="translate-x-0"
                                leaveTo="-translate-x-full"
                            >
                                <Dialog.Panel className="relative mr-16 flex w-full max-w-xs flex-1">
                                    <Transition.Child
                                        as={Fragment}
                                        enter="ease-in-out duration-300"
                                        enterFrom="opacity-0"
                                        enterTo="opacity-100"
                                        leave="ease-in-out duration-300"
                                        leaveFrom="opacity-100"
                                        leaveTo="opacity-0"
                                    >
                                        <div className="absolute left-full top-0 flex w-16 justify-center pt-5">
                                            <button
                                                type="button"
                                                className="-m-2.5 p-2.5"
                                                onClick={() =>
                                                    setSidebarOpen(false)
                                                }
                                            >
                                                <span className="sr-only">
                                                    Close sidebar
                                                </span>
                                                <XMarkIcon
                                                    className="h-6 w-6 text-white"
                                                    aria-hidden="true"
                                                />
                                            </button>
                                        </div>
                                    </Transition.Child>
                                    {/* Sidebar component, swap this element with another sidebar if you like */}
                                    <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-gray-900 px-6 pb-2 ring-1 ring-white/10">
                                        <div className="flex h-16 shrink-0 items-center justify-center mb-[3em] mt-[4em]">
                                            <img
                                                src={NetcapLogo}
                                                alt="Netcap Logo"
                                            />
                                        </div>
                                        <nav className="flex flex-1 flex-col">
                                            <ul
                                                role="list"
                                                className="flex flex-1 flex-col gap-y-7"
                                            >
                                                <li>
                                                    <ul
                                                        role="list"
                                                        className="-mx-2 space-y-1"
                                                    >
                                                        {navigation.map(
                                                            (item) => (
                                                                <li
                                                                    key={
                                                                        item.name
                                                                    }
                                                                >
                                                                    <Link
                                                                        to={
                                                                            item.href
                                                                        }
                                                                        className={classNames(
                                                                            item.current
                                                                                ? 'bg-gray-800 text-white'
                                                                                : 'text-gray-400 hover:text-white hover:bg-gray-800',
                                                                            'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold',
                                                                        )}
                                                                    >
                                                                        <item.icon
                                                                            className="h-6 w-6 shrink-0"
                                                                            aria-hidden="true"
                                                                        />
                                                                        {
                                                                            item.name
                                                                        }
                                                                    </Link>
                                                                </li>
                                                            ),
                                                        )}
                                                    </ul>
                                                </li>
                                            </ul>
                                        </nav>
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </Dialog>
                </Transition.Root>
                {/* Static sidebar for desktop */}
                <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
                    {/* Sidebar component, swap this element with another sidebar if you like */}
                    <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-gray-900 px-6">
                        <div className="flex h-16 shrink-0 items-center justify-center mb-[3em] mt-[4em]">
                            <img src={NetcapLogo} alt="Netcap Logo" />
                        </div>
                        <nav className="flex flex-1 flex-col">
                            <ul
                                role="list"
                                className="flex flex-1 flex-col gap-y-7"
                            >
                                <li>
                                    <ul role="list" className="-mx-2 space-y-1">
                                        {navigation.map((item) => (
                                            <li key={item.name}>
                                                <a
                                                    href={item.href}
                                                    className={classNames(
                                                        item.href ===
                                                            curPage.pathname
                                                            ? 'bg-gray-800 text-white'
                                                            : 'text-gray-400 hover:text-white hover:bg-gray-800',
                                                        'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold',
                                                    )}
                                                >
                                                    <item.icon
                                                        className="h-6 w-6 shrink-0"
                                                        aria-hidden="true"
                                                    />
                                                    {item.name}
                                                </a>
                                            </li>
                                        ))}
                                    </ul>
                                </li>
                            </ul>
                        </nav>
                        <div className='text-white p-2 my-2'>
                            <p className='text-2xl'>UIUC IE421</p>
                            <a href='https://gitlab.engr.illinois.edu/ie421_high_frequency_trading_spring_2023/ie421_hft_spring_2023_group_04/group_04_project'
                                className='text-lime-400 no-underline hover:underline'>
                                Group 4 Final Project</a>
                            <div className='text-gray-500 grid grid-cols-2 mt-5'>
                                <p>Adrian Cheng</p>
                                <p>Zijing Wei</p>
                                <p>Yunfan Hu</p>
                                <p>Batuhan Usluel</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="sticky top-0 z-40 flex items-center gap-x-6 bg-gray-900 px-4 py-4 shadow-sm sm:px-6 lg:hidden">
                    <button
                        type="button"
                        className="-m-2.5 p-2.5 text-gray-400 lg:hidden"
                        onClick={() => setSidebarOpen(true)}
                    >
                        <span className="sr-only">Open sidebar</span>
                        <Bars3Icon className="h-6 w-6" aria-hidden="true" />
                    </button>
                    <div className="flex-1 text-sm font-semibold leading-6 text-white">
                        Dashboard
                    </div>
                </div>
                <main className="py-10 lg:pl-72">
                    <div className="px-4 sm:px-6 lg:px-8">
                        <Routes>
                            <Route
                                path="/"
                                element={<Navigate to="/dashboard" />}
                            />
                            <Route path="/dashboard" element={<Dashboard />} />
                            <Route
                                path="/latency_analytics"
                                element={
                                    <ChartArrayProvider>
                                        <LatencyAnalytics />
                                    </ChartArrayProvider>
                                }
                            />
                            <Route
                                path="/order_explorer"
                                element={
                                    <InfoSidebarProvider>
                                        <PCAPPaginationProvider>
                                            <PCAPExplorer />
                                        </PCAPPaginationProvider>
                                    </InfoSidebarProvider>
                                }
                            />
                            <Route
                                path="/pcap_explorer"
                                element={<RawPCAPExplorer />}
                            />
                        </Routes>
                    </div>
                </main>
            </div>
        </>
    );
};

export default AppLayout;
