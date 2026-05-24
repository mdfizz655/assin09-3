"use client";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { authApi } from "../../../lib/axios"; // পাথটি নিশ্চিত করুন
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function AddCarPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!session) return toast.error("Please Login first!");

    setLoading(true);
    const form = e.target;
    
    const carData = {
      name: form.name.value,
      dailyPrice: Number(form.price.value), // Number এ কনভার্ট করা জরুরি
      type: form.type.value,
      image: form.image.value,
      capacity: Number(form.capacity.value), // Number এ কনভার্ট করা জরুরি
      location: form.location.value,
      description: form.description.value,
      availability: "Available",
      ownerEmail: session.user.email,
      booking_count: 0
    };

    try {
      const res = await authApi(session.accessToken).post('/cars', carData);
      if (res.data.insertedId) {
        toast.success("Car added successfully!");
        router.push("/my-added-cars");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add car");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-10 px-4">
       <h1 className="text-2xl font-bold mb-6">Add a New Car</h1>
       <form onSubmit={handleSubmit} className="space-y-4">
          <input name="name" placeholder="Car Name" className="w-full border p-3 rounded-xl" required />
          <input name="price" type="number" placeholder="Price/Day" className="w-full border p-3 rounded-xl" required />
          <select name="type" className="w-full border p-3 rounded-xl">
             <option value="SUV">SUV</option>
             <option value="Sedan">Sedan</option>
             <option value="Luxury">Luxury</option>
          </select>
          <input name="capacity" type="number" placeholder="Capacity" className="w-full border p-3 rounded-xl" required />
          <input name="location" placeholder="Location" className="w-full border p-3 rounded-xl" required />
          <input name="image" placeholder="Image URL" className="w-full border p-3 rounded-xl" required />
          <textarea name="description" placeholder="Description" className="w-full border p-3 rounded-xl" required />
          <button disabled={loading} className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold">
             {loading ? "Adding..." : "List Car"}
          </button>
       </form>
    </div>
  );
}