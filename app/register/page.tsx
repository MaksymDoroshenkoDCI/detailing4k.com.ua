'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function RegisterPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    if (formData.password !== formData.confirmPassword) {
      setError('Паролі не співпадають')
      setLoading(false)
      return
    }

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        router.push('/account')
      } else {
        setError(data.error || 'Помилка реєстрації')
      }
    } catch (error) {
      setError('Помилка при реєстрації')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto max-w-md px-4 py-16">
      <div className="bg-white rounded-lg shadow-md p-8">
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-900">Реєстрація</h1>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-900">Ім&apos;я *</label>
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
            <label className="block text-sm font-medium mb-2 text-gray-900">Пароль *</label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900"
              required
              minLength={6}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-900">Підтвердити пароль *</label>
            <input
              type="password"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary-600 text-white py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors disabled:bg-gray-400"
          >
            {loading ? 'Реєстрація...' : 'Зареєструватися'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Вже є акаунт?{' '}
            <Link href="/login" className="text-primary-600 hover:text-primary-700">
              Увійти
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}



