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
    images: [] as string[],
    serviceId: '',
  })
  const [uploading, setUploading] = useState(false)
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
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch')
        return res.json()
      })
      .then((data) => {
        if (Array.isArray(data)) {
          setImages(data)
        } else {
          console.error('API returned non-array:', data)
          setImages([])
        }
        setLoading(false)
      })
      .catch((err) => {
        console.error('Error loading gallery:', err)
        setImages([])
        setLoading(false)
      })
  }

  // Функція для стиснення зображення
  const compressImage = (file: File, maxWidth: number = 1920, quality: number = 0.8): Promise<File> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = (e) => {
        const img = new Image()
        img.onload = () => {
          const canvas = document.createElement('canvas')
          let width = img.width
          let height = img.height

          // Зменшуємо розмір якщо він більший за maxWidth
          if (width > maxWidth) {
            height = (height * maxWidth) / width
            width = maxWidth
          }

          canvas.width = width
          canvas.height = height

          const ctx = canvas.getContext('2d')
          if (!ctx) {
            reject(new Error('Не вдалося створити canvas контекст'))
            return
          }

          ctx.drawImage(img, 0, 0, width, height)

          canvas.toBlob(
            (blob) => {
              if (!blob) {
                reject(new Error('Не вдалося стиснути зображення'))
                return
              }
              const compressedFile = new File([blob], file.name, {
                type: 'image/jpeg',
                lastModified: Date.now(),
              })
              resolve(compressedFile)
            },
            'image/jpeg',
            quality
          )
        }
        img.onerror = () => reject(new Error('Помилка завантаження зображення'))
        img.src = e.target?.result as string
      }
      reader.onerror = () => reject(new Error('Помилка читання файлу'))
    })
  }

  const handleImageUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return

    const currentCount = formData.images.length
    const newCount = files.length

    if (currentCount + newCount > 10) {
      alert(`Максимум 10 зображень. Ви вже маєте ${currentCount}, намагаєтесь додати ${newCount}.`)
      return
    }

    setUploading(true)

    try {
      const uploadPromises = Array.from(files).map(async (file, index) => {
        try {
          // Стискаємо зображення перед завантаженням
          let fileToUpload = file
          if (file.size > 2 * 1024 * 1024) { // Якщо файл більше 2MB
            fileToUpload = await compressImage(file, 1920, 0.75)
            console.log(`Зображення ${index + 1} стиснуто: ${(file.size / 1024 / 1024).toFixed(2)}MB -> ${(fileToUpload.size / 1024 / 1024).toFixed(2)}MB`)
          }

          const uploadFormData = new FormData()
          uploadFormData.append('file', fileToUpload)

          const response = await fetch('/api/upload', {
            method: 'POST',
            body: uploadFormData,
          })

          if (!response.ok) {
            const errorData = await response.json().catch(() => ({}))
            console.error(`UPLOAD_DEBUG: Server responded with ${response.status}:`, errorData)
            throw new Error(errorData.details || errorData.error || `HTTP ${response.status}: Помилка завантаження зображення`)
          }

          const data = await response.json()
          if (!data.url) {
            throw new Error('Сервер не повернув URL зображення')
          }
          return data.url
        } catch (error) {
          console.error(`Помилка завантаження файлу ${index + 1}:`, error)
          throw error
        }
      })

      const urls = await Promise.all(uploadPromises)

      // Фільтруємо успішно завантажені URL
      const successfulUrls = urls.filter(url => url && url.length > 0) as string[]

      if (successfulUrls.length === 0) {
        alert('Не вдалося завантажити жодне зображення. Перевірте формат та розмір файлів.')
        return
      }

      if (successfulUrls.length < urls.length) {
        alert(`Успішно завантажено ${successfulUrls.length} з ${urls.length} зображень`)
      }

      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, ...successfulUrls].slice(0, 10)
      }))

    } catch (error) {
      console.error('Error uploading images:', error)
      const errorMessage = error instanceof Error ? error.message : 'Невідома помилка'
      alert(`Помилка при завантаженні зображення: ${errorMessage}`)
    } finally {
      setUploading(false)
    }
  }

  const removeImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }))
  }

  const handleEdit = (image: GalleryImage) => {
    setEditingImage(image)

    let imageUrls: string[] = []

    // Спробуємо отримати зображення з нового поля images або fallback на before/after
    if (image.images && image.images.length > 0) {
      imageUrls = [...image.images]
    } else {
      // Legacy support
      try {
        const before = image.beforeImageUrl ? JSON.parse(image.beforeImageUrl) : []
        const after = image.afterImageUrl ? JSON.parse(image.afterImageUrl) : []
        // Treat validation/parsing loosely
        const bUrls = Array.isArray(before) ? before : (image.beforeImageUrl ? [image.beforeImageUrl] : [])
        const aUrls = Array.isArray(after) ? after : (image.afterImageUrl ? [image.afterImageUrl] : [])
        imageUrls = [...bUrls, ...aUrls]
      } catch {
        // Fallback if parsing fails but strings exist
        if (image.beforeImageUrl) imageUrls.push(image.beforeImageUrl)
        if (image.afterImageUrl) imageUrls.push(image.afterImageUrl)
      }
    }

    setFormData({
      title: image.title || '',
      description: image.description || '',
      images: imageUrls,
      serviceId: image.serviceId || '',
    })
    setShowForm(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (formData.images.length === 0) {
      alert('Будь ласка, завантажте хоча б одне зображення')
      return
    }

    try {
      const url = editingImage
        ? `/api/admin/gallery/${editingImage.imageId}`
        : '/api/admin/gallery'
      const method = editingImage ? 'PUT' : 'POST'

      // We send 'images'. The backend handles mapping or clearing fields.
      const payload = {
        title: formData.title,
        description: formData.description,
        images: formData.images,
        serviceId: formData.serviceId || null,
        // Legacy fields could be sent as null or derived, but backend optionality handles it.
        // We can send first image as before/after if we wanted to maintain some compatibility, 
        // but let's rely on the new 'images' field primarily.
        beforeImageUrl: formData.images[0], // Fallback for clients not updated? No, schema is updated.
        afterImageUrl: formData.images[0]
      }

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        console.error('Error response:', errorData)
        throw new Error(errorData.error || `HTTP ${response.status}: Помилка збереження`)
      }

      const result = await response.json()
      console.log('Збережено:', result)

      fetchImages()
      setShowForm(false)
      setEditingImage(null)
      setFormData({
        title: '',
        description: '',
        images: [],
        serviceId: '',
      })
    } catch (error) {
      console.error('Error submitting form:', error)
      const errorMessage = error instanceof Error ? error.message : 'Невідома помилка'
      alert(`Помилка при збереженні: ${errorMessage}`)
    }
  }

  const handleDelete = async (imageId: string) => {
    if (!confirm('Ви впевнені, що хочете видалити цей запис?')) return

    try {
      const response = await fetch(`/api/admin/gallery/${imageId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        fetchImages()
      } else {
        alert('Помилка при видаленні')
      }
    } catch (error) {
      alert('Помилка при видаленні')
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
        <h1 className="text-4xl font-bold text-white">Керування портфоліо</h1>
        <button
          onClick={() => {
            setShowForm(!showForm)
            setEditingImage(null)
            setFormData({
              title: '',
              description: '',
              images: [],
              serviceId: '',
            })
          }}
          className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition-colors"
        >
          {showForm ? 'Скасувати' : '+ Додати роботу'}
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-gray-900">
            {editingImage ? 'Редагувати роботу' : 'Нова робота'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-900">Назва</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900"
                placeholder="Наприклад: Полірування BMW X5"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-900">Опис</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900"
                placeholder="Опис виконаних робіт..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-gray-900">
                Медіа (Фото або Відео) - до 10 файлів
              </label>

              {/* URL Input */}
              <div className="flex gap-2 mb-4">
                <input
                  type="text"
                  placeholder="Вставте посилання на фото або відео (mp4, mov)..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-900"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      const input = e.currentTarget
                      const url = input.value.trim()
                      if (!url) return

                      if (formData.images.length >= 10) {
                        alert('Максимум 10 файлів')
                        return
                      }

                      setFormData(prev => ({
                        ...prev,
                        images: [...prev.images, url]
                      }))
                      input.value = ''
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={(e) => {
                    const input = e.currentTarget.previousElementSibling as HTMLInputElement
                    const url = input.value.trim()
                    if (!url) return

                    if (formData.images.length >= 10) {
                      alert('Максимум 10 файлів')
                      return
                    }

                    setFormData(prev => ({
                      ...prev,
                      images: [...prev.images, url]
                    }))
                    input.value = ''
                  }}
                  className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Додати посилання
                </button>
              </div>

              {/* File Upload */}
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => handleImageUpload(e.target.files)}
                disabled={uploading || formData.images.length >= 10}
                className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 mb-2"
              />

              {formData.images.length >= 10 && (
                <p className="mt-2 text-sm text-yellow-600">Досягнуто максимум 10 файлів</p>
              )}
              {uploading && (
                <p className="mt-2 text-sm text-gray-600">Завантаження...</p>
              )}

              {formData.images.length > 0 && (
                <div className="mt-4 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {formData.images.map((url, index) => {
                    const isVideo = /\.(mp4|mov|webm|ogg)$/i.test(url)
                    return (
                      <div key={index} className="relative group bg-gray-100 rounded-lg overflow-hidden h-24">
                        {isVideo ? (
                          <video
                            src={url}
                            className="w-full h-full object-cover"
                            muted
                          />
                        ) : (
                          <img
                            src={url}
                            alt={`Preview ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        )}
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs opacity-80 hover:opacity-100 transition-opacity z-10"
                        >
                          ×
                        </button>
                        <div className="absolute bottom-1 right-1 bg-black bg-opacity-50 text-white text-xs px-1 rounded">
                          {index + 1}
                        </div>
                        {isVideo && (
                          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <div className="bg-black bg-opacity-50 rounded-full p-1">
                              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20"><path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" /></svg>
                            </div>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              )}
            </div>

            <div className="flex justify-end pt-4">
              <button
                type="submit"
                disabled={uploading}
                className="bg-primary-600 text-white px-8 py-2 rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50"
              >
                {editingImage ? 'Оновити' : 'Зберегти'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {images.map((image) => {
          // Determine images to show
          let displayImages: string[] = []
          if (image.images && image.images.length > 0) {
            displayImages = image.images
          } else {
            // Fallback
            try {
              const b = image.beforeImageUrl ? JSON.parse(image.beforeImageUrl) : []
              const a = image.afterImageUrl ? JSON.parse(image.afterImageUrl) : []
              displayImages = [...(Array.isArray(b) ? b : [image.beforeImageUrl]), ...(Array.isArray(a) ? a : [image.afterImageUrl])].filter(Boolean)
            } catch {
              if (image.beforeImageUrl) displayImages.push(image.beforeImageUrl)
            }
          }

          return (
            <div key={image.imageId} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="relative h-48 bg-gray-100">
                {displayImages.length > 0 ? (
                  <img
                    src={displayImages[0]}
                    alt={image.title || 'Work'}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-400">
                    Немає фото
                  </div>
                )}
                <div className="absolute top-2 right-2 bg-black bg-opacity-60 text-white px-2 py-1 rounded text-xs">
                  {displayImages.length} фото
                </div>
              </div>

              <div className="p-4">
                <h3 className="font-semibold mb-1 text-gray-900 truncate">
                  {image.title || 'Без назви'}
                </h3>
                <p className="text-sm text-gray-600 line-clamp-2 mb-4 h-10">
                  {image.description || 'Опис відсутній'}
                </p>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(image)}
                    className="flex-1 bg-blue-600 text-white px-3 py-2 rounded hover:bg-blue-700 transition-colors text-sm"
                  >
                    Редагувати
                  </button>
                  <button
                    onClick={() => handleDelete(image.imageId)}
                    className="flex-1 bg-red-600 text-white px-3 py-2 rounded hover:bg-red-700 transition-colors text-sm"
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
