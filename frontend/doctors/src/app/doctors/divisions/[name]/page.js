import React from "react";
import Specialist from "../../../../components/Specialist";

const SingleDivision = async ({ params }) => {
  const { name } = params;
  const baseUrl =
    process.env.NODE_ENV === "production"
      ? process.env.NEXT_PUBLIC_BACK_API_PROD
      : process.env.NEXT_PUBLIC_BACK_API;

  const res = await fetch(`${baseUrl}/api/public/div-hos-spe`, {
    cache: "no-store",
  });
  const { specialties } = await res.json();

  return (
    <>
      <Specialist division={name} specialties={specialties} />
    </>
  );
};

export default SingleDivision;
