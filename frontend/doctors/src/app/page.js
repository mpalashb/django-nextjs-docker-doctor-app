"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "../context/authContext";

export default function Home() {
  const { user } = useAuth();
  const [isAuthenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    if (user) {
      setAuthenticated(true);
    }
  }, [user]);

  const baseUrl = process.env.NEXT_PUBLIC_BACK_API;
  console.log(`Checking baseUrl From ${baseUrl} ENV`);

  const [hospitals, setHospitals] = useState([]);
  const [specialties, setSpecialties] = useState([]);
  const [divisions, setDivisions] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${baseUrl}/api/public/div-hos-spe`);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setHospitals(data.hospitals);
        setSpecialties(data.specialties);
        setDivisions(data.divisions);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="container mx-auto">
      <section className="text-gray-600 body-font">
        <div className="flex px-5 py-24 md:flex-row flex-col items-center">
          <div className="lg:flex-grow md:w-1/2 lg:pr-24 md:pr-16 flex flex-col md:items-start md:text-left mb-16 md:mb-0 items-center text-center">
            <h1 className="title-font sm:text-4xl text-3xl mb-4 font-medium text-gray-900">
              Welcome To Our
              <br className="hidden lg:inline-block" />
              Doctor Listing App
            </h1>
            <p className="mb-8 leading-relaxed">
              Search for doctors by name, hospital, specialty, and division. Get
              a detailed view of the healthcare professionals working in your
              area.
            </p>
            {!isAuthenticated && (
              <div className="flex justify-center">
                <Link
                  href={"/register"}
                  className="inline-flex text-white bg-indigo-500 border-0 py-2 px-6 focus:outline-none hover:bg-indigo-600 rounded text-lg"
                >
                  Create Doctor Account
                </Link>
              </div>
            )}
          </div>
          <div className="md:w-1/2 w-5/6">
            <div className="m-10 w-screen max-w-screen-md">
              <div className="flex flex-col">
                <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-lg">
                  <form method="GET" action="/doctors/filters-list">
                    {" "}
                    {/* Updated form action */}
                    <div className="relative mb-10 w-full flex items-center justify-between rounded-md">
                      <input
                        type="text"
                        name="dr_name"
                        className="h-12 w-full cursor-text rounded-md border border-gray-100 bg-gray-100 py-4 pr-40 pl-12 shadow-sm outline-none focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                        placeholder="Search by doctor name"
                      />
                    </div>
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                      <div className="flex flex-col">
                        <label
                          htmlFor="hospital"
                          className="text-sm font-medium text-stone-600"
                        >
                          Hospital
                        </label>
                        <select
                          id="hospital"
                          name="hospital"
                          className="mt-2 block w-full rounded-md border border-gray-100 bg-gray-100 px-2 py-2 shadow-sm outline-none focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                        >
                          {hospitals.map((hospital) => (
                            <option key={hospital.id} value={hospital.id}>
                              {hospital.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="flex flex-col">
                        <label
                          htmlFor="specialty"
                          className="text-sm font-medium text-stone-600"
                        >
                          Specialty
                        </label>
                        <select
                          id="specialty"
                          name="specialty"
                          className="mt-2 block w-full rounded-md border border-gray-100 bg-gray-100 px-2 py-2 shadow-sm outline-none focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                        >
                          {specialties.map((specialty) => (
                            <option key={specialty.id} value={specialty.title}>
                              {specialty.title}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="flex flex-col">
                        <label
                          htmlFor="division"
                          className="text-sm font-medium text-stone-600"
                        >
                          Division
                        </label>
                        <select
                          id="division"
                          name="division"
                          className="mt-2 block w-full rounded-md border border-gray-100 bg-gray-100 px-2 py-2 shadow-sm outline-none focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                        >
                          {divisions.map((division) => (
                            <option key={division.id} value={division.name}>
                              {division.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div className="mt-6 grid w-full grid-cols-2 justify-end space-x-4 md:flex">
                      <button
                        type="button"
                        className="rounded-lg bg-gray-200 px-8 py-2 font-medium text-gray-700 outline-none hover:opacity-80 focus:ring"
                      >
                        Reset
                      </button>
                      <button
                        type="submit"
                        className="rounded-lg bg-blue-600 px-8 py-2 font-medium text-white outline-none hover:opacity-80 focus:ring"
                      >
                        Search
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

// "use client";

// import { useEffect, useState } from "react";
// import Link from "next/link";
// import { useRouter } from "next/router";

// export default function Home() {
//   const router = useRouter(); // Use Next.js router for navigation
//   const baseUrl = process.env.NEXT_PUBLIC_BACK_API;

//   const [hospitals, setHospitals] = useState([]);
//   const [specialties, setSpecialties] = useState([]);
//   const [divisions, setDivisions] = useState([]);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         console.log(`Fetching data from: ${baseUrl}/api/public/div-hos-spe`);
//         const response = await fetch(`${baseUrl}/api/public/div-hos-spe`);

//         if (!response.ok) {
//           throw new Error(`HTTP error! status: ${response.status}`);
//         }

//         const data = await response.json();
//         setHospitals(data.hospitals);
//         setSpecialties(data.specialties);
//         setDivisions(data.divisions);
//       } catch (error) {
//         console.error("Error fetching data:", error);
//       }
//     };

//     fetchData();
//   }, []);

//   // Function to handle form submission
//   const handleSubmit = (event) => {
//     event.preventDefault(); // Prevent default form submission
//     const specialty = event.target.specialty.value; // Get specialty from form
//     const division = event.target.division.value; // Get division from form

//     // Redirect to the doctors list page with query parameters
//     router.push(`/doctors?specialty=${specialty}&division=${division}`);
//   };

//   return (
//     <div className="container mx-auto">
//       <section className="text-gray-600 body-font">
//         <div className="flex px-5 py-24 md:flex-row flex-col items-center">
//           <div className="lg:flex-grow md:w-1/2 lg:pr-24 md:pr-16 flex flex-col md:items-start md:text-left mb-16 md:mb-0 items-center text-center">
//             <h1 className="title-font sm:text-4xl text-3xl mb-4 font-medium text-gray-900">
//               Welcome To Our
//               <br className="hidden lg:inline-block" />
//               Doctor Listing App
//             </h1>
//             <p className="mb-8 leading-relaxed">
//               Search for doctors by name, hospital, specialty, and division. Get
//               a detailed view of the healthcare professionals working in your
//               area.
//             </p>
//             <div className="flex justify-center">
//               <Link
//                 href={"/register"}
//                 className="inline-flex text-white bg-indigo-500 border-0 py-2 px-6 focus:outline-none hover:bg-indigo-600 rounded text-lg"
//               >
//                 Create Doctor Account
//               </Link>
//             </div>
//           </div>
//           <div className="md:w-1/2 w-5/6">
//             <div className="m-10 w-screen max-w-screen-md">
//               <div className="flex flex-col">
//                 <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-lg">
//                   <form onSubmit={handleSubmit}>
//                     <div className="relative mb-10 w-full flex items-center justify-between rounded-md">
//                       <svg
//                         className="absolute left-2 block h-5 w-5 text-gray-400"
//                         xmlns="http://www.w3.org/2000/svg"
//                         width="24"
//                         height="24"
//                         viewBox="0 0 24 24"
//                         fill="none"
//                         stroke="currentColor"
//                         strokeWidth="2"
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                       >
//                         <circle cx="11" cy="11" r="8"></circle>
//                         <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
//                       </svg>
//                       <input
//                         type="text"
//                         name="search"
//                         className="h-12 w-full cursor-text rounded-md border border-gray-100 bg-gray-100 py-4 pr-40 pl-12 shadow-sm outline-none focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
//                         placeholder="Search by doctor name"
//                       />
//                     </div>

//                     <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
//                       <div className="flex flex-col">
//                         <label
//                           htmlFor="hospital"
//                           className="text-sm font-medium text-stone-600"
//                         >
//                           Hospital
//                         </label>
//                         <select
//                           id="hospital"
//                           className="mt-2 block w-full rounded-md border border-gray-100 bg-gray-100 px-2 py-2 shadow-sm outline-none focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
//                         >
//                           {hospitals.map((hospital) => (
//                             <option key={hospital.id} value={hospital.id}>
//                               {hospital.name}
//                             </option>
//                           ))}
//                         </select>
//                       </div>

//                       <div className="flex flex-col">
//                         <label
//                           htmlFor="specialty"
//                           className="text-sm font-medium text-stone-600"
//                         >
//                           Specialty
//                         </label>
//                         <select
//                           id="specialty"
//                           className="mt-2 block w-full rounded-md border border-gray-100 bg-gray-100 px-2 py-2 shadow-sm outline-none focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
//                         >
//                           {specialties.map((specialty) => (
//                             <option key={specialty.id} value={specialty.id}>
//                               {specialty.title}
//                             </option>
//                           ))}
//                         </select>
//                       </div>

//                       <div className="flex flex-col">
//                         <label
//                           htmlFor="division"
//                           className="text-sm font-medium text-stone-600"
//                         >
//                           Division
//                         </label>
//                         <select
//                           id="division"
//                           className="mt-2 block w-full rounded-md border border-gray-100 bg-gray-100 px-2 py-2 shadow-sm outline-none focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
//                         >
//                           {divisions.map((division) => (
//                             <option key={division.id} value={division.id}>
//                               {division.name}
//                             </option>
//                           ))}
//                         </select>
//                       </div>
//                     </div>

//                     <div className="mt-6 grid w-full grid-cols-2 justify-end space-x-4 md:flex">
//                       <button className="rounded-lg bg-gray-200 px-8 py-2 font-medium text-gray-700 outline-none hover:opacity-80 focus:ring">
//                         Reset
//                       </button>
//                       <button className="rounded-lg bg-blue-600 px-8 py-2 font-medium text-white outline-none hover:opacity-80 focus:ring">
//                         Search
//                       </button>
//                     </div>
//                   </form>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>
//     </div>
//   );
// }
