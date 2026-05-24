"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { api, authApi } from "@/lib/axios";
import { toast } from "react-hot-toast";

const INPUT = "w-full p-3 text-sm rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all bg-white";
const LABEL = "block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5";

export default function UpdateCarPage() {
  const { id }            = useParams();
  const { data: session } = useSession();
  const router            = useRouter();
  const [car, setCar]     = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.get(`/cars/${id}`)
      .then((res) => setCar(res.data))
      .catch(() => toast.error("Car not found"));
  }, [id]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);

    const updatedData = {
      name:         e.target.name.value.trim(),
      dailyPrice:   parseFloat(e.target.price.value),
      type:         e.target.type.value,
      location:     e.target.location.value.trim(),
      description:  e.target.desc.value.trim(),
      image:        e.target.image.value.trim(),
      availability: e.target.availability.value,
    };

    try {
      await authApi(session.accessToken).put(`/cars/${id}`, updatedData);
      toast.success("Car updated successfully!");
      router.push("/my-added-cars");
    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!car)
    return <div className="flex justify-center py-24"><div className="spinner" /></div>;

  return (
    <div className="py-10 max-w-2xl mx-auto px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900">Update Vehicle</h1>
        <p className="text-gray-500 text-sm mt-1">Edit your car listing details</p>
      </div>

      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        <form onSubmit={handleUpdate} className="space-y-5">
          <div>
            <label className={LABEL}>Car Name</label>
            <input type="text" name="name" defaultValue={car.name} required className={INPUT} />
          </div>
          <div>
            <label className={LABEL}>Price Per Day ($)</label>
            <input type="number" name="price" defaultValue={car.dailyPrice} required min="1" className={INPUT} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={LABEL}>Car Type</label>
              <select name="type" defaultValue={car.type} className={INPUT}>
                <option value="SUV">SUV</option>
                <option value="Sedan">Sedan</option>
                <option value="Hatchback">Hatchback</option>
                <option value="Luxury">Luxury</option>
              </select>
            </div>
            <div>
              <label className={LABEL}>Availability</label>
              <select name="availability" defaultValue={car.availability} className={INPUT}>
                <option value="Available">Available</option>
                <option value="Unavailable">Unavailable</option>
              </select>
            </div>
          </div>
          <div>
            <label className={LABEL}>Pickup Location</label>
            <input type="text" name="location" defaultValue={car.location} required className={INPUT} />
          </div>
          <div>
            <label className={LABEL}>Image URL</label>
            <input type="url" name="image" defaultValue={car.image} required className={INPUT} />
          </div>
          <div>
            <label className={LABEL}>Description</label>
            <textarea name="desc" defaultValue={car.description} rows="4" className={`${INPUT} resize-none`} />
          </div>
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={() => router.back()}
              className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl font-bold text-sm hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-bold text-sm hover:bg-blue-700 disabled:opacity-60"
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
