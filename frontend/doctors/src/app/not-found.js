import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-6xl font-bold text-red-500">404</h1>
      <p className="text-xl mt-4">
        Sorry, the page you're looking for doesn't exist.
      </p>
      <Link
        href="/"
        className="mt-8 px-4 py-2 bg-blue-600 text-white rounded-lg"
      >
        Go back to Home
      </Link>
    </div>
  );
}
