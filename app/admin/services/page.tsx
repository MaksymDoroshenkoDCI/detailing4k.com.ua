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
  const [uploadingImage, setUploadingImage] = useState(false)
  const [imagePreview, setImagePreview] = useState<string | null>(null)

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

    // Validate required fields
    if (!formData.name || !formData.price || !formData.durationMinutes) {
      alert('Будь ласка, заповніть всі обов\'язкові поля')
      return
    }

    const payload = {
      name: formData.name,
      description: formData.description || undefined,
      price: parseFloat(formData.price),
      durationMinutes: parseInt(formData.durationMinutes),
      categoryId: formData.categoryId || null,
      imageUrl: formData.imageUrl || null,
    }

    console.log('Submitting service:', payload)

    try {
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
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
        setImagePreview(null)
      } else {
        const errorData = await response.json().catch(() => ({}))
        console.error('Error response:', errorData)
        alert(errorData.error || 'Помилка при збереженні послуги')
      }
    } catch (error) {
      alert('Помилка при збереженні послуги')
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Будь ласка, виберіть файл зображення')
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Розмір файлу не повинен перевищувати 5MB')
      return
    }

    setUploadingImage(true)

    try {
      // Create FormData
      const formDataToUpload = new FormData()
      formDataToUpload.append('file', file)

      // Upload file
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formDataToUpload,
      })

      if (!response.ok) {
        throw new Error('Помилка при завантаженні зображення')
      }

      const data = await response.json()
      
      if (!data.url) {
        throw new Error('URL не отримано від сервера')
      }
      
      // Update form data with uploaded image URL
      const newImageUrl = data.url
      console.log('Uploaded image URL:', newImageUrl)
      setFormData((prev) => ({ ...prev, imageUrl: newImageUrl }))
      setImagePreview(newImageUrl)
    } catch (error) {
      console.error('Error uploading image:', error)
      alert('Помилка при завантаженні зображення')
    } finally {
      setUploadingImage(false)
    }
  }

  const handleEdit = (service: Service) => {
    setEditingService(service)
    setFormData({
      name: service.name,
      description: service.description || '',
      price: String(service.price),
      durationMinutes: String(service.durationMinutes), // Keep in minutes for internal processing
      categoryId: service.categoryId || '',
      imageUrl: service.imageUrl || '',
    })
    setImagePreview(service.imageUrl || null)
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
          <h2 className="text-2xl font-semibold mb-4 text-gray-900">
            {editingService ? 'Редагувати послугу' : 'Нова послуга'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-900">Назва *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-900">Опис</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900"
              />
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-900">Ціна (₴) *</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-900">Тривалість (год) *</label>
                <input
                  type="number"
                  step="0.5"
                  value={formData.durationMinutes ? (Number(formData.durationMinutes) / 60).toString() : ''}
                  onChange={(e) => {
                    const hours = parseFloat(e.target.value) || 0
                    setFormData({ ...formData, durationMinutes: String(Math.round(hours * 60)) })
                  }}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900"
                  required
                  placeholder="4.5"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-900">
                Зображення послуги
              </label>
              
              {/* File Upload */}
              <div className="mb-4">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={uploadingImage}
                  className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
                {uploadingImage && (
                  <p className="mt-2 text-sm text-gray-600">Завантаження...</p>
                )}
              </div>

              {/* Image Preview */}
              {(imagePreview || formData.imageUrl) && (
                <div className="mb-4">
                  <img
                    src={imagePreview || formData.imageUrl}
                    alt="Preview"
                    className="w-full h-48 object-cover rounded-lg border border-gray-300"
                  />
                </div>
              )}

              {/* URL Input (Alternative) */}
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-900">
                  Або введіть URL зображення (необов'язково)
                </label>
                <input
                  type="text"
                  value={formData.imageUrl || ''}
                  onChange={(e) => {
                    setFormData({ ...formData, imageUrl: e.target.value })
                    setImagePreview(e.target.value || null)
                  }}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900"
                  placeholder="https://example.com/image.jpg або залиште порожнім"
                />
              </div>
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
              <h3 className="text-xl font-semibold mb-2 text-gray-900">{service.name}</h3>
              <p className="text-gray-600 mb-4 line-clamp-2">
                {service.description || 'Без опису'}
              </p>
              <div className="flex justify-between items-center mb-4">
                <span className="text-2xl font-bold text-primary-600">
                  {Number(service.price).toLocaleString('uk-UA')} ₴
                </span>
                <span className="text-sm text-gray-500">
                  {service.durationMinutes >= 60 
                    ? `${(service.durationMinutes / 60).toFixed(1)} год` 
                    : `${service.durationMinutes} хв`}
                </span>
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



