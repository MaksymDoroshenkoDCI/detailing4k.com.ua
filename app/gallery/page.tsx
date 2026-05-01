'use client'

import { useEffect, useState } from 'react'
import { GalleryImage } from '@/types'

export default function GalleryPage() {
  const [images, setImages] = useState<GalleryImage[]>([])
  const [loading, setLoading] = useState(true)
  const [currentSlide, setCurrentSlide] = useState(0)

  useEffect(() => {
    fetch('/api/gallery')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setImages(data)
        } else {
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

  // Auto-scroll carousel
  useEffect(() => {
    if (images.length === 0) return
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % Math.min(images.length, 5))
    }, 5000)
    return () => clearInterval(timer)
  }, [images.length])

  if (loading) {
    return (
      <div className="container mx-auto max-w-6xl px-4 py-16 text-center">
        <p>Завантаження...</p>
      </div>
    )
  }

  // Get images for carousel (limited to first 5 or logic based on 'featured')
  const carouselImages = images.slice(0, 5)

  // Helper to check for video
  const isVideo = (url: string) => /\.(mp4|mov|webm|ogg)$/i.test(url)

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Hero Carousel Section */}
      {carouselImages.length > 0 && (
        <div className="relative h-[60vh] w-full overflow-hidden bg-black">
          {carouselImages.map((image, index) => {
            // Get first valid media for hero background
            let heroMedia = ''
            if (image.images && image.images.length > 0) heroMedia = image.images[0]
            else if (image.afterImageUrl) heroMedia = image.afterImageUrl // Legacy fallback
            else if (image.beforeImageUrl) heroMedia = image.beforeImageUrl

            const mediaIsVideo = isVideo(heroMedia)

            return (
              <div
                key={image.imageId}
                className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentSlide ? 'opacity-100' : 'opacity-0'
                  }`}
              >
                {heroMedia && (
                  <>
                    {mediaIsVideo ? (
                      <video
                        src={heroMedia}
                        className="w-full h-full object-cover opacity-60"
                        autoPlay
                        muted
                        loop
                        playsInline
                      />
                    ) : (
                      <img
                        src={heroMedia}
                        alt={image.title || 'Work'}
                        className="w-full h-full object-cover opacity-60"
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent" />
                  </>
                )}

                <div className="absolute bottom-0 left-0 right-0 p-8 md:p-16 text-white max-w-6xl mx-auto">
                  <h2 className="text-4xl md:text-5xl font-bold mb-4 drop-shadow-md">
                    {image.title || 'Наші роботи'}
                  </h2>
                  {image.description && (
                    <p className="text-lg md:text-xl opacity-90 max-w-2xl drop-shadow-sm whitespace-pre-line">
                      {image.description}
                    </p>
                  )}
                </div>
              </div>
            )
          })}

          {/* Carousel Controls */}
          <div className="absolute bottom-8 right-8 flex gap-2">
            {carouselImages.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className={`w-3 h-3 rounded-full transition-all ${idx === currentSlide ? 'bg-primary-500 w-8' : 'bg-white/50 hover:bg-white'
                  }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="container mx-auto max-w-6xl px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold mb-4 text-gray-900">Наші роботи</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Ознайомтесь з прикладами наших робіт. Ми пишаємося кожним проектом та приділяємо увагу найменшим деталям.
          </p>
        </div>

        {!Array.isArray(images) || images.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Галерея порожня</p>
          </div>
        ) : (
          <div className="space-y-24">
            {images.map((image, index) => {
              // Get all images for this work item
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

              // Apply alternating layout
              const isEven = index % 2 === 0

              return (
                <div key={image.imageId} className={`flex flex-col ${isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-8 lg:gap-16 items-start`}>

                  {/* Text Content */}
                  <div className="lg:w-1/3 pt-4">
                    <h2 className="text-2xl font-bold mb-4 text-gray-900 border-l-4 border-primary-500 pl-4">
                      {image.title || 'Проект Detailing'}
                    </h2>
                    {image.service && (
                      <div className="mb-4 inline-block bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm font-medium">
                        {image.service.name}
                      </div>
                    )}
                    {image.description && (
                      <p className="text-gray-600 leading-relaxed mb-6 whitespace-pre-line">
                        {image.description}
                      </p>
                    )}
                    <button
                      className="text-primary-600 font-semibold hover:text-primary-700 inline-flex items-center gap-2 group"
                      onClick={() => {/* Maybe open lightbox or details */ }}
                    >
                      Дивитись деталі
                      <span className="group-hover:translate-x-1 transition-transform">→</span>
                    </button>
                  </div>

                  <div className="lg:w-2/3 w-full">
                    {displayImages.length === 0 ? (
                      <div className="bg-gray-200 rounded-xl h-64 flex items-center justify-center text-gray-400">
                        Немає фото
                      </div>
                    ) : (
                      // Responsive grid: 2 cols on mobile, 4 on tablet, 6 on desktop
                      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 auto-rows-[200px]">
                        {displayImages.slice(0, 5).map((mediaUrl, idx) => {
                          const isVid = isVideo(mediaUrl)

                          // Default spans (mobile friendly)
                          let colSpan = 'col-span-1'
                          let rowSpan = 'row-span-1'
                          let mdColSpan = 'md:col-span-2'
                          let lgColSpan = 'lg:col-span-2'

                          // Logic for different image counts
                          if (displayImages.length === 1) {
                            colSpan = 'col-span-2'
                            mdColSpan = 'md:col-span-4'
                            lgColSpan = 'lg:col-span-6'
                            rowSpan = 'row-span-2'
                          } else if (displayImages.length === 2) {
                            // Two large images side-by-side on desktop, stacked on mobile if wanted, or side-by-side
                            colSpan = 'col-span-1'
                            mdColSpan = 'md:col-span-2'
                            lgColSpan = 'lg:col-span-3'
                            rowSpan = 'row-span-2'
                          } else if (displayImages.length >= 3) {
                            if (idx === 0) {
                              // First image is main feature
                              colSpan = 'col-span-2'
                              mdColSpan = 'md:col-span-2'
                              lgColSpan = 'lg:col-span-4'
                              rowSpan = 'row-span-2'
                            } else {
                              // Others are smaller
                              colSpan = 'col-span-1'
                              mdColSpan = 'md:col-span-1'
                              lgColSpan = 'lg:col-span-2'
                              rowSpan = 'row-span-1'
                            }
                          }

                          return (
                            <div
                              key={idx}
                              className={`${colSpan} ${mdColSpan} ${lgColSpan} ${rowSpan} relative group overflow-hidden rounded-xl bg-gray-100 shadow-sm`}
                            >
                              {isVid ? (
                                <video src={mediaUrl} className="w-full h-full object-cover" muted autoPlay loop playsInline />
                              ) : (
                                <img src={mediaUrl} alt="" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                              )}

                              {/* Show count overlay on the last item if there are more */}
                              {idx === 4 && displayImages.length > 5 && (
                                <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center text-white text-2xl font-bold cursor-pointer hover:bg-opacity-50 transition-all backdrop-blur-sm">
                                  +{displayImages.length - 5}
                                </div>
                              )}
                            </div>
                          )
                        })}
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
