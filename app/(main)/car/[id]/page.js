"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import axios from '../../../../lib/axios';
import { toast } from "react-hot-toast";
import Image from "next/image";
import { FaUserFriends, FaMapMarkerAlt, FaCogs, FaGasPump, FaStar } from "react-icons/fa";

export default function CarDetailsPage() {
  const { id } = useParams();
  const { data: session } = useSession();
  const router = useRouter();

  const [car, setCar] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);

  useEffect(() => {
    api
      .get(`/cars/${id}`)
      .then((res) => { setCar(res.data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [id]);

  const handleBooking = async (e) => {
    e.preventDefault();
    if (!session) return router.push("/login");
    setBooking(true);

    const bookingInfo = {
      carId: car._id,
      carName: car.name,
      price: car.dailyPrice,
      image: car.image,
      userEmail: session.user?.email,
      bookingDate: new Date().toLocaleDateString(),
      driverNeeded: e.target.driver.value,
      specialNote: e.target.note.value,
      status: "Confirmed",
    };

    try {
      const res = await authApi(session.accessToken).post("/bookings", bookingInfo);
      if (res.data.insertedId) {
        toast.success("Booked Successfully!");
        setIsModalOpen(false);
        router.push("/my-bookings");
      }
    } catch {
      toast.error("Booking failed. Please try again.");
    } finally {
      setBooking(false);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center py-24">
        <div className="spinner" />
      </div>
    );

  if (!car)
    return (
      <div className="text-center py-24">
        <div className="text-5xl mb-4">😕</div>
        <p className="text-xl font-bold text-gray-500">Car not found!</p>
      </div>
    );

  return (
    <div className="py-10 px-4 max-w-6xl mx-auto">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-400 mb-8">
        <a href="/cars" className="hover:text-blue-600 transition-colors">Cars</a>
        <span>/</span>
        <span className="text-gray-700 font-medium">{car.name}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Image */}
        <div className="relative w-full h-[360px] rounded-2xl overflow-hidden shadow-xl">
          <Image src={car.image} alt={car.name} fill className="object-cover" sizes="(max-width:1024px) 100vw, 50vw" />
          <div className="absolute top-4 left-4 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full">
            {car.type}
          </div>
        </div>

        {/* Details */}
        <div className="flex flex-col justify-between space-y-6">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 mb-2">{car.name}</h1>
            <p className="flex items-center gap-2 text-gray-500 text-sm font-medium mb-4">
              <FaMapMarkerAlt className="text-blue-500" /> {car.location}
            </p>
            <div className="flex gap-2 mb-5">
              {[1,2,3,4,5].map(i => <FaStar key={i} className="text-yellow-400 text-sm" />)}
              <span className="text-gray-400 text-xs ml-1">(4.8)</span>
            </div>
          </div>

          {/* Specs */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-gray-50 p-4 rounded-xl text-center border border-gray-100">
              <FaUserFriends className="mx-auto text-blue-600 text-xl mb-2" />
              <p className="font-bold text-sm text-gray-800">{car.capacity} Seats</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-xl text-center border border-gray-100">
              <FaCogs className="mx-auto text-blue-600 text-xl mb-2" />
              <p className="font-bold text-sm text-gray-800">Automatic</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-xl text-center border border-gray-100">
              <FaGasPump className="mx-auto text-blue-600 text-xl mb-2" />
              <p className="font-bold text-sm text-gray-800">Petrol</p>
            </div>
          </div>

          {car.description && (
            <p className="text-gray-500 text-sm leading-relaxed">{car.description}</p>
          )}

          {/* Booking count */}
          {car.booking_count > 0 && (
            <p className="text-xs text-gray-400 font-medium">
              🔥 Booked {car.booking_count} time{car.booking_count !== 1 ? "s" : ""}
            </p>
          )}

          <div className="pt-5 border-t border-gray-100 flex justify-between items-center">
            <div>
              <span className="text-3xl font-black text-blue-600">${car.dailyPrice}</span>
              <span className="text-gray-400 text-sm"> / day</span>
            </div>
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-blue-600 text-white px-10 py-3 rounded-xl font-bold text-sm hover:bg-blue-700 transition-all shadow-lg"
            >
              Book Now
            </button>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 px-4">
          <div className="bg-white p-8 rounded-2xl w-full max-w-md shadow-2xl">
            <h2 className="text-xl font-extrabold text-gray-900 mb-6">Confirm Your Booking</h2>

            <div className="bg-blue-50 rounded-xl p-4 mb-6 flex items-center gap-4">
              <div className="relative w-16 h-12 rounded-lg overflow-hidden shrink-0">
                <Image src={car.image} alt={car.name} fill className="object-cover" />
              </div>
              <div>
                <p className="font-bold text-sm text-gray-900">{car.name}</p>
                <p className="text-blue-600 font-bold text-sm">${car.dailyPrice}/day</p>
              </div>
            </div>

            <form onSubmit={handleBooking} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1 block">Driver</label>
                <select name="driver" className="w-full p-3 text-sm border border-gray-200 rounded-xl font-medium outline-none focus:border-blue-500">
                  <option value="No">No Driver</option>
                  <option value="Yes">Need Driver (+$20/day)</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1 block">Special Note (optional)</label>
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
                  onClick={() => setIsModalOpen(false)}
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
