import CarCard from "@/components/CarCard";
import Link from "next/link";
import { FaShieldAlt, FaHeadset, FaWallet } from "react-icons/fa";

const API_URL = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || "https://server09.onrender.com";

async function getCars() {
  try {
    const res = await fetch(`${API_URL}/cars`, {
  next: { revalidate: 60 },
});
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data.slice(0, 6) : [];
  } catch {
    return [];
  }
}

export default async function HomePage() {
  const cars = await getCars();

  return (
    <div className="pb-20">
      {/* Banner */}
      <div className="relative w-full h-[420px] md:h-[520px] flex items-center justify-center bg-gray-900 rounded-3xl overflow-hidden my-6 shadow-2xl">
        <div className="absolute inset-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&q=80&w=1920"
            alt="Luxury Car"
            className="w-full h-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-transparent to-transparent" />
        </div>

        <div className="relative z-10 text-center px-6 max-w-3xl">
          <h1 className="text-4xl md:text-6xl font-black text-white mb-5 leading-tight">
            Drive Your Dream{" "}
            <span className="text-blue-400">Journey</span> Today
          </h1>
          <p className="text-base md:text-lg text-gray-300 mb-8 max-w-xl mx-auto leading-relaxed">
            Affordable, reliable, and luxury cars at your fingertips. Rent the best vehicles for your next trip.
          </p>
          <Link
            href="/cars"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-10 py-3.5 rounded-xl font-bold text-base transition-all shadow-xl"
          >
            Explore Cars
          </Link>
        </div>
      </div>

      {/* Available Fleet */}
      <section className="py-16">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-3">Available Fleet</h2>
          <div className="h-1 w-20 bg-blue-600 mx-auto rounded-full" />
        </div>
        {cars.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {cars.map((car) => (
              <CarCard key={car._id} car={car} />
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-400 text-lg py-10">No cars available right now.</p>
        )}
        <div className="text-center mt-10">
          <Link
            href="/cars"
            className="inline-block border-2 border-blue-600 text-blue-600 px-8 py-3 rounded-xl font-semibold hover:bg-blue-600 hover:text-white transition-all text-sm"
          >
            View All Cars
          </Link>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 bg-blue-50 rounded-3xl px-8 my-10">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-3">Why Choose DriveFleet?</h2>
          <p className="text-gray-500 text-base max-w-md mx-auto">
            We provide the best car rental experience with premium vehicles and top-notch security.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {[
            { icon: <FaShieldAlt />, title: "Fully Insured", desc: "Every rental includes comprehensive insurance for your peace of mind." },
            { icon: <FaWallet />, title: "Best Price Guarantee", desc: "Find a lower price? We will match it plus give you an extra discount." },
            { icon: <FaHeadset />, title: "24/7 Roadside Support", desc: "Our dedicated team is always ready to help you anywhere, anytime." },
          ].map((f, i) => (
            <div key={i} className="bg-white p-7 rounded-2xl shadow-sm hover:-translate-y-1 transition-all">
              <div className="text-3xl text-blue-600 mb-4 flex justify-center">{f.icon}</div>
              <h3 className="text-base font-bold text-gray-900 mb-2">{f.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Special Offers */}
      <section className="py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gradient-to-br from-blue-600 to-blue-500 p-10 rounded-3xl text-white flex flex-col justify-center">
            <h3 className="text-2xl font-bold mb-3">Weekend Special: 15% Off</h3>
            <p className="mb-6 opacity-90 text-sm leading-relaxed">
              Plan your weekend getaway and save big on all SUV and Sedan rentals.
            </p>
            <button className="bg-white text-blue-600 w-fit px-6 py-2 rounded-xl font-bold text-sm hover:bg-gray-100 transition-all">
              Claim Discount
            </button>
          </div>
          <div className="bg-gray-900 p-10 rounded-3xl text-white flex flex-col justify-center">
            <h3 className="text-2xl font-bold mb-3">Long Term Rental Deals</h3>
            <p className="mb-6 opacity-80 text-sm leading-relaxed">
              Rent a car for more than a week and get free delivery and pickup at your doorstep.
            </p>
            <button className="bg-blue-600 text-white w-fit px-6 py-2 rounded-xl font-bold text-sm hover:bg-blue-700 transition-all">
              Learn More
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
