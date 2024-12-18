"use client";

import { useRouter, useSearchParams } from "next/navigation";

export default function SortingComponent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sortOption = searchParams.get("sort") || "all";

  // Bangla Labels for the sorting options
  const sortingOptions = [
    { value: "expired_items_only", label: "শুধু মেয়াদোত্তীর্ণ" },
    { value: "all", label: "সবগুলো" },
    { value: "non_expired", label: "মেয়াদ আছে এমন" },
  ];

  const handleSortChange = (option) => {
    const params = new URLSearchParams(searchParams);
    params.set("sort", option); 
    params.set("page", 1); 
    router.push(`?${params.toString()}`);
  };

  return (
    <div className="flex justify-center mt-4">
      <div className="flex items-center space-x-2 bg-gray-100 dark:bg-gray-800 p-2 rounded-lg shadow-md">
        {sortingOptions.map(({ value, label }) => (
          <button
            key={value}
            onClick={() => handleSortChange(value)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition ${
              sortOption === value
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
