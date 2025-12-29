'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Booking } from '@/types'

export default function AdminBookingsPage() {
  const router = useRouter()
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => res.json())
      .then((data) => {
        if (!data.user || !data.user.role) {
          router.push('/login?isAdmin=true')
        } else {
          fetchBookings()
        }
      })
  }, [router])

  const fetchBookings = () => {
    fetch('/api/bookings')
      .then((res) => res.json())
      .then((data) => {
        setBookings(data)
        setLoading(false)
      })
  }

  const updateStatus = async (bookingId: string, status: string) => {
    try {
      const response = await fetch(`/api/admin/bookings/${bookingId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      })

      if (response.ok) {
        fetchBookings()
      } else {
        alert('Помилка при оновленні статусу')
      }
    } catch (error) {
      alert('Помилка при оновленні статусу')
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto max-w-6xl px-4 py-16 text-center">
        <p>Завантаження...</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto max-w-6xl px-4 py-16">
      <h1 className="text-4xl font-bold mb-8">Керування бронюваннями</h1>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Клієнт</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Послуга</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Дата</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Час</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Статус</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Дії</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {bookings.map((booking) => (
              <tr key={booking.bookingId}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="font-medium">{booking.clientName || booking.client?.name || 'N/A'}</div>
                    <div className="text-sm text-gray-500">{booking.clientEmail || booking.client?.email}</div>
                    <div className="text-sm text-gray-500">{booking.clientPhone || booking.client?.phone}</div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="font-medium">{booking.service?.name || 'N/A'}</div>
                  {booking.vehicleMake && booking.vehicleModel && (
                    <div className="text-sm text-gray-500">
                      {booking.vehicleMake} {booking.vehicleModel}
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {new Date(booking.bookingDate).toLocaleDateString('uk-UA')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {booking.startTime} - {booking.endTime}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      booking.status === 'Confirmed'
                        ? 'bg-green-100 text-green-800'
                        : booking.status === 'Pending'
                        ? 'bg-yellow-100 text-yellow-800'
                        : booking.status === 'Cancelled'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {booking.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <select
                    value={booking.status}
                    onChange={(e) => updateStatus(booking.bookingId, e.target.value)}
                    className="text-sm border border-gray-300 rounded px-2 py-1"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Confirmed">Confirmed</option>
                    <option value="Completed">Completed</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

