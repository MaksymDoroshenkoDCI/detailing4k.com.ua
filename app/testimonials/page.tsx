'use client'

import { useEffect, useState } from 'react'
import { Testimonial } from '@/types'

export default function TestimonialsPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    text: '',
    rating: 5,
    clientName: '',
  })
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    fetch('/api/testimonials')
      .then((res) => res.json())
      .then((data) => {
        // Ensure data is an array
        if (Array.isArray(data)) {
          setTestimonials(data)
        } else {
          console.error('Invalid data format:', data)
          setTestimonials([])
        }
        setLoading(false)
      })
      .catch((error) => {
        console.error('Error fetching testimonials:', error)
        setTestimonials([])
        setLoading(false)
      })
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      const response = await fetch('/api/testimonials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        alert('Дякуємо за ваш відгук! Він буде опублікований після модерації.')
        setFormData({ text: '', rating: 5, clientName: '' })
        setShowForm(false)
      } else {
        alert('Помилка при відправці відгуку')
      }
    } catch (error) {
      alert('Помилка при відправці відгуку')
    } finally {
      setSubmitting(false)
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
      <h1 className="text-4xl font-bold mb-4 text-center">Відгуки клієнтів</h1>
      <p className="text-center text-gray-600 mb-8">
        Що кажуть наші клієнти про якість наших послуг
      </p>

      <div className="text-center mb-8">
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition-colors"
        >
          {showForm ? 'Сховати форму' : 'Залишити відгук'}
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-12 max-w-2xl mx-auto">
          <h2 className="text-2xl font-semibold mb-4">Залишити відгук</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Ваше ім&apos;я (необов&apos;язково)</label>
              <input
                type="text"
                value={formData.clientName}
                onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Оцінка</label>
              <select
                value={formData.rating}
                onChange={(e) => setFormData({ ...formData, rating: Number(e.target.value) })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                {[5, 4, 3, 2, 1].map((rating) => (
                  <option key={rating} value={rating}>
                    {rating} зірок
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Ваш відгук *</label>
              <textarea
                value={formData.text}
                onChange={(e) => setFormData({ ...formData, text: e.target.value })}
                rows={5}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                required
                minLength={10}
              />
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-primary-600 text-white py-2 rounded-lg hover:bg-primary-700 transition-colors disabled:bg-gray-400"
            >
              {submitting ? 'Відправка...' : 'Відправити відгук'}
            </button>
          </form>
        </div>
      )}

      {!Array.isArray(testimonials) || testimonials.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">Поки що немає відгуків</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.testimonialId}
              className="bg-white rounded-lg shadow-md p-6"
            >
              <div className="flex items-center mb-4">
                {testimonial.rating && (
                  <div className="flex gap-1">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <span key={i} className="text-yellow-400">⭐</span>
                    ))}
                  </div>
                )}
              </div>
              <p className="text-gray-700 mb-4 italic">&quot;{testimonial.text}&quot;</p>
              <div className="border-t pt-4">
                <p className="font-semibold">
                  {testimonial.client?.name || testimonial.clientName || 'Анонімний клієнт'}
                </p>
                <p className="text-sm text-gray-500">
                  {new Date(testimonial.datePosted).toLocaleDateString('uk-UA')}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}



