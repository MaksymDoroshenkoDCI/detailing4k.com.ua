'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Service } from '@/types'

export default function AdminServicesPage() {
  const router = useRouter()
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingService, setEditingService] = useState<Service | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    durationMinutes: '',
    categoryId: '',
    imageUrl: '',
  })

  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => res.json())
      .then((data) => {
        if (!data.user || !data.user.role) {
          router.push('/login?isAdmin=true')
        } else {
          fetchServices()
        }
      })
  }, [router])

  const fetchServices = () => {
    fetch('/api/services')
      .then((res) => res.json())
      .then((data) => {
        setServices(data)
        setLoading(false)
      })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const url = editingService
      ? `/api/admin/services/${editingService.serviceId}`
      : '/api/admin/services'
    const method = editingService ? 'PUT' : 'POST'

    try {
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price),
          durationMinutes: parseInt(formData.durationMinutes),
        }),
      })

      if (response.ok) {
        fetchServices()
        setShowForm(false)
        setEditingService(null)
        setFormData({
          name: '',
          description: '',
          price: '',
          durationMinutes: '',
          categoryId: '',
          imageUrl: '',
        })
      } else {
        alert('Помилка при збереженні послуги')
      }
    } catch (error) {
      alert('Помилка при збереженні послуги')
    }
  }

  const handleEdit = (service: Service) => {
    setEditingService(service)
    setFormData({
      name: service.name,
      description: service.description || '',
      price: String(service.price),
      durationMinutes: String(service.durationMinutes),
      categoryId: service.categoryId || '',
      imageUrl: service.imageUrl || '',
    })
    setShowForm(true)
  }

  const handleDelete = async (serviceId: string) => {
    if (!confirm('Ви впевнені, що хочете видалити цю послугу?')) return

    try {
      const response = await fetch(`/api/admin/services/${serviceId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        fetchServices()
      } else {
        alert('Помилка при видаленні послуги')
      }
    } catch (error) {
      alert('Помилка при видаленні послуги')
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
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">Керування послугами</h1>
        <button
          onClick={() => {
            setShowForm(!showForm)
            setEditingService(null)
            setFormData({
              name: '',
              description: '',
              price: '',
              durationMinutes: '',
              categoryId: '',
              imageUrl: '',
            })
          }}
          className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition-colors"
        >
          {showForm ? 'Скасувати' : '+ Додати послугу'}
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            {editingService ? 'Редагувати послугу' : 'Нова послуга'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Назва *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Опис</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Ціна (₴) *</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Тривалість (хв) *</label>
                <input
                  type="number"
                  value={formData.durationMinutes}
                  onChange={(e) => setFormData({ ...formData, durationMinutes: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">URL зображення</label>
              <input
                type="url"
                value={formData.imageUrl}
                onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <button
              type="submit"
              className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition-colors"
            >
              {editingService ? 'Оновити' : 'Створити'}
            </button>
          </form>
        </div>
      )}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((service) => (
          <div key={service.serviceId} className="bg-white rounded-lg shadow-md overflow-hidden">
            {service.imageUrl && (
              <img
                src={service.imageUrl}
                alt={service.name}
                className="w-full h-48 object-cover"
              />
            )}
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-2">{service.name}</h3>
              <p className="text-gray-600 mb-4 line-clamp-2">
                {service.description || 'Без опису'}
              </p>
              <div className="flex justify-between items-center mb-4">
                <span className="text-2xl font-bold text-primary-600">
                  {Number(service.price).toLocaleString('uk-UA')} ₴
                </span>
                <span className="text-sm text-gray-500">{service.durationMinutes} хв</span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(service)}
                  className="flex-1 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
                >
                  Редагувати
                </button>
                <button
                  onClick={() => handleDelete(service.serviceId)}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                >
                  Видалити
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}



