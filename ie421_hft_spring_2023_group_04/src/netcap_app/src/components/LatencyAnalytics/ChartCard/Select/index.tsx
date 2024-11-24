const Select = ({
    title,
    options,
    defaultVal,
    onChange,
}: {
    title: string;
    options: [string, number][] | [string, string][];
    defaultVal: string;
    onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}) => {
    return (
        <div>
            <label
                htmlFor={title.toLowerCase()}
                className="block text-sm font-medium leading-6 text-gray-900"
            >
                {title}
            </label>
            <select
                id={title.toLowerCase()}
                name={title.toLowerCase()}
                className="bg-white mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
                defaultValue={defaultVal}
                onChange={(e) => onChange(e)}
            >
                {options.map((opt) => (
                    <option className="bg-white" key={opt[1]} value={opt[1]}>
                        {opt[0]}
                    </option>
                ))}
            </select>
        </div>
    );
};
export default Select;
