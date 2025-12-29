'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function AdminDashboard() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [stats, setStats] = useState({
    bookings: 0,
    consultations: 0,
    testimonials: 0,
    services: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => res.json())
      .then((data) => {
        if (data.user && data.user.role) {
          setUser(data.user)
          // Fetch stats
          Promise.all([
            fetch('/api/bookings').then((r) => r.json()),
            fetch('/api/consultations').then((r) => r.json()),
            fetch('/api/testimonials').then((r) => r.json()),
            fetch('/api/services').then((r) => r.json()),
          ]).then(([bookings, consultations, testimonials, services]) => {
            setStats({
              bookings: bookings.length,
              consultations: consultations.length,
              testimonials: testimonials.length,
              services: services.length,
            })
            setLoading(false)
          })
        } else {
          router.push('/login?isAdmin=true')
        }
      })
      .catch(() => {
        router.push('/login?isAdmin=true')
      })
  }, [router])

  if (loading) {
    return (
      <div className="container mx-auto max-w-6xl px-4 py-16 text-center">
        <p>Завантаження...</p>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="container mx-auto max-w-6xl px-4 py-16">
      <h1 className="text-4xl font-bold mb-8 text-white">Адмін панель</h1>
      <p className="text-white mb-8">Вітаємо, {user.name}!</p>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <Link
          href="/admin/bookings"
          className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
        >
          <h3 className="text-lg font-semibold mb-2 text-gray-900">Бронювання</h3>
          <p className="text-3xl font-bold text-primary-600">{stats.bookings}</p>
        </Link>
        <Link
          href="/admin/consultations"
          className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
        >
          <h3 className="text-lg font-semibold mb-2 text-gray-900">Консультації</h3>
          <p className="text-3xl font-bold text-primary-600">{stats.consultations}</p>
        </Link>
        <Link
          href="/admin/testimonials"
          className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
        >
          <h3 className="text-lg font-semibold mb-2 text-gray-900">Відгуки</h3>
          <p className="text-3xl font-bold text-primary-600">{stats.testimonials}</p>
        </Link>
        <Link
          href="/admin/services"
          className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
        >
          <h3 className="text-lg font-semibold mb-2 text-gray-900">Послуги</h3>
          <p className="text-3xl font-bold text-primary-600">{stats.services}</p>
        </Link>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Link
          href="/admin/gallery"
          className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
        >
          <h3 className="text-xl font-semibold mb-2 text-gray-900">Керування галереєю</h3>
          <p className="text-gray-600">Додавати та редагувати зображення "до/після"</p>
        </Link>
        <Link
          href="/admin/services"
          className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
        >
          <h3 className="text-xl font-semibold mb-2 text-gray-900">Керування послугами</h3>
          <p className="text-gray-600">Додавати, редагувати та видаляти послуги</p>
        </Link>
      </div>
    </div>
  )
}



