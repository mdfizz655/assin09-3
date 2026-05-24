import Link from "next/link";
import Image from "next/image";
import { FaMapMarkerAlt, FaUserFriends } from "react-icons/fa";

export default function CarCard({ car }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 group flex flex-col">
      <div className="relative h-52 overflow-hidden bg-gray-100">
        <Image
          src={car.image}
          alt={car.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
        <div className="absolute top-3 right-3 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full">
          {car.type}
        </div>
        {car.availability === "Unavailable" && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="text-white font-bold text-sm bg-red-500 px-4 py-1 rounded-full">Unavailable</span>
          </div>
        )}
      </div>

      <div className="p-5 flex flex-col flex-1">
        <h3 className="text-lg font-bold text-gray-900 mb-3 leading-tight">{car.name}</h3>

        <div className="space-y-1.5 mb-4 flex-1">
          <div className="flex items-center text-gray-500 text-sm gap-2">
            <FaMapMarkerAlt className="text-blue-500 shrink-0" />
            <span className="truncate">{car.location}</span>
          </div>
          <div className="flex items-center text-gray-500 text-sm gap-2">
            <FaUserFriends className="text-blue-500 shrink-0" />
            <span>{car.capacity} Seats</span>
          </div>
        </div>

        <div className="flex justify-between items-center border-t border-gray-100 pt-4">
          <div>
            <span className="text-2xl font-extrabold text-blue-600">${car.dailyPrice}</span>
            <span className="text-gray-400 text-sm"> / day</span>
          </div>
          <Link
            href={`/car/${car._id}`}
            className="bg-gray-900 text-white text-sm px-5 py-2 rounded-xl font-semibold hover:bg-blue-600 transition-colors"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
}
