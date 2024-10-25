"use client";

import React, { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link"; // Use next/link for navigation in Next.js
import { useAuth } from "../../context/authContext";
import OverviewDetail from "../../components/dashboard/OverviewDetail";
import SettingDetail from "../../components/dashboard/SettingDetail";
import Chamber from "../../components/dashboard/Chamber";
import Billing from "../../components/dashboard/Billing";

const MainDashboard = ({
  overview_page,
  user_page,
  chamber_page,
  billing_page,
}) => {
  const pathname = usePathname();
  const router = useRouter();
  const baseUrl = process.env.NEXT_PUBLIC_BACK_API;
  const { user } = useAuth();
  const [doctorProfile, setDoctorProfile] = useState(null);

  // let profile_pic = `${baseUrl}${doctorProfile?.profile_picture}`;

  let profile_pic;

  if (process.env.NODE_ENV === "production") {
    profile_pic = doctorProfile?.profile_picture;
  } else {
    profile_pic = `${baseUrl}${doctorProfile?.profile_picture}`;
  }

  useEffect(() => {
    if (user) {
      // Assuming user.doctor is available in the response
      setDoctorProfile(user?.doctor);
    }
  }, [user]);

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center space-y-4">
        <div className="flex items-center justify-center space-x-2">
          <span className="block h-10 w-32 rounded-lg bg-gradient-to-r from-gray-200 to-gray-300 animate-pulse"></span>
          <span className="block h-10 w-32 rounded-lg bg-gradient-to-r from-gray-200 to-gray-300 animate-pulse"></span>
        </div>
        <span className="block h-4 w-72 rounded-lg bg-gradient-to-r from-gray-200 to-gray-300 animate-pulse"></span>
        <span className="block h-4 w-72 rounded-lg bg-gradient-to-r from-gray-200 to-gray-300 animate-pulse"></span>
        <span className="block h-4 w-72 rounded-lg bg-gradient-to-r from-gray-200 to-gray-300 animate-pulse"></span>
      </div>
    ); // Skeleton loader centered on the page
  }

  if (!doctorProfile) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
          <h4>
            Username:{" "}
            <span className="text-lime-700 font-semibold">
              {user ? user.email : ""}
            </span>
          </h4>
          <p className="mt-4 text-lg text-gray-600">
            You haven't created a doctor profile yet.
          </p>
          <p className="mt-2 text-gray-500">
            Please complete your profile to access all features.
          </p>
          <button
            onClick={() => router.push("/dashboard/profile/create")}
            className="mt-6 inline-flex items-center text-white bg-blue-600 border-0 py-2 px-4 focus:outline-none hover:bg-blue-700 rounded"
          >
            Create Doctor Profile
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-4 min-h-screen max-w-screen-xl sm:mx-8 xl:mx-auto">
      <h1 className="border-b py-6 text-4xl font-semibold">Dashboard</h1>
      <div className="grid grid-cols-8 pt-3 sm:grid-cols-10">
        <div className="col-span-2 hidden sm:block">
          <div className="flex flex-col">
            <Link
              href="/dashboard"
              className={`mt-5 cursor-pointer border-l-2 ${
                pathname === "/dashboard"
                  ? "border-l-blue-700 text-blue-700"
                  : ""
              }  border-transparent px-2 py-2 font-semibold transition hover:border-l-blue-700 hover:text-blue-700`}
            >
              Profile
            </Link>
            <Link
              href="/dashboard/user"
              className={`mt-5 cursor-pointer border-l-2 ${
                pathname === "/dashboard/user"
                  ? "border-l-blue-700 text-blue-700"
                  : ""
              }  border-transparent px-2 py-2 font-semibold transition hover:border-l-blue-700 hover:text-blue-700`}
            >
              User
            </Link>
            <Link
              href="/dashboard/chamber"
              className={`mt-5 cursor-pointer border-l-2 ${
                pathname === "/dashboard/chamber"
                  ? "border-l-blue-700 text-blue-700"
                  : ""
              }  border-transparent px-2 py-2 font-semibold transition hover:border-l-blue-700 hover:text-blue-700`}
            >
              Chamber
            </Link>
            <Link
              href="/dashboard/billing"
              className={`mt-5 cursor-pointer border-l-2 ${
                pathname === "/dashboard/billing"
                  ? "border-l-blue-700 text-blue-700"
                  : ""
              }  border-transparent px-2 py-2 font-semibold transition hover:border-l-blue-700 hover:text-blue-700`}
            >
              Billing
            </Link>
          </div>
        </div>
        <div className="col-span-8 overflow-hidden rounded-xl sm:bg-gray-50 sm:px-8 sm:shadow">
          {overview_page && (
            <OverviewDetail
              doctorProfile={doctorProfile}
              user={user}
              profile_pic={profile_pic}
            />
          )}

          {user_page && (
            <SettingDetail
              doctorProfile={doctorProfile}
              user={user}
              profile_pic={profile_pic}
            />
          )}

          {chamber_page && <Chamber />}
          {billing_page && <Billing />}
        </div>
      </div>
    </div>
  );
};

export default MainDashboard;
