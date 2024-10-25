import DoctorsPage from "../../components/DoctorsPage";

export const metadata = {
  title: "Doctors List | Doctors",
  description: "Doctors Listing App",
};

export default async function Doctors() {
  let specialties = [];
  let divisions = [];
  const baseUrl =
    process.env.NODE_ENV === "production"
      ? process.env.NEXT_PUBLIC_BACK_API_PROD
      : process.env.NEXT_PUBLIC_BACK_API;

  try {
    // Fetch data from the API server-side
    const res = await fetch(`${baseUrl}/api/public/div-hos-spe`, {
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch data: ${res.status}`);
    }

    const data = await res.json();
    specialties = data.specialties;
    divisions = data.divisions;
  } catch (error) {
    console.error("Error fetching data from the backend:", error);
    // Handle the error, you can set a fallback or empty values for specialties/divisions if needed
  }

  return (
    <div className="container mx-auto">
      <DoctorsPage specialties={specialties} divisions={divisions} />
    </div>
  );
}
