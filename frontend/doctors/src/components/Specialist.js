import React from "react";
import Link from "next/link";

const Specialist = ({ division, specialties }) => {
  console.log(specialties);
  return (
    <>
      <div className="mx-auto max-w-screen-lg bg-blue-500 mt-10 p-8 text-white md:flex md:items-center md:flex-col md:space-y-12 md:p-16 lg:rounded-xl">
        <h2 className="max-w-lg text-xl font-bold sm:text-4xl text-center">
          Selecet Any Specialist
        </h2>
        <div className="whitespace-nowrap grid grid-cols-6 gap-2">
          {specialties &&
            specialties.map((specialist, index) => (
              <Link
                key={index}
                href={`/doctors/specialist/${specialist.title}/${division}`}
                className="focus:outline-4 rounded-xl font-medium text-white hover:text-emerald-100"
              >
                {specialist.title}
              </Link>
            ))}
        </div>
      </div>
    </>
  );
};

export default Specialist;
