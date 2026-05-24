"use client";
import { useEffect, useState } from "react";
import CarCard from "../../../components/CarCard";
import { FaSearch } from "react-icons/fa";
import { BsSortDown } from "react-icons/bs";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://server09.onrender.com";

const TYPES = ["All", "SUV", "Sedan", "Hatchback", "Luxury"];
const SORTS = [
  { label: "Default",           value: "" },
  { label: "Price: Low → High", value: "price_asc" },
  { label: "Price: High → Low", value: "price_desc" },
  { label: "Newest First",      value: "newest" },
];

export default function ExploreCarsPage() {
  const [cars, setCars]         = useState([]);
  const [search, setSearch]     = useState("");
  const [filter, setFilter]     = useState("All");
  const [sort, setSort]         = useState("");
  const [loading, setLoading]   = useState(true);
  const [inputVal, setInputVal] = useState("");

  // debounce
  useEffect(() => {
    const t = setTimeout(() => setSearch(inputVal), 400);
    return () => clearTimeout(t);
  }, [inputVal]);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (filter && filter !== "All") params.set("filter", filter);
    if (sort) params.set("sort", sort);

    fetch(`${API_URL}/cars?${params.toString()}`)
      .then((res) => res.json())
      .then((data) => { setCars(Array.isArray(data) ? data : []); setLoading(false); })
      .catch(() => setLoading(false));
  }, [search, filter, sort]);

  return (
    <div className="py-10 min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900">Explore Cars</h1>
        <p className="text-gray-500 text-sm mt-1">Find the perfect car for your journey</p>
      </div>

      {/* Search + Filter + Sort */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-8 flex flex-col gap-4">
        <div className="relative w-full">
          <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm pointer-events-none" />
          <input
            type="text"
            placeholder="Search by car name..."
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-gray-200 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 justify-between">
          <div className="flex flex-wrap gap-2">
            {TYPES.map((t) => (
              <button
                key={t}
                onClick={() => setFilter(t)}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                  filter === t
                    ? "bg-blue-600 text-white shadow-sm"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <BsSortDown className="text-gray-500 text-base" />
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="text-xs font-semibold text-gray-700 bg-gray-100 border-0 rounded-xl px-3 py-2 outline-none cursor-pointer"
            >
              {SORTS.map((s) => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Results */}
      {loading ? (
        <div className="flex justify-center py-24">
          <div className="spinner" />
        </div>
      ) : cars.length > 0 ? (
        <>
          <p className="text-sm text-gray-400 mb-4 font-medium">
            {cars.length} car{cars.length !== 1 ? "s" : ""} found
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {cars.map((car) => <CarCard key={car._id} car={car} />)}
          </div>
        </>
      ) : (
        <div className="text-center py-24">
          <p className="text-5xl mb-4">🚗</p>
          <h3 className="text-xl font-bold text-gray-400">No cars found</h3>
          <p className="text-gray-400 text-sm mt-1">Try a different search or filter</p>
          <button
            onClick={() => { setInputVal(""); setFilter("All"); setSort(""); }}
            className="mt-5 text-blue-600 font-semibold text-sm hover:underline"
          >
            Clear filters
          </button>
        </div>
      )}
    </div>
  );
}
