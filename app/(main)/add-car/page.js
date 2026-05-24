"use client";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { authApi } from "@/lib/axios";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";

const INPUT = "w-full p-3 text-sm rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all bg-white";
const LABEL = "block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5";

export default function AddCarPage() {
  const { data: session } = useSession();
  const router  = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!session) return toast.error("Please login first!");
    setLoading(true);

    const form = e.target;
    const carData = {
      name:         form.name.value.trim(),
      dailyPrice:   Number(form.price.value),
      type:         form.type.value,
      image:        form.image.value.trim(),
      capacity:     Number(form.capacity.value),
      location:     form.location.value.trim(),
      description:  form.description.value.trim(),
      availability: form.availability.value,
      ownerEmail:   session.user.email,
      ownerName:    session.user.name,
      booking_count: 0,
    };

    try {
      const res = await authApi(session.accessToken).post("/cars", carData);
      if (res.data.insertedId) {
        toast.success("Car listed successfully! 🎉");
        router.push("/my-added-cars");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add car");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900">List a New Car</h1>
        <p className="text-gray-500 text-sm mt-1">Fill in the details to add your car to the fleet</p>
      </div>

      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5">

          <div>
            <label className={LABEL}>Car Model *</label>
            <input type="text" name="name" required placeholder="e.g. Toyota Camry 2023" className={INPUT} />
          </div>

          <div>
            <label className={LABEL}>Price Per Day ($) *</label>
            <input type="number" name="price" required min="1" placeholder="e.g. 75" className={INPUT} />
          </div>

          <div>
            <label className={LABEL}>Car Type *</label>
            <select name="type" className={INPUT}>
              <option value="SUV">SUV</option>
              <option value="Sedan">Sedan</option>
              <option value="Hatchback">Hatchback</option>
              <option value="Luxury">Luxury</option>
            </select>
          </div>

          <div>
            <label className={LABEL}>Seat Capacity *</label>
            <input type="number" name="capacity" required min="1" max="20" placeholder="e.g. 5" className={INPUT} />
          </div>

          <div>
            <label className={LABEL}>Pickup Location *</label>
            <input type="text" name="location" required placeholder="e.g. New York, USA" className={INPUT} />
          </div>

          <div>
            <label className={LABEL}>Availability *</label>
            <select name="availability" className={INPUT}>
              <option value="Available">Available</option>
              <option value="Unavailable">Unavailable</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <label className={LABEL}>Image URL *</label>
            <input
              type="url" name="image" required
              placeholder="https://i.ibb.co/your-car-image.jpg"
              className={INPUT}
            />
            <p className="text-xs text-gray-400 mt-1">
              Use{" "}
              <a href="https://imgbb.com" target="_blank" rel="noreferrer" className="text-blue-500 hover:underline">imgbb.com</a>
              {" "}to host your car image
            </p>
          </div>

          <div className="md:col-span-2">
            <label className={LABEL}>Description</label>
            <textarea
              name="description"
              rows="4"
              placeholder="Describe your car — features, condition, special rules..."
              className={`${INPUT} resize-none`}
            />
          </div>

          <div className="md:col-span-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3.5 rounded-xl font-bold text-sm hover:bg-blue-700 transition-all disabled:opacity-60 disabled:cursor-not-allowed shadow-sm"
            >
              {loading ? "Listing car..." : "✓ List Your Car"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
