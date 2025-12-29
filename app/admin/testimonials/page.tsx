'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Testimonial } from '@/types'

export default function AdminTestimonialsPage() {
  const router = useRouter()
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => res.json())
      .then((data) => {
        if (!data.user || !data.user.role) {
          router.push('/login?isAdmin=true')
        } else {
          fetchTestimonials()
        }
      })
  }, [router])

  const fetchTestimonials = () => {
    fetch('/api/admin/testimonials')
      .then((res) => res.json())
      .then((data) => {
        setTestimonials(data)
        setLoading(false)
      })
  }

  const toggleApproval = async (testimonialId: string, approved: boolean) => {
    try {
      const response = await fetch(`/api/admin/testimonials/${testimonialId}/approve`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ approved }),
      })

      if (response.ok) {
        fetchTestimonials()
      } else {
        alert('Помилка при оновленні відгуку')
      }
    } catch (error) {
      alert('Помилка при оновленні відгуку')
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto max-w-6xl px-4 py-16 text-center">
        <p>Завантаження...</p>
      </div>
    )
  }

  const pendingTestimonials = testimonials.filter((t) => !t.approved)
  const approvedTestimonials = testimonials.filter((t) => t.approved)

  return (
    <div className="container mx-auto max-w-6xl px-4 py-16">
      <h1 className="text-4xl font-bold mb-8">Керування відгуками</h1>

      {pendingTestimonials.length > 0 && (
        <div className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Очікують модерації</h2>
          <div className="space-y-4">
            {pendingTestimonials.map((testimonial) => (
              <div
                key={testimonial.testimonialId}
                className="bg-yellow-50 border border-yellow-200 rounded-lg p-6"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="font-semibold">
                      {testimonial.client?.name || testimonial.clientName || 'Анонімний'}
                    </p>
                    {testimonial.rating && (
                      <div className="flex gap-1 mt-1">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <span key={i}>⭐</span>
                        ))}
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => toggleApproval(testimonial.testimonialId, true)}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Схвалити
                  </button>
                </div>
                <p className="text-gray-700 mb-2">"{testimonial.text}"</p>
                <p className="text-sm text-gray-500">
                  {new Date(testimonial.datePosted).toLocaleDateString('uk-UA')}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div>
        <h2 className="text-2xl font-semibold mb-4">Схвалені відгуки</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {approvedTestimonials.map((testimonial) => (
            <div
              key={testimonial.testimonialId}
              className="bg-white rounded-lg shadow-md p-6"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="font-semibold">
                    {testimonial.client?.name || testimonial.clientName || 'Анонімний'}
                  </p>
                  {testimonial.rating && (
                    <div className="flex gap-1 mt-1">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <span key={i}>⭐</span>
                      ))}
                    </div>
                  )}
                </div>
                <button
                  onClick={() => toggleApproval(testimonial.testimonialId, false)}
                  className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 transition-colors"
                >
                  Відхилити
                </button>
              </div>
              <p className="text-gray-700 mb-2">"{testimonial.text}"</p>
              <p className="text-sm text-gray-500">
                {new Date(testimonial.datePosted).toLocaleDateString('uk-UA')}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}



