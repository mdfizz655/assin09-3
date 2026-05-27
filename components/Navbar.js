"use client";
import { useState } from "react";

import Link from "next/link";

import { usePathname } from "next/navigation";

import { useSession, signOut } from "next-auth/react";

import Image from "next/image";





export default function Navbar() {
  const { data: session } = useSession();

  const pathname = usePathname();

  const [isOpen, setIsOpen] = useState(false);





  const linkClass = (path) =>
    `text-sm font-semibold transition-all pb-0.5 ${
      pathname === path
        ? "text-blue-600 border-b-2 border-blue-600"
        : "text-gray-600 hover:text-blue-600"
    }`;





  const links = (
    <>
      <Link href="/" className={linkClass("/")}>Home</Link>

      <Link href="/cars" className={linkClass("/cars")}>Explore Cars</Link>

      {session && (
        <>
        
          <Link href="/add-car" className={linkClass("/add-car")}>Add Car</Link>
        
          <Link href="/my-bookings" className={linkClass("/my-bookings")}>My Bookings</Link>
       
          <Link href="/my-added-cars" className={linkClass("/my-added-cars")}>My Cars</Link>
        </>
      )}
    </>
  );








  return (
  
  <nav className="bg-white sticky top-0 z-50 border-b border-gray-100 shadow-sm">
   
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
     
        <div className="flex justify-between h-16 items-center">
        

      
          <Link href="/" className="text-xl font-black tracking-tight text-blue-700 shrink-0">
            DRIVE<span className="text-gray-900">FLEET</span>
          </Link>

         

          <div className="hidden md:flex items-center space-x-8">{links}</div>

         

          <div className="flex items-center gap-3">
            {session ? (
             
             <div className="flex items-center gap-3 bg-gray-50 px-3 py-2 rounded-full border border-gray-200">
             
                <div className="text-right hidden sm:block">
               
                  <p className="text-xs font-bold text-gray-900 leading-tight max-w-[120px] truncate">
                    {session.user?.name || "User"}
                  </p>
              
              
              
                  <button
                    onClick={() => signOut({ callbackUrl: "/" })}
                    className="text-[11px] font-semibold text-red-500 hover:underline"
                  >
                    Logout
                  </button>
               
                </div>
                <Image
                  src={session.user?.image || "https://i.ibb.co/mJR9nkv/user.png"}
                  alt="profile"
                  width={36}
                  height={36}
                  className="w-9 h-9 rounded-full border-2 border-blue-500 object-cover"
                />
         
              </div>
            ) : (
       
       
       
              <Link
                href="/login"
                className="bg-blue-600 text-white text-sm px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                Login
              </Link>
            )}

            


            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden text-gray-700 p-1"
              aria-label="Toggle menu"
            >
             
             
             
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
                />
             
              </svg>
          
            </button>
       
          </div>
     
        </div>
      </div>



     
     
      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-4 py-4 flex flex-col gap-4 shadow-md">
          {links}
        </div>
      )}
    </nav>
  );
}
