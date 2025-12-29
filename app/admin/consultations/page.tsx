'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Consultation } from '@/types'

export default function AdminConsultationsPage() {
  const router = useRouter()
  const [consultations, setConsultations] = useState<Consultation[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => res.json())
      .then((data) => {
        if (!data.user || !data.user.role) {
          router.push('/login?isAdmin=true')
        } else {
          fetchConsultations()
        }
      })
  }, [router])

  const fetchConsultations = () => {
    fetch('/api/consultations')
      .then((res) => res.json())
      .then((data) => {
        setConsultations(data)
        setLoading(false)
      })
  }

  const updateStatus = async (consultationId: string, status: string) => {
    try {
      const response = await fetch(`/api/admin/consultations/${consultationId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      })

      if (response.ok) {
        fetchConsultations()
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
      <h1 className="text-4xl font-bold mb-8">Консультації</h1>

      <div className="space-y-4">
        {consultations.map((consultation) => (
          <div
            key={consultation.consultationId}
            className="bg-white rounded-lg shadow-md p-6"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold">{consultation.name}</h3>
                <p className="text-gray-600">{consultation.email}</p>
                {consultation.phone && (
                  <p className="text-gray-600">{consultation.phone}</p>
                )}
              </div>
              <div className="flex items-center gap-4">
                <span
                  className={`px-3 py-1 rounded-full text-sm ${
                    consultation.status === 'New'
                      ? 'bg-yellow-100 text-yellow-800'
                      : consultation.status === 'Reviewed'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-green-100 text-green-800'
                  }`}
                >
                  {consultation.status}
                </span>
                <select
                  value={consultation.status}
                  onChange={(e) => updateStatus(consultation.consultationId, e.target.value)}
                  className="text-sm border border-gray-300 rounded px-2 py-1"
                >
                  <option value="New">New</option>
                  <option value="Reviewed">Reviewed</option>
                  <option value="Responded">Responded</option>
                </select>
              </div>
            </div>
            <p className="text-gray-700 mb-2">{consultation.message}</p>
            <p className="text-sm text-gray-500">
              {new Date(consultation.createdAt).toLocaleString('uk-UA')}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}



