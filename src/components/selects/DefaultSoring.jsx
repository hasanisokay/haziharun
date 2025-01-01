"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const DefaultSorting = ({ sortingOptionsProps, field = "sort" }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [sortOption, setSortOption] = useState('all');
  const [sortingOptions, setSortingOptions] = useState(sortingOptionsProps)
  useEffect(() => {
    setSortingOptions(sortingOptionsProps)
    if (searchParams) {
      setSortOption(searchParams.get(field) || "all");
    }
  }, [sortingOptionsProps, searchParams, field]);

  const handleSortChange = (option) => {
    const params = new URLSearchParams(searchParams);
    params.set(field || "sort", option);
    params.set("page", 1);
    router.push(`?${params.toString()}`);
  };
  return (
    <div className="flex justify-center">
      <div className="flex items-center space-x-2 bg-gray-100 dark:bg-gray-800 p-2 rounded-lg shadow-md">
        {sortingOptions.map(({ value, label }) => (
          <button
            key={value}
            onClick={() => handleSortChange(value)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition ${sortOption === value
              ? "bg-blue-500 text-white shadow dark:bg-blue-600"
              : "bg-white text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
              }`}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}

export default DefaultSorting;