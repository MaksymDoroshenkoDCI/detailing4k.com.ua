'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Booking } from '@/types'
import Link from 'next/link'

export default function AccountPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => res.json())
      .then((data) => {
        if (data.user) {
          setUser(data.user)
          fetch('/api/bookings')
            .then((res) => res.json())
            .then((bookingsData) => {
              setBookings(bookingsData)
              setLoading(false)
            })
            .catch(() => setLoading(false))
        } else {
          router.push('/login')
        }
      })
      .catch(() => {
        router.push('/login')
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

  const upcomingBookings = bookings.filter(
    (booking) =>
      new Date(booking.bookingDate) >= new Date() &&
      booking.status !== 'Cancelled'
  )
  const pastBookings = bookings.filter(
    (booking) =>
      new Date(booking.bookingDate) < new Date() ||
      booking.status === 'Cancelled'
  )

  return (
    <div className="container mx-auto max-w-6xl px-4 py-16">
      <h1 className="text-4xl font-bold mb-8 text-gray-900">Мій кабінет</h1>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Profile Info */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold mb-4 text-gray-900">Профіль</h2>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-gray-700">Ім&apos;я</p>
              <p className="font-medium text-gray-900">{user.name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-700">Email</p>
              <p className="font-medium text-gray-900">{user.email}</p>
            </div>
            {user.phone && (
              <div>
                <p className="text-sm text-gray-700">Телефон</p>
                <p className="font-medium text-gray-900">{user.phone}</p>
              </div>
            )}
          </div>
        </div>

        {/* Upcoming Bookings */}
        <div className="md:col-span-2">
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold text-gray-900">Майбутні записи</h2>
              <Link
                href="/booking"
                className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors text-sm"
              >
                Новий запис
              </Link>
            </div>
            {upcomingBookings.length === 0 ? (
              <p className="text-gray-700">Немає майбутніх записів</p>
            ) : (
              <div className="space-y-4">
                {upcomingBookings.map((booking) => (
                  <div
                    key={booking.bookingId}
                    className="border border-gray-200 rounded-lg p-4"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-lg text-gray-900">
                          {(booking.service as any)?.name || 'Послуга'}
                        </h3>
                        <p className="text-gray-700">
                          {new Date(booking.bookingDate).toLocaleDateString('uk-UA')} о {booking.startTime}
                        </p>
                        {booking.vehicleMake && booking.vehicleModel && (
                          <p className="text-sm text-gray-700">
                            {booking.vehicleMake} {booking.vehicleModel}
                          </p>
                        )}
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-sm ${
                          booking.status === 'Confirmed'
                            ? 'bg-green-100 text-green-800'
                            : booking.status === 'Pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {booking.status === 'Confirmed'
                          ? 'Підтверджено'
                          : booking.status === 'Pending'
                          ? 'Очікує підтвердження'
                          : booking.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Past Bookings */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold mb-4 text-gray-900">Історія записів</h2>
            {pastBookings.length === 0 ? (
              <p className="text-gray-700">Немає минулих записів</p>
            ) : (
              <div className="space-y-4">
                {pastBookings.map((booking) => (
                  <div
                    key={booking.bookingId}
                    className="border border-gray-200 rounded-lg p-4 opacity-75"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {(booking.service as any)?.name || 'Послуга'}
                        </h3>
                        <p className="text-gray-700 text-sm">
                          {new Date(booking.bookingDate).toLocaleDateString('uk-UA')} о {booking.startTime}
                        </p>
                      </div>
                      <span className="text-sm text-gray-700">
                        {booking.status === 'Completed'
                          ? 'Завершено'
                          : booking.status === 'Cancelled'
                          ? 'Скасовано'
                          : booking.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

