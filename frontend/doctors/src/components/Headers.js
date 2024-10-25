"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "../context/authContext";

const Headers = () => {
  const { user, logout } = useAuth(); // Fetching user from context
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Local state to track login

  useEffect(() => {
    if (user) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, [user]);

  const handleLogout = async () => {
    await logout();
  };

  return (
    <header className="text-gray-600 body-font">
      <div className="container mx-auto flex flex-wrap p-5 flex-col md:flex-row items-center">
        <Link
          href="/"
          className="flex title-font font-medium items-center text-gray-900 mb-4 md:mb-0"
        >
          <strong className="ml-3 text-xl">
            Doctors<span className="text-amber-400">A</span>pp
          </strong>
        </Link>
        <nav className="md:ml-auto flex flex-wrap items-center text-base justify-center">
          {isLoggedIn ? (
            <>
              <Link
                href="/dashboard"
                className="mr-5 text-yellow-600 font-extrabold hover:text-gray-900"
              >
                Dashboard
              </Link>
            </>
          ) : (
            ""
          )}

          <Link href="/doctors" className="mr-5 hover:text-gray-900">
            Doctors
          </Link>
        </nav>

        {!isLoggedIn && (
          <button
            type="button"
            onClick={() => router.push("/login")}
            className="inline-flex items-center text-white font-bold bg-rose-400 border-0 py-1 px-3 focus:outline-none hover:bg-rose-500 rounded text-base mt-4 md:mt-0"
          >
            Login
            <svg
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="w-4 h-4 ml-1"
              viewBox="0 0 24 24"
            >
              <path d="M5 12h14M12 5l7 7-7 7"></path>
            </svg>
          </button>
        )}
        {isLoggedIn && (
          <button
            type="button"
            onClick={handleLogout}
            className="inline-flex items-center text-white font-bold bg-rose-400 border-0 py-1 px-3 focus:outline-none hover:bg-rose-500 rounded text-base mt-4 md:mt-0"
          >
            Logout
          </button>
        )}
      </div>
    </header>
  );
};

export default Headers;
