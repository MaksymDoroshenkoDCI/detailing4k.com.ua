'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Service } from '@/types'

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/services')
      .then((res) => res.json())
      .then((data) => {
        setServices(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="container mx-auto max-w-6xl px-4 py-16 text-center">
        <p>Завантаження...</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto max-w-6xl px-4 py-16">
      <h1 className="text-4xl font-bold mb-4 text-center">Наші послуги</h1>
      <p className="text-center text-gray-600 mb-12">
        Виберіть послугу, яка вам потрібна, та запишіться онлайн
      </p>

      {services.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">Послуги ще не додані</p>
          <p className="text-sm text-gray-400">Адміністратор додасть послуги найближчим часом</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <div
              key={service.serviceId}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              {service.imageUrl && (
                <div className="h-48 bg-gray-200 relative">
                  <img
                    src={service.imageUrl}
                    alt={service.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">{service.name}</h3>
                {service.category && (
                  <span className="text-sm text-primary-600 mb-2 inline-block">
                    {service.category.name}
                  </span>
                )}
                <p className="text-gray-600 mb-4 line-clamp-3">
                  {service.description || 'Опис послуги'}
                </p>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-2xl font-bold text-primary-600">
                      {Number(service.price).toLocaleString('uk-UA')} ₴
                    </p>
                    <p className="text-sm text-gray-500">
                      {service.durationMinutes} хв
                    </p>
                  </div>
                  <Link
                    href={`/booking?serviceId=${service.serviceId}`}
                    className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
                  >
                    Записатися
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}



