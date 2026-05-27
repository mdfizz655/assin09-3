import { Toaster } from "react-hot-toast";

import "./globals.css";

import AuthProvider from "@/providers/AuthProvider";



export const metadata = {
  title: "DriveFleet — Premium Car Rental",
  description: "Affordable, reliable and luxury cars at your fingertips.",
};





export default function RootLayout({ children }) {
  return (
  
  <html lang="en">
   
      <body>
 
        <AuthProvider>
          {children}
         
          <Toaster
            position="top-center"
            reverseOrder={false}
            toastOptions={{
              style: { fontFamily: "Inter, sans-serif", fontSize: "14px", fontWeight: "600" },
            }}
          />
       
        </AuthProvider>
     
      </body>
    </html>
  );
}
