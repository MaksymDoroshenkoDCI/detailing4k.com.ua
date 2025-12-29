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
  const [uploadingBefore, setUploadingBefore] = useState(false)
  const [uploadingAfter, setUploadingAfter] = useState(false)
  const [beforePreview, setBeforePreview] = useState<string[]>([])
  const [afterPreview, setAfterPreview] = useState<string[]>([])
  const [editingImage, setEditingImage] = useState<GalleryImage | null>(null)

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

  const handleImageUpload = async (
    files: FileList | null,
    type: 'before' | 'after'
  ) => {
    if (!files || files.length === 0) return

    if (files.length > 4) {
      alert('Максимум 4 зображення')
      return
    }

    if (type === 'before') {
      setUploadingBefore(true)
    } else {
      setUploadingAfter(true)
    }

    try {
      const uploadPromises = Array.from(files).map(async (file) => {
        const formData = new FormData()
        formData.append('file', file)

        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        })

        if (!response.ok) {
          throw new Error('Помилка завантаження зображення')
        }

        const data = await response.json()
        return data.url
      })

      const urls = await Promise.all(uploadPromises)

      if (type === 'before') {
        const currentUrls = beforePreview
        const newUrls = [...currentUrls, ...urls].slice(0, 4) // Максимум 4
        setBeforePreview(newUrls)
        setFormData((prev) => ({ ...prev, beforeImageUrl: JSON.stringify(newUrls) }))
      } else {
        const currentUrls = afterPreview
        const newUrls = [...currentUrls, ...urls].slice(0, 4) // Максимум 4
        setAfterPreview(newUrls)
        setFormData((prev) => ({ ...prev, afterImageUrl: JSON.stringify(newUrls) }))
      }
    } catch (error) {
      console.error('Error uploading images:', error)
      alert('Помилка при завантаженні зображення')
    } finally {
      if (type === 'before') {
        setUploadingBefore(false)
      } else {
        setUploadingAfter(false)
      }
    }
  }

  const removeImage = (index: number, type: 'before' | 'after') => {
    if (type === 'before') {
      const newUrls = beforePreview.filter((_, i) => i !== index)
      setBeforePreview(newUrls)
      setFormData((prev) => ({ ...prev, beforeImageUrl: JSON.stringify(newUrls) }))
    } else {
      const newUrls = afterPreview.filter((_, i) => i !== index)
      setAfterPreview(newUrls)
      setFormData((prev) => ({ ...prev, afterImageUrl: JSON.stringify(newUrls) }))
    }
  }

  const handleEdit = (image: GalleryImage) => {
    setEditingImage(image)
    
    // Парсимо JSON якщо це масив, інакше використовуємо як єдиний рядок
    let beforeUrls: string[] = []
    let afterUrls: string[] = []
    
    try {
      beforeUrls = JSON.parse(image.beforeImageUrl)
      if (!Array.isArray(beforeUrls)) beforeUrls = [image.beforeImageUrl]
    } catch {
      beforeUrls = [image.beforeImageUrl]
    }
    
    try {
      afterUrls = JSON.parse(image.afterImageUrl)
      if (!Array.isArray(afterUrls)) afterUrls = [image.afterImageUrl]
    } catch {
      afterUrls = [image.afterImageUrl]
    }

    setFormData({
      title: image.title || '',
      description: image.description || '',
      beforeImageUrl: JSON.stringify(beforeUrls),
      afterImageUrl: JSON.stringify(afterUrls),
      serviceId: image.serviceId || '',
    })
    setBeforePreview(beforeUrls)
    setAfterPreview(afterUrls)
    setShowForm(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.beforeImageUrl || !formData.afterImageUrl) {
      alert('Будь ласка, завантажте зображення')
      return
    }

    // Перевіряємо, що є хоча б одне зображення
    try {
      const beforeUrls = JSON.parse(formData.beforeImageUrl)
      const afterUrls = JSON.parse(formData.afterImageUrl)
      
      if ((!Array.isArray(beforeUrls) || beforeUrls.length === 0) || 
          (!Array.isArray(afterUrls) || afterUrls.length === 0)) {
        alert('Будь ласка, завантажте хоча б одне зображення &quot;До&quot; та &quot;Після&quot;')
        return
      }
    } catch {
      if (!formData.beforeImageUrl || !formData.afterImageUrl) {
        alert('Будь ласка, завантажте зображення')
        return
      }
    }

    try {
      const url = editingImage
        ? `/api/admin/gallery/${editingImage.imageId}`
        : '/api/admin/gallery'
      const method = editingImage ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          serviceId: formData.serviceId || null,
        }),
      })

      if (response.ok) {
        fetchImages()
        setShowForm(false)
        setEditingImage(null)
        setFormData({
          title: '',
          description: '',
          beforeImageUrl: '',
          afterImageUrl: '',
          serviceId: '',
        })
        setBeforePreview([])
        setAfterPreview([])
      } else {
        const errorData = await response.json()
        console.error('Error response:', errorData)
        alert(editingImage ? 'Помилка при оновленні зображення' : 'Помилка при додаванні зображення')
      }
    } catch (error) {
      console.error('Error:', error)
      alert(editingImage ? 'Помилка при оновленні зображення' : 'Помилка при додаванні зображення')
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
        <h1 className="text-4xl font-bold text-white">Керування галереєю</h1>
        <button
          onClick={() => {
            setShowForm(!showForm)
            setEditingImage(null)
            setFormData({
              title: '',
              description: '',
              beforeImageUrl: '',
              afterImageUrl: '',
              serviceId: '',
            })
            setBeforePreview([])
            setAfterPreview([])
          }}
          className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition-colors"
        >
          {showForm ? 'Скасувати' : '+ Додати зображення'}
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-gray-900">
            {editingImage ? 'Редагувати зображення' : 'Нове зображення'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-900">Назва</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-900">Опис</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900"
              />
            </div>
            {/* Before Image Upload */}
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-900">
                Зображення &quot;До&quot; * (до 4 зображень)
              </label>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => {
                  handleImageUpload(e.target.files, 'before')
                }}
                disabled={uploadingBefore || beforePreview.length >= 4}
                className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-white focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              {beforePreview.length >= 4 && (
                <p className="mt-2 text-sm text-yellow-600">Досягнуто максимум 4 зображень</p>
              )}
              {uploadingBefore && (
                <p className="mt-2 text-sm text-gray-600">Завантаження...</p>
              )}
              {beforePreview.length > 0 && (
                <div className="mt-4 grid grid-cols-2 gap-4">
                  {beforePreview.map((url, index) => (
                    <div key={index} className="relative">
                      <img
                        src={url}
                        alt={`Before preview ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg border border-gray-300"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index, 'before')}
                        className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-700"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* After Image Upload */}
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-900">
                Зображення &quot;Після&quot; * (до 4 зображень)
              </label>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => {
                  handleImageUpload(e.target.files, 'after')
                }}
                disabled={uploadingAfter || afterPreview.length >= 4}
                className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-white focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              {afterPreview.length >= 4 && (
                <p className="mt-2 text-sm text-yellow-600">Досягнуто максимум 4 зображень</p>
              )}
              {uploadingAfter && (
                <p className="mt-2 text-sm text-gray-600">Завантаження...</p>
              )}
              {afterPreview.length > 0 && (
                <div className="mt-4 grid grid-cols-2 gap-4">
                  {afterPreview.map((url, index) => (
                    <div key={index} className="relative">
                      <img
                        src={url}
                        alt={`After preview ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg border border-gray-300"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index, 'after')}
                        className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-700"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <button
              type="submit"
              className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition-colors"
            >
              {editingImage ? 'Оновити' : 'Додати'}
            </button>
          </form>
        </div>
      )}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {images.map((image) => {
          // Парсимо JSON якщо це масив, інакше використовуємо як єдиний рядок
          let beforeUrls: string[] = []
          let afterUrls: string[] = []
          
          try {
            beforeUrls = JSON.parse(image.beforeImageUrl)
            if (!Array.isArray(beforeUrls)) beforeUrls = [image.beforeImageUrl]
          } catch {
            beforeUrls = [image.beforeImageUrl]
          }
          
          try {
            afterUrls = JSON.parse(image.afterImageUrl)
            if (!Array.isArray(afterUrls)) afterUrls = [image.afterImageUrl]
          } catch {
            afterUrls = [image.afterImageUrl]
          }

          return (
          <div key={image.imageId} className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="grid grid-cols-2 gap-1">
              <div className="relative">
                <div className="grid grid-cols-2 gap-1">
                  {beforeUrls.slice(0, 4).map((url, idx) => (
                    <div key={idx} className="relative h-16">
                      <img
                        src={url}
                        alt={`Before ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                      {idx === 0 && (
                        <div className="absolute top-1 left-1 bg-primary-600 text-white px-2 py-0.5 rounded text-xs">
                          До
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
              <div className="relative">
                <div className="grid grid-cols-2 gap-1">
                  {afterUrls.slice(0, 4).map((url, idx) => (
                    <div key={idx} className="relative h-16">
                      <img
                        src={url}
                        alt={`After ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                      {idx === 0 && (
                        <div className="absolute top-1 left-1 bg-green-600 text-white px-2 py-0.5 rounded text-xs">
                          Після
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="p-4">
              {image.title && (
                <h3 className="font-semibold mb-1 text-gray-900">{image.title}</h3>
              )}
              {image.description && (
                <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                  {image.description}
                </p>
              )}
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(image)}
                  className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
                >
                  Редагувати
                </button>
                <button
                  onClick={() => handleDelete(image.imageId)}
                  className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors text-sm"
                >
                  Видалити
                </button>
              </div>
            </div>
          </div>
          )
        })}
      </div>
    </div>
  )
}



