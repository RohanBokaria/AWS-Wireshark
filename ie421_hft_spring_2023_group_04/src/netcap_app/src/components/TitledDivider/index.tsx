const TitledDivider = ({ title }: { title: string }) => {
    return (
        <div className="relative mb-5">
            <div
                className="absolute inset-0 flex items-center"
                aria-hidden="true"
            >
                <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-start">
                <span className="bg-white pr-3 text-base font-semibold leading-6 text-gray-900">
                    {title}
                </span>
            </div>
        </div>
    );
};

export default TitledDivider;
