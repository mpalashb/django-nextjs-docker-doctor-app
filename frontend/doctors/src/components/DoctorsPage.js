import React from "react";
import Link from "next/link";

const DoctorsPage = ({ specialties, divisions }) => {
  return (
    <>
      <div className="mx-auto max-w-screen-lg bg-amber-500 mt-10 p-8 text-white md:flex md:items-center md:flex-col md:space-y-12 md:p-16 lg:rounded-xl">
        <h2 className="max-w-lg text-xl font-bold sm:text-4xl text-nowrap">
          Selecet Your State Or Divisions
        </h2>
        <div className="whitespace-nowrap grid grid-cols-6 gap-2">
          {divisions &&
            divisions.map((division, index) => (
              <Link
                key={index}
                href={`/doctors/divisions/${division.name}`}
                className="focus:outline-4 rounded-xl font-medium text-white hover:text-emerald-100"
              >
                {division.name}
              </Link>
            ))}
        </div>
      </div>
    </>
  );
};

export default DoctorsPage;
