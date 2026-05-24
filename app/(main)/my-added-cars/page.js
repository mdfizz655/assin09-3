"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import { authApi } from "../../../lib/axios";
import { toast } from "react-hot-toast";
import Swal from "sweetalert2";
import { FaEdit, FaTrashAlt, FaPlus } from "react-icons/fa";

export default function MyAddedCarsPage() {
  const { data: session } = useSession();
  const [myCars, setMyCars]   = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (session?.accessToken && session?.user?.email) {
      authApi(session.accessToken)
        .get(`/my-cars/${session.user.email}`)
        .then((res) => { setMyCars(res.data); setLoading(false); })
        .catch((err) => {
          console.error(err);
          toast.error("Failed to load cars");
          setLoading(false);
        });
    }
  }, [session]);

  const handleDelete = (id) => {
    Swal.fire({
      title: "Delete this listing?",
      text: "This cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, Delete",
    }).then((result) => {
      if (result.isConfirmed) {
        authApi(session.accessToken)
          .delete(`/cars/${id}`)
          .then(() => {
            toast.success("Car deleted!");
            setMyCars((prev) => prev.filter((c) => c._id !== id));
          })
          .catch(() => toast.error("Delete failed"));
      }
    });
  };

  if (loading)
    return <div className="flex justify-center py-24"><div className="spinner" /></div>;

  return (
    <div className="py-10 px-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900">My Listed Cars</h1>
          <p className="text-gray-500 text-sm mt-1">{myCars.length} car{myCars.length !== 1 ? "s" : ""} listed</p>
        </div>
        <Link
          href="/add-car"
          className="flex items-center gap-2 bg-blue-600 text-white text-sm px-5 py-2.5 rounded-xl font-semibold hover:bg-blue-700 w-fit"
        >
          <FaPlus className="text-xs" /> Add New Car
        </Link>
      </div>

      {myCars.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
          <p className="text-5xl mb-4">🚗</p>
          <p className="text-lg font-bold text-gray-600 mb-2">No cars listed yet</p>
          <Link href="/add-car" className="inline-block mt-4 bg-blue-600 text-white text-sm px-8 py-3 rounded-xl font-bold hover:bg-blue-700">
            List Your First Car
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="p-4 text-left text-xs font-bold text-gray-500 uppercase">Image</th>
                  <th className="p-4 text-left text-xs font-bold text-gray-500 uppercase">Name</th>
                  <th className="p-4 text-left text-xs font-bold text-gray-500 uppercase">Price/Day</th>
                  <th className="p-4 text-left text-xs font-bold text-gray-500 uppercase">Type</th>
                  <th className="p-4 text-left text-xs font-bold text-gray-500 uppercase">Status</th>
                  <th className="p-4 text-left text-xs font-bold text-gray-500 uppercase">Bookings</th>
                  <th className="p-4 text-center text-xs font-bold text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {myCars.map((car) => (
                  <tr key={car._id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4">
                      <div className="relative w-16 h-12 rounded-lg overflow-hidden bg-gray-100">
                        <Image src={car.image} alt={car.name} fill className="object-cover" />
                      </div>
                    </td>
                    <td className="p-4 font-semibold text-gray-900 text-sm">{car.name}</td>
                    <td className="p-4 font-bold text-blue-600 text-sm">${car.dailyPrice}</td>
                    <td className="p-4">
                      <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-bold">{car.type}</span>
                    </td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        car.availability === "Available"
                          ? "bg-green-50 text-green-700"
                          : "bg-red-50 text-red-600"
                      }`}>
                        {car.availability || "Available"}
                      </span>
                    </td>
                    <td className="p-4 text-sm text-gray-500 font-medium">{car.booking_count || 0}</td>
                    <td className="p-4">
                      <div className="flex justify-center gap-2">
                        <Link
                          href={`/update-car/${car._id}`}
                          className="flex items-center gap-1 bg-blue-600 text-white text-xs px-3 py-1.5 rounded-lg font-bold hover:bg-blue-700"
                        >
                          <FaEdit className="text-[10px]" /> Edit
                        </Link>
                        <button
                          onClick={() => handleDelete(car._id)}
                          className="flex items-center gap-1 bg-red-500 text-white text-xs px-3 py-1.5 rounded-lg font-bold hover:bg-red-600"
                        >
                          <FaTrashAlt className="text-[10px]" /> Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
