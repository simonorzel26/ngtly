import Link from "next/link";

export default function NotFound() {
	return (
		<div className="min-h-screen flex items-center justify-center bg-gray-50">
			<div className="text-center px-4">
				<h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
				<h2 className="text-3xl font-semibold text-gray-700 mb-6">
					City Not Found
				</h2>
				<p className="text-lg text-gray-600 mb-8 max-w-md mx-auto">
					Sorry, we couldn't find the city you're looking for. It might not be
					in our database yet.
				</p>
				<div className="space-y-4">
					<Link
						href="/"
						className="inline-block bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors duration-200 font-semibold"
					>
						Back to Homepage
					</Link>
					<div className="text-sm text-gray-500">
						Looking for a specific city? Let us know!
					</div>
				</div>
			</div>
		</div>
	);
}
