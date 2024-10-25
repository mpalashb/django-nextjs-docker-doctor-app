import React from "react";
import Link from "next/link";

const page = async ({ params }) => {
  const baseUrl =
    process.env.NODE_ENV === "production"
      ? process.env.NEXT_PUBLIC_BACK_API_PROD
      : process.env.NEXT_PUBLIC_BACK_API;

  const { specialty, division } = params;

  const res = await fetch(
    `${baseUrl}/api/public/find-doctors?specialty=${specialty}&division=${division}`,
    {
      cache: "no-store",
    }
  );
  const results = await res.json();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">
        Doctors in {division} specialized in {specialty}
      </h1>

      <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {results && results.length > 0 ? (
          results.map((doctor, index) => (
            <Link key={doctor.id} href={`/doctors/doctors-detail/${doctor.id}`}>
              <li
                key={index}
                className="bg-white shadow-lg rounded-lg p-6 hover:shadow-xl transition duration-300"
              >
                <img
                  src={
                    process.env.NODE_ENV === "production"
                      ? doctor?.profile_picture
                      : `${baseUrl}${doctor?.profile_picture}`
                  }
                  alt={doctor.first_name}
                  className="h-32 w-32 rounded-full mx-auto mb-4"
                />
                <h2 className="text-xl font-semibold text-center">
                  Dr. {doctor.first_name} {doctor.last_name}
                </h2>
                <p className="text-center text-gray-600">
                  {doctor.specialty
                    .map((specialty) => specialty.title)
                    .join(", ")}
                </p>
                <p className="text-center text-gray-500 mt-2">
                  {doctor.workplace.name} - {doctor.division.name}
                </p>
              </li>
            </Link>
          ))
        ) : (
          <p className="text-center text-red-500">No doctors found.</p>
        )}
      </ul>
    </div>
  );
};

export default page;
