"use client";
import { useEffect, useState } from "react";
import { api } from "../../../lib/axios"; // ৩টি ডট
import CarCard from "../../../components/CarCard"; // ৩টি ডট
import { FaSearch } from "react-icons/fa";
import { BsSortDown } from "react-icons/bs";

const TYPES = ["All", "SUV", "Sedan", "Hatchback", "Luxury"];
const SORTS = [
  { label: "Default", value: "" },
  { label: "Price: Low → High", value: "price_asc" },
  { label: "Price: High → Low", value: "price_desc" },
  { label: "Newest First", value: "newest" },
];

export default function ExploreCarsPage() {
  const [cars, setCars] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [sort, setSort] = useState("");
  const [loading, setLoading] = useState(true);
  const [inputVal, setInputVal] = useState("");

  useEffect(() => {
    const t = setTimeout(() => setSearch(inputVal), 400);
    return () => clearTimeout(t);
  }, [inputVal]);

  useEffect(() => {
    setLoading(true);
    api.get(`/cars?search=${search}&filter=${filter}&sort=${sort}`)
      .then((res) => { setCars(res.data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [search, filter, sort]);

  return (
    <div className="py-10 min-h-screen px-4">
      <h1 className="text-3xl font-extrabold mb-8">Explore Cars</h1>
      <div className="bg-white rounded-2xl border p-5 mb-8 flex flex-col gap-4">
        <div className="relative">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input type="text" placeholder="Search..." value={inputVal} onChange={(e)=>setInputVal(e.target.value)} className="w-full pl-10 pr-4 py-2 rounded-xl border outline-none" />
        </div>
        <div className="flex justify-between items-center flex-wrap gap-3">
          <div className="flex gap-2 flex-wrap">
            {TYPES.map(t => <button key={t} onClick={()=>setFilter(t)} className={`px-4 py-1.5 rounded-full text-xs font-bold ${filter===t?"bg-blue-600 text-white":"bg-gray-100"}`}>{t}</button>)}
          </div>
          <select value={sort} onChange={(e)=>setSort(e.target.value)} className="text-xs bg-gray-100 p-2 rounded-xl outline-none">
            {SORTS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>
        </div>
      </div>
      {loading ? <div className="flex justify-center py-20"><div className="spinner" /></div> : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {cars.map(car => <CarCard key={car._id} car={car} />)}
        </div>
      )}
    </div>
  );
}