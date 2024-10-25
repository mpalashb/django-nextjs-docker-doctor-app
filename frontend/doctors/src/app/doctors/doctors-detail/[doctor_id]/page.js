import React from "react";
import DoctorDetail from "../../../../components/DoctorDetail";

// Import the NotFoundError from Next.js
import { notFound } from "next/navigation";

const page = async ({ params }) => {
  const { doctor_id } = params;
  const baseUrl =
    process.env.NODE_ENV === "production"
      ? process.env.NEXT_PUBLIC_BACK_API_PROD
      : process.env.NEXT_PUBLIC_BACK_API;

  try {
    const res = await fetch(`${baseUrl}/api/public/doctors/${doctor_id}`, {
      cache: "no-store",
    });

    // Check if the response is not okay (e.g., 404)
    if (!res.ok) {
      if (res.status === 404) {
        // Use notFound() to trigger a 404 page
        return notFound();
      }
      // Handle other errors if necessary
      throw new Error("An error occurred while fetching the doctor details");
    }

    const doctor_res = await res.json();

    return (
      <div>
        <DoctorDetail doctor={doctor_res} />
      </div>
    );
  } catch (error) {
    // Optionally log the error or handle it in a different way
    console.error("Error fetching doctor details:", error);
    // Use notFound() to trigger a 404 page in case of an unexpected error
    return notFound();
  }
};

export default page;
