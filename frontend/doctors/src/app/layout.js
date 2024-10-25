import localFont from "next/font/local";
import Head from "next/head";
import Headers from "../components/Headers";
import { AuthProvider } from "../context/authContext";
import { ReviewProvider } from "../context/reviewContext";
import { AlertProvider } from "../context/alertContext";
import { ProfileProvider } from "../context/profileContext";
import { ChamberProvider } from "../context/chamberContext";
import { PaymentProvider } from "../context/billingContext";
import Alert from "../components/Alert";

import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata = {
  title: "Dcotors List | Home",
  description: "Doctors Listing App",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Source+Sans+Pro:wght@300;400;600;700&display=swap"
          rel="stylesheet"
        />
      </head>

      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AlertProvider>
          <AuthProvider>
            <ChamberProvider>
              <ProfileProvider>
                <PaymentProvider>
                  <ReviewProvider>
                    <Headers />
                    <Alert />

                    {children}
                  </ReviewProvider>
                </PaymentProvider>
              </ProfileProvider>
            </ChamberProvider>
          </AuthProvider>
        </AlertProvider>
      </body>
    </html>
  );
}
