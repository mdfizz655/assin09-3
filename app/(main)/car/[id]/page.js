"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { authApi } from "@/lib/axios";
import { toast } from "react-hot-toast";
import Image from "next/image";
import { FaUserFriends, FaMapMarkerAlt, FaCogs, FaGasPump, FaStar } from "react-icons/fa";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://server09.onrender.com";

export default function CarDetailsPage() {
  const { id }            = useParams();
  const { data: session } = useSession();
  const router            = useRouter();

  const [car, setCar]         = useState(null);
  const [isModal, setIsModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);

  useEffect(() => {
    if (!id) return;
    fetch(`${API_URL}/cars/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Not found");
        return res.json();
      })
      .then((data) => { setCar(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [id]);

  const handleBooking = async (e) => {
    e.preventDefault();
    if (!session) return router.push("/login");
    setBooking(true);

    const bookingInfo = {
      carId:        car._id,
      carName:      car.name,
      price:        car.dailyPrice,
      image:        car.image,
      userEmail:    session.user?.email,
      driverNeeded: e.target.driver.value,
      specialNote:  e.target.note.value,
      status:       "Confirmed",
    };

    try {
      const res = await authApi(session.accessToken).post("/bookings", bookingInfo);
      if (res.data.insertedId) {
        toast.success("Booked Successfully! 🎉");
        setIsModal(false);
        router.push("/my-bookings");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Booking failed. Please try again.");
    } finally {
      setBooking(false);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center py-32">
        <div className="spinner" />
      </div>
    );

  if (!car)
    return (
      <div className="text-center py-32">
        <p className="text-6xl mb-4">😕</p>
        <h2 className="text-2xl font-bold text-gray-600 mb-2">Car not found</h2>
        <a href="/cars" className="text-blue-600 font-semibold hover:underline text-sm">← Back to Cars</a>
      </div>
    );

  return (
    <div className="py-10 px-4 max-w-6xl mx-auto">
      <div className="flex items-center gap-2 text-sm text-gray-400 mb-8">
        <a href="/cars" className="hover:text-blue-600 transition-colors">Cars</a>
        <span>/</span>
        <span className="text-gray-700 font-medium truncate max-w-xs">{car.name}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="relative w-full h-[340px] md:h-[400px] rounded-2xl overflow-hidden shadow-xl bg-gray-100">
          {car.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={car.image}
              alt={car.name}
              className="w-full h-full object-cover"
              onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=800"; }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-300 text-6xl">🚗</div>
          )}
          <div className="absolute top-4 left-4 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full">
            {car.type}
          </div>
          {car.availability === "Unavailable" && (
            <div className="absolute top-4 right-4 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full">
              Unavailable
            </div>
          )}
        </div>

        <div className="flex flex-col justify-between space-y-5">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-2">{car.name}</h1>
            <p className="flex items-center gap-2 text-gray-500 text-sm mb-3">
              <FaMapMarkerAlt className="text-blue-500 shrink-0" />
              {car.location}
            </p>
            <div className="flex items-center gap-1 mb-4">
              {[1,2,3,4,5].map(i => (
                <FaStar key={i} className="text-yellow-400 text-sm" />
              ))}
              <span className="text-gray-400 text-xs ml-1">(4.8)</span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {[
              { icon: <FaUserFriends className="text-blue-600 text-xl mx-auto mb-1" />, label: `${car.capacity} Seats` },
              { icon: <FaCogs className="text-blue-600 text-xl mx-auto mb-1" />,        label: "Automatic" },
              { icon: <FaGasPump className="text-blue-600 text-xl mx-auto mb-1" />,     label: "Petrol" },
            ].map((s, i) => (
              <div key={i} className="bg-gray-50 p-4 rounded-xl text-center border border-gray-100">
                {s.icon}
                <p className="font-bold text-sm text-gray-800">{s.label}</p>
              </div>
            ))}
          </div>

          {car.description && (
            <p className="text-gray-500 text-sm leading-relaxed bg-gray-50 p-4 rounded-xl">
              {car.description}
            </p>
          )}

          {car.booking_count > 0 && (
            <p className="text-xs text-orange-500 font-semibold">
              🔥 Booked {car.booking_count} time{car.booking_count !== 1 ? "s" : ""}
            </p>
          )}

          <div className="pt-4 border-t border-gray-100 flex justify-between items-center">
            <div>
              <span className="text-3xl font-black text-blue-600">${car.dailyPrice}</span>
              <span className="text-gray-400 text-sm"> / day</span>
            </div>
            <button
              onClick={() => setIsModal(true)}
              className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold text-sm hover:bg-blue-700 transition-all shadow-lg"
            >
              Book Now
            </button>
          </div>
        </div>
      </div>

      {isModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 px-4">
          <div className="bg-white p-8 rounded-2xl w-full max-w-md shadow-2xl">
            <h2 className="text-xl font-extrabold text-gray-900 mb-6">Confirm Your Booking</h2>

            <div className="bg-blue-50 rounded-xl p-4 mb-6 flex items-center gap-4">
              <div className="w-16 h-12 rounded-lg overflow-hidden shrink-0 bg-gray-200">
                <img
                  src={car.image}
                  alt={car.name}
                  className="w-full h-full object-cover"
                  onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=200"; }}
                />
              </div>
              <div>
                <p className="font-bold text-sm text-gray-900">{car.name}</p>
                <p className="text-blue-600 font-bold text-sm">${car.dailyPrice}/day</p>
              </div>
            </div>

            <form onSubmit={handleBooking} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1 block">
                  Driver Needed
                </label>
                <select
                  name="driver"
                  className="w-full p-3 text-sm border border-gray-200 rounded-xl outline-none focus:border-blue-500"
                >
                  <option value="No">No Driver</option>
                  <option value="Yes">Yes, Need Driver (+$20/day)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1 block">
                  Special Note <span className="font-normal text-gray-400">(optional)</span>
                </label>
                <textarea
                  name="note"
                  rows="3"
                  placeholder="Any special requests..."
                  className="w-full p-3 text-sm border border-gray-200 rounded-xl outline-none focus:border-blue-500 resize-none"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModal(false)}
                  className="flex-1 bg-gray-100 py-3 rounded-xl font-bold text-sm hover:bg-gray-200 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={booking}
                  className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-bold text-sm hover:bg-blue-700 transition-all disabled:opacity-60"
                >
                  {booking ? "Booking..." : "Confirm Booking"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}