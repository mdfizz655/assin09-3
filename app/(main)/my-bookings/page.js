"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { authApi } from "../../../lib/axios"; // ৩টি ডট
import { toast } from "react-hot-toast";
import Swal from "sweetalert2";
import { FaTrashAlt } from "react-icons/fa";

export default function MyBookingsPage() {
  const { data: session } = useSession();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (session?.accessToken && session?.user?.email) {
      authApi(session.accessToken)
        .get(`/my-bookings/${session.user.email}`)
        .then((res) => { setBookings(res.data); setLoading(false); })
        .catch(() => setLoading(false));
    }
  }, [session]);

  const handleCancel = (id) => {
    Swal.fire({ title: "Cancel booking?", icon: "warning", showCancelButton: true }).then((res) => {
      if (res.isConfirmed) {
        authApi(session.accessToken).delete(`/bookings/${id}`).then(() => {
          toast.success("Cancelled!");
          setBookings(bookings.filter(b => b._id !== id));
        });
      }
    });
  };

  if (loading) return <div className="flex justify-center py-20"><div className="spinner" /></div>;

  return (
    <div className="py-10 px-4">
      <h1 className="text-3xl font-extrabold mb-8">My Bookings</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {bookings.map(b => (
          <div key={b._id} className="bg-white border rounded-2xl overflow-hidden shadow-sm">
            <div className="relative h-40"><Image src={b.image || "https://images.unsplash.com/photo-1494976388531-d1058494cdd8"} alt={b.carName} fill className="object-cover" /></div>
            <div className="p-4">
              <h3 className="font-bold mb-2">{b.carName}</h3>
              <div className="flex justify-between items-center">
                <span className="font-bold text-blue-600">${b.price}/day</span>
                <button onClick={() => handleCancel(b._id)} className="text-red-500"><FaTrashAlt /></button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}