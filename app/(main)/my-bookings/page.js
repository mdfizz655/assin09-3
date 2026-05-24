"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { authApi } from "@/lib/axios";
import { toast } from "react-hot-toast";
import Swal from "sweetalert2";
import { FaCalendarAlt, FaCar, FaTrashAlt } from "react-icons/fa";
import Link from "next/link";

export default function MyBookingsPage() {
  const { data: session } = useSession();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    if (session?.accessToken && session?.user?.email) {
      authApi(session.accessToken)
        .get(`/my-bookings/${session.user.email}`)
        .then((res) => { setBookings(res.data); setLoading(false); })
        .catch((err) => {
          console.error(err);
          toast.error("Failed to load bookings");
          setLoading(false);
        });
    }
  }, [session]);

  const handleCancel = (id) => {
    Swal.fire({
      title: "Cancel this booking?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor:  "#6b7280",
      confirmButtonText:  "Yes, Cancel",
      cancelButtonText:   "Keep it",
    }).then((result) => {
      if (result.isConfirmed) {
        authApi(session.accessToken)
          .delete(`/bookings/${id}`)
          .then(() => {
            toast.success("Booking cancelled.");
            setBookings((prev) => prev.filter((b) => b._id !== id));
          })
          .catch(() => toast.error("Failed to cancel booking"));
      }
    });
  };

  if (loading)
    return (
      <div className="flex justify-center items-center py-32">
        <div className="spinner" />
      </div>
    );

  return (
    <div className="py-10 px-4 min-h-screen">
      {/* Header with count */}
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-1">My Bookings</h1>
        <div className="flex items-center gap-3 mt-3">
          <div className="bg-blue-600 text-white text-sm font-bold px-4 py-1.5 rounded-full">
            {bookings.length} Total Booking{bookings.length !== 1 ? "s" : ""}
          </div>
          <div className="bg-green-100 text-green-700 text-sm font-bold px-4 py-1.5 rounded-full">
            {bookings.filter(b => b.status === "Confirmed").length} Confirmed
          </div>
        </div>
      </div>

      {bookings.length === 0 ? (
        <div className="text-center py-24 bg-white rounded-2xl border border-gray-100">
          <p className="text-6xl mb-4">📋</p>
          <p className="text-xl font-bold text-gray-600 mb-2">No bookings yet</p>
          <p className="text-gray-400 text-sm mb-6">Browse our fleet and book your first ride!</p>
          <Link
            href="/cars"
            className="inline-block bg-blue-600 text-white text-sm px-8 py-3 rounded-xl font-bold hover:bg-blue-700 transition-all"
          >
            Explore Cars
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {bookings.map((b) => (
            <div
              key={b._id}
              className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-md transition-all"
            >
              {/* Car Image */}
              <div className="relative w-full h-44 bg-gray-100">
                <img
                  src={b.image || "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=500"}
                  alt={b.carName}
                  className="w-full h-full object-cover"
                  onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=500"; }}
                />
                <span className={`absolute top-3 right-3 text-xs font-bold px-3 py-1 rounded-full ${
                  b.status === "Confirmed"
                    ? "bg-green-100 text-green-700"
                    : "bg-gray-100 text-gray-500"
                }`}>
                  {b.status || "Confirmed"}
                </span>
              </div>

              <div className="p-5">
                <h3 className="text-base font-bold text-gray-900 mb-3">{b.carName}</h3>

                <div className="space-y-2 text-sm text-gray-500 mb-4">
                  {/* Booking Date */}
                  <div className="flex items-center gap-2">
                    <FaCalendarAlt className="text-blue-500 text-xs shrink-0" />
                    <span>{b.bookingDate || "N/A"}</span>
                  </div>

                  {/* Driver */}
                  {b.driverNeeded === "Yes" && (
                    <div className="flex items-center gap-2">
                      <FaCar className="text-orange-400 text-xs shrink-0" />
                      <span className="text-orange-500 font-semibold">Driver included (+$20/day)</span>
                    </div>
                  )}

                  {/* Special Note */}
                  {b.specialNote && (
                    <p className="text-xs text-gray-400 italic bg-gray-50 p-2.5 rounded-lg mt-1">
                      &ldquo;{b.specialNote}&rdquo;
                    </p>
                  )}
                </div>

                {/* Price + Cancel */}
                <div className="flex justify-between items-center border-t border-gray-50 pt-4">
                  <div>
                    <span className="text-xl font-extrabold text-blue-600">${b.price}</span>
                    <span className="text-gray-400 text-xs font-normal">/day</span>
                  </div>
                  <button
                    onClick={() => handleCancel(b._id)}
                    className="flex items-center gap-1.5 bg-red-50 text-red-500 hover:bg-red-100 border border-red-200 px-3 py-1.5 rounded-lg text-xs font-bold transition-all"
                  >
                    <FaTrashAlt className="text-[10px]" /> Cancel
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
