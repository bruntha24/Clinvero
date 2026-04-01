import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="text-5xl font-bold mb-4">404</h1>
        <p className="text-lg mb-4 text-gray-500">
          Oops! Page not found
        </p>
        <Link
          href="/home"
          className="text-blue-600 underline hover:text-blue-800"
        >
          Return to Home
        </Link>
      </div>
    </div>
  );
}