"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import { authApi } from "../../../lib/axios"; // ৩টি ডট
import { toast } from "react-hot-toast";
import Swal from "sweetalert2";
import { FaEdit, FaTrashAlt, FaPlus } from "react-icons/fa";

export default function MyAddedCarsPage() {
  const { data: session } = useSession();
  const [myCars, setMyCars] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (session?.accessToken && session?.user?.email) {
      authApi(session.accessToken)
        .get(`/my-cars/${session.user.email}`)
        .then((res) => { setMyCars(res.data); setLoading(false); })
        .catch(() => setLoading(false));
    }
  }, [session]);

  const handleDelete = (id) => {
    Swal.fire({ title: "Are you sure?", icon: "warning", showCancelButton: true }).then((res) => {
      if (res.isConfirmed) {
        authApi(session.accessToken).delete(`/cars/${id}`).then(() => {
          toast.success("Deleted!");
          setMyCars(myCars.filter(c => c._id !== id));
        });
      }
    });
  };

  if (loading) return <div className="flex justify-center py-20"><div className="spinner" /></div>;

  return (
    <div className="py-10 px-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-extrabold">My Listed Cars</h1>
        <Link href="/add-car" className="bg-blue-600 text-white px-5 py-2 rounded-xl"><FaPlus className="inline mr-2" /> Add Car</Link>
      </div>
      <div className="grid gap-4">
        {myCars.map(car => (
          <div key={car._id} className="flex items-center justify-between p-4 bg-white border rounded-xl">
            <div className="flex items-center gap-4">
              <div className="relative w-16 h-12">
                <Image src={car.image} alt={car.name} fill className="rounded-lg object-cover" />
              </div>
              <h3 className="font-bold">{car.name}</h3>
            </div>
            <div className="flex gap-3">
              <Link href={`/update-car/${car._id}`} className="text-blue-600"><FaEdit /></Link>
              <button onClick={() => handleDelete(car._id)} className="text-red-500"><FaTrashAlt /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}