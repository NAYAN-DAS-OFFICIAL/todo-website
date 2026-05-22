interface FilterBarProps {
  currentFilter: string;
  setCurrentFilter: (filter: string) => void;
}

export default function FilterBar({
  currentFilter,
  setCurrentFilter,
}: FilterBarProps) {

  const filters = ["All", "Completed", "Pending"];

  return (

    <div className="flex gap-3 mb-8 justify-center">

      {filters.map((filter) => (

        <button
          key={filter}
          onClick={() => setCurrentFilter(filter)}
          className={`px-5 py-2 rounded-xl transition font-medium
          
          ${
            currentFilter === filter
              ? "bg-black text-white"
              : "bg-gray-200 text-black"
          }`}
        >
          {filter}
        </button>

      ))}

    </div>

  );
}