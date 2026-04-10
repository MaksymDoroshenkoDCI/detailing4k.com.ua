import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-[60vh] container mx-auto max-w-lg px-4 py-24 text-center">
      <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
      <p className="text-gray-600 mb-8">Сторінку не знайдено.</p>
      <Link
        href="/"
        className="inline-block bg-primary-500 text-black px-6 py-3 rounded-lg font-semibold hover:bg-primary-400 transition-colors"
      >
        На головну
      </Link>
    </div>
  )
}
