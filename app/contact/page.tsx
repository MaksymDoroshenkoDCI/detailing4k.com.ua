'use client'

import { useState } from 'react'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  })
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      const response = await fetch('/api/consultations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        setSubmitted(true)
        setFormData({ name: '', email: '', phone: '', message: '' })
      } else {
        alert('Помилка при відправці запиту')
      }
    } catch (error) {
      alert('Помилка при відправці запиту')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="container mx-auto max-w-4xl px-4 py-16">
      <h1 className="text-4xl font-bold mb-4 text-center text-white">Контакти</h1>
      <p className="text-center text-gray-300 mb-12">
        Зв'яжіться з нами для консультації або запитання
      </p>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Contact Form */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold mb-6 text-gray-900">Надіслати запит</h2>

          {submitted ? (
            <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
              <div className="text-4xl mb-4">✅</div>
              <h3 className="text-lg font-semibold text-green-800 mb-2">
                Запит успішно відправлено!
              </h3>
              <p className="text-gray-600">
                Ми зв'яжемося з вами найближчим часом.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="mt-4 text-primary-700 hover:text-primary-600 font-semibold underline"
              >
                Відправити ще один запит
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-900">Ім'я *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-900">Email *</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-900">Телефон</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-900">Повідомлення *</label>
                <textarea
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  rows={5}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900"
                  required
                  minLength={10}
                />
              </div>
              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-primary-500 text-black py-3 rounded-lg font-bold hover:bg-primary-400 transition-colors disabled:bg-gray-400 uppercase tracking-wide"
              >
                {submitting ? 'Відправка...' : 'Відправити запит'}
              </button>
            </form>
          )}
        </div>

        {/* Contact Information */}
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold mb-4 text-gray-900">Контактна інформація</h3>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-1 text-gray-900">Адреса</h4>
                <p className="text-gray-600">Брожка 38/58, Київ, Україна</p>
              </div>
              <div>
                <h4 className="font-medium mb-1 text-gray-900">Телефон</h4>
                <div className="flex flex-col gap-1">
                  <a
                    href="tel:+380989946178"
                    className="text-primary-700 hover:text-primary-600 font-semibold"
                  >
                    098 994 6178
                  </a>
                  <a
                    href="tel:+380681670042"
                    className="text-primary-700 hover:text-primary-600 font-semibold"
                  >
                    068 167 0042
                  </a>
                </div>
              </div>
              <div>
                <h4 className="font-medium mb-1 text-gray-900">Email</h4>
                <a
                  href="mailto:office@detailing4k.com"
                  className="text-primary-700 hover:text-primary-600 font-semibold"
                >
                  office@detailing4k.com
                </a>
              </div>
              <div>
                <h4 className="font-medium mb-2 text-gray-900">Швидкий зв'язок</h4>
                <div className="flex gap-4">
                  <a
                    href="https://wa.me/380XXXXXXXXX"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-green-600 hover:text-green-700"
                  >
                    WhatsApp
                  </a>
                  <a
                    href="https://t.me/detaling4k"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#0088cc] hover:text-[#0077b5]"
                  >
                    Telegram
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold mb-4 text-gray-900">Графік роботи</h3>
            <div className="space-y-2 text-gray-600">
              <p>Понеділок - П'ятниця: 9:00 - 18:00</p>
              <p>Субота: 10:00 - 16:00</p>
              <p>Неділя: Вихідний</p>
            </div>
          </div>

          {/* Google Maps */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold mb-4 text-gray-900">Як нас знайти</h3>
            <div className="h-64 bg-gray-200 rounded-lg overflow-hidden relative">
              <iframe
                width="100%"
                height="100%"
                frameBorder="0"
                scrolling="no"
                marginHeight={0}
                marginWidth={0}
                src="https://maps.google.com/maps?q=Брожка+38/58,+Київ&t=&z=15&ie=UTF8&iwloc=&output=embed"
                title="Detailing 4K Location"
                className="absolute inset-0"
              ></iframe>
            </div>
            <div className="mt-4 text-center">
              <a
                href="https://maps.app.goo.gl/zHhKLhSyewB5mqnF9"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-primary-500 text-black px-6 py-2 rounded-lg font-semibold hover:bg-primary-400 transition-colors"
              >
                Відкрити в Google Maps
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}



