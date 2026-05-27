import Link from "next/link";

export default function NotFound() {
  return (
  
  <div className="min-h-screen flex flex-col items-center justify-center text-center px-4 bg-gray-50">
     
      <h1 className="text-8xl font-black text-blue-600 mb-4">404</h1>
    
      <h2 className="text-2xl font-bold text-gray-900 mb-3">Page Not Found</h2>
     
      <p className="text-gray-500 text-sm mb-8 max-w-sm">
        The page you are looking for does not exist or has been moved.
   
      </p>
  
  
      <Link
        href="/"
        className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold text-sm hover:bg-blue-700 transition-all"
      >
        Go Home
 
      </Link>
 
 
    </div>
  );
}
