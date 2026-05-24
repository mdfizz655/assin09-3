"use client";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { authApi } from "../../../lib/axios"; // পাথ চেক করুন
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function AddCarPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!session) return toast.error("Please login first");

    setLoading(true);
    const form = e.target;
    
    const carData = {
      name: form.name.value,
      dailyPrice: parseFloat(form.price.value),
      type: form.type.value,
      image: form.image.value,
      capacity: parseInt(form.capacity.value),
      location: form.location.value,
      description: form.description.value,
      availability: form.availability.value,
      ownerEmail: session.user.email, // মালিকের ইমেইল পাঠানো জরুরি
      booking_count: 0
    };

    try {
      // টোকেন সহ রিকোয়েস্ট পাঠানো হচ্ছে
      const res = await authApi(session.accessToken).post('/cars', carData);
      if (res.data.insertedId) {
        toast.success("Car added successfully!");
        router.push("/my-added-cars");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to add car. Check console.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-10 px-4">
      <h1 className="text-2xl font-bold mb-6">Add a New Car</h1>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
        <input name="name" placeholder="Car Name" className="border p-3 rounded-xl" required />
        <input name="price" type="number" placeholder="Price Per Day ($)" className="border p-3 rounded-xl" required />
        <select name="type" className="border p-3 rounded-xl">
          <option value="SUV">SUV</option>
          <option value="Sedan">Sedan</option>
          <option value="Hatchback">Hatchback</option>
          <option value="Luxury">Luxury</option>
        </select>
        <input name="capacity" type="number" placeholder="Seat Capacity" className="border p-3 rounded-xl" required />
        <input name="location" placeholder="Pickup Location" className="border p-3 rounded-xl" required />
        <select name="availability" className="border p-3 rounded-xl">
          <option value="Available">Available</option>
          <option value="Unavailable">Unavailable</option>
        </select>
        <input name="image" placeholder="Image URL" className="border p-3 rounded-xl" required />
        <textarea name="description" placeholder="Description" className="border p-3 rounded-xl h-32" required></textarea>
        
        <button disabled={loading} className="bg-blue-600 text-white py-3 rounded-xl font-bold">
          {loading ? "Adding..." : "List Your Car"}
        </button>
      </form>
    </div>
  );
}