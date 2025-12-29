'use client'

import { useEffect, useState } from 'react'
import { GalleryImage } from '@/types'

export default function GalleryPage() {
  const [images, setImages] = useState<GalleryImage[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null)

  useEffect(() => {
    fetch('/api/gallery')
      .then((res) => res.json())
      .then((data) => {
        // Ensure data is an array
        if (Array.isArray(data)) {
          setImages(data)
        } else {
          console.error('Invalid data format:', data)
          setImages([])
        }
        setLoading(false)
      })
      .catch((error) => {
        console.error('Error fetching gallery images:', error)
        setImages([])
        setLoading(false)
      })
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
      <h1 className="text-4xl font-bold mb-4 text-center">Галерея робіт</h1>
      <p className="text-center text-gray-600 mb-12">
        До та після - результати нашої роботи
      </p>

      {!Array.isArray(images) || images.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">Галерея порожня</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {images.map((image) => {
            // Парсимо JSON якщо це масив, інакше використовуємо як єдиний рядок
            let afterUrls: string[] = []
            
            try {
              afterUrls = JSON.parse(image.afterImageUrl)
              if (!Array.isArray(afterUrls)) afterUrls = [image.afterImageUrl]
            } catch {
              afterUrls = [image.afterImageUrl]
            }

            return (
            <div
              key={image.imageId}
              className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => setSelectedImage(image)}
            >
              <div className="relative h-64">
                <div className="grid grid-cols-2 gap-1 h-full">
                  {afterUrls.slice(0, 4).map((url, idx) => (
                    <img
                      key={idx}
                      src={url}
                      alt={`${image.title || 'After'} ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  ))}
                </div>
                <div className="absolute top-2 left-2 bg-primary-600 text-white px-2 py-1 rounded text-sm">
                  Після
                </div>
              </div>
              <div className="p-4">
                {image.title && (
                  <h3 className="font-semibold mb-1 text-gray-900">{image.title}</h3>
                )}
                {image.service && (
                  <p className="text-sm text-primary-600 mb-2">
                    {image.service.name}
                  </p>
                )}
                {image.description && (
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {image.description}
                  </p>
                )}
              </div>
            </div>
            )
          })}
        </div>
      )}

      {/* Lightbox Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="max-w-6xl w-full">
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 text-white text-2xl hover:text-gray-300"
            >
              ✕
            </button>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-white mb-2 text-center">До</h3>
                <div className="grid grid-cols-2 gap-2">
                  {(() => {
                    let beforeUrls: string[] = []
                    try {
                      beforeUrls = JSON.parse(selectedImage.beforeImageUrl)
                      if (!Array.isArray(beforeUrls)) beforeUrls = [selectedImage.beforeImageUrl]
                    } catch {
                      beforeUrls = [selectedImage.beforeImageUrl]
                    }
                    return beforeUrls.map((url, idx) => (
                      <img
                        key={idx}
                        src={url}
                        alt={`Before ${idx + 1}`}
                        className="w-full h-auto rounded"
                      />
                    ))
                  })()}
                </div>
              </div>
              <div>
                <h3 className="text-white mb-2 text-center">Після</h3>
                <div className="grid grid-cols-2 gap-2">
                  {(() => {
                    let afterUrls: string[] = []
                    try {
                      afterUrls = JSON.parse(selectedImage.afterImageUrl)
                      if (!Array.isArray(afterUrls)) afterUrls = [selectedImage.afterImageUrl]
                    } catch {
                      afterUrls = [selectedImage.afterImageUrl]
                    }
                    return afterUrls.map((url, idx) => (
                      <img
                        key={idx}
                        src={url}
                        alt={`After ${idx + 1}`}
                        className="w-full h-auto rounded"
                      />
                    ))
                  })()}
                </div>
              </div>
            </div>
            {selectedImage.title && (
              <h2 className="text-white text-xl font-semibold mt-4 text-center">
                {selectedImage.title}
              </h2>
            )}
            {selectedImage.description && (
              <p className="text-white text-center mt-2">
                {selectedImage.description}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}



