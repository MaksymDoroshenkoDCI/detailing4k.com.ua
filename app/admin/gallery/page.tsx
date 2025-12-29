'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { GalleryImage } from '@/types'

export default function AdminGalleryPage() {
  const router = useRouter()
  const [images, setImages] = useState<GalleryImage[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    beforeImageUrl: '',
    afterImageUrl: '',
    serviceId: '',
  })

  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => res.json())
      .then((data) => {
        if (!data.user || !data.user.role) {
          router.push('/login?isAdmin=true')
        } else {
          fetchImages()
        }
      })
  }, [router])

  const fetchImages = () => {
    fetch('/api/gallery')
      .then((res) => res.json())
      .then((data) => {
        setImages(data)
        setLoading(false)
      })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const response = await fetch('/api/admin/gallery', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          serviceId: formData.serviceId || null,
        }),
      })

      if (response.ok) {
        fetchImages()
        setShowForm(false)
        setFormData({
          title: '',
          description: '',
          beforeImageUrl: '',
          afterImageUrl: '',
          serviceId: '',
        })
      } else {
        alert('Помилка при додаванні зображення')
      }
    } catch (error) {
      alert('Помилка при додаванні зображення')
    }
  }

  const handleDelete = async (imageId: string) => {
    if (!confirm('Ви впевнені, що хочете видалити це зображення?')) return

    try {
      const response = await fetch(`/api/admin/gallery/${imageId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        fetchImages()
      } else {
        alert('Помилка при видаленні зображення')
      }
    } catch (error) {
      alert('Помилка при видаленні зображення')
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
        <h1 className="text-4xl font-bold">Керування галереєю</h1>
        <button
          onClick={() => {
            setShowForm(!showForm)
            setFormData({
              title: '',
              description: '',
              beforeImageUrl: '',
              afterImageUrl: '',
              serviceId: '',
            })
          }}
          className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition-colors"
        >
          {showForm ? 'Скасувати' : '+ Додати зображення'}
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4">Нове зображення</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Назва</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Опис</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">URL зображення "До" *</label>
              <input
                type="url"
                value={formData.beforeImageUrl}
                onChange={(e) => setFormData({ ...formData, beforeImageUrl: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">URL зображення "Після" *</label>
              <input
                type="url"
                value={formData.afterImageUrl}
                onChange={(e) => setFormData({ ...formData, afterImageUrl: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                required
              />
            </div>
            <button
              type="submit"
              className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition-colors"
            >
              Додати
            </button>
          </form>
        </div>
      )}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {images.map((image) => (
          <div key={image.imageId} className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="grid grid-cols-2 gap-1">
              <div className="relative h-32">
                <img
                  src={image.beforeImageUrl}
                  alt="Before"
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-1 left-1 bg-primary-600 text-white px-2 py-1 rounded text-xs">
                  До
                </div>
              </div>
              <div className="relative h-32">
                <img
                  src={image.afterImageUrl}
                  alt="After"
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-1 left-1 bg-green-600 text-white px-2 py-1 rounded text-xs">
                  Після
                </div>
              </div>
            </div>
            <div className="p-4">
              {image.title && (
                <h3 className="font-semibold mb-1">{image.title}</h3>
              )}
              {image.description && (
                <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                  {image.description}
                </p>
              )}
              <button
                onClick={() => handleDelete(image.imageId)}
                className="w-full bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors text-sm"
              >
                Видалити
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}



