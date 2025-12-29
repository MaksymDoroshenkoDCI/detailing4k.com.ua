'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Service } from '@/types'

function BookingForm() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const serviceIdParam = searchParams.get('serviceId')

  const [services, setServices] = useState<Service[]>([])
  const [selectedService, setSelectedService] = useState<string>(serviceIdParam || '')
  const [selectedDate, setSelectedDate] = useState('')
  const [availableSlots, setAvailableSlots] = useState<string[]>([])
  const [selectedTime, setSelectedTime] = useState('')
  const [formData, setFormData] = useState({
    clientName: '',
    clientEmail: '',
    clientPhone: '',
    vehicleMake: '',
    vehicleModel: '',
  })
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    fetch('/api/services')
      .then((res) => res.json())
      .then((data) => {
        // Ensure data is an array
        if (Array.isArray(data)) {
          setServices(data)
        } else {
          console.error('Invalid data format:', data)
          setServices([])
        }
      })
      .catch((error) => {
        console.error('Error fetching services:', error)
        setServices([])
      })
  }, [])

  useEffect(() => {
    if (selectedService && selectedDate) {
      fetch(`/api/bookings/available-slots?date=${selectedDate}&serviceId=${selectedService}`)
        .then((res) => res.json())
        .then((data) => setAvailableSlots(data.slots || []))
    } else {
      setAvailableSlots([])
    }
  }, [selectedService, selectedDate])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedService || !selectedDate || !selectedTime) {
      alert('Будь ласка, заповніть всі обов\'язкові поля')
      return
    }

    setLoading(true)
    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          serviceId: selectedService,
          bookingDate: selectedDate,
          startTime: selectedTime,
          ...formData,
        }),
      })

      if (response.ok) {
        setSubmitted(true)
        setTimeout(() => {
          router.push('/account')
        }, 3000)
      } else {
        const data = await response.json()
        alert(data.error || 'Помилка при створенні бронювання')
      }
    } catch (error) {
      alert('Помилка при створенні бронювання')
    } finally {
      setLoading(false)
    }
  }

  const minDate = new Date().toISOString().split('T')[0]

  if (submitted) {
    return (
      <div className="container mx-auto max-w-2xl px-4 py-16 text-center">
        <div className="bg-green-50 border border-green-200 rounded-lg p-8">
          <div className="text-5xl mb-4">✅</div>
          <h2 className="text-2xl font-bold mb-4 text-green-800">Бронювання успішно створено!</h2>
          <p className="text-gray-600 mb-4">
            Ми надіслали вам підтвердження на email. Очікуйте дзвінка від нашого менеджера.
          </p>
          <p className="text-sm text-gray-500">
            Перенаправлення до вашого кабінету...
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto max-w-2xl px-4 py-16">
      <h1 className="text-4xl font-bold mb-8 text-center text-gray-900">Онлайн бронювання</h1>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 space-y-6">
        {/* Service Selection */}
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-900">Послуга *</label>
          <select
            value={selectedService}
            onChange={(e) => setSelectedService(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            required
          >
            <option value="">Оберіть послугу</option>
            {Array.isArray(services) && services.map((service) => (
              <option key={service.serviceId} value={service.serviceId}>
                {service.name} - {Number(service.price).toLocaleString('uk-UA')} ₴
              </option>
            ))}
          </select>
        </div>

        {/* Date Selection */}
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-900">Дата *</label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            min={minDate}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            required
          />
        </div>

        {/* Time Selection */}
        {availableSlots.length > 0 && (
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-900">Час *</label>
            <div className="grid grid-cols-4 gap-2">
              {availableSlots.map((slot) => (
                <button
                  key={slot}
                  type="button"
                  onClick={() => setSelectedTime(slot)}
                  className={`px-4 py-2 rounded-lg border transition-colors ${
                    selectedTime === slot
                      ? 'bg-primary-600 text-white border-primary-600'
                      : 'bg-white border-gray-300 hover:border-primary-500 text-gray-900'
                  }`}
                >
                  {slot}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Client Information */}
        <div className="border-t pt-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-900">Ваші дані</h3>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-900">Ім'я *</label>
              <input
                type="text"
                value={formData.clientName}
                onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-900">Email *</label>
              <input
                type="email"
                value={formData.clientEmail}
                onChange={(e) => setFormData({ ...formData, clientEmail: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-900">Телефон *</label>
              <input
                type="tel"
                value={formData.clientPhone}
                onChange={(e) => setFormData({ ...formData, clientPhone: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-900">Марка авто</label>
              <input
                type="text"
                value={formData.vehicleMake}
                onChange={(e) => setFormData({ ...formData, vehicleMake: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-900">Модель авто</label>
              <input
                type="text"
                value={formData.vehicleModel}
                onChange={(e) => setFormData({ ...formData, vehicleModel: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading || !selectedService || !selectedDate || !selectedTime}
          className="w-full bg-primary-600 text-white py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {loading ? 'Обробка...' : 'Підтвердити бронювання'}
        </button>
      </form>
    </div>
  )
}

export default function BookingPage() {
  return (
    <Suspense fallback={
      <div className="container mx-auto max-w-2xl px-4 py-16 text-center">
        <p>Завантаження...</p>
      </div>
    }>
      <BookingForm />
    </Suspense>
  )
}
