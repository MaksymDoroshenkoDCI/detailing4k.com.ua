'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'

export default function Navbar() {
  const pathname = usePathname()
  const [user, setUser] = useState<any>(null)
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => res.json())
      .then((data) => {
        if (data.user) {
          setUser(data.user)
        }
      })
  }, [])

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    setUser(null)
    window.location.href = '/'
  }

  const navLinks = [
    { href: '/', label: 'Головна' },
    { href: '/services', label: 'Послуги' },
    { href: '/gallery', label: 'Галерея' },
    { href: '/testimonials', label: 'Відгуки' },
    { href: '/contact', label: 'Контакти' },
  ]

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto max-w-6xl px-4">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="text-2xl font-bold text-primary-700">
            Detailing 4K
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`hover:text-primary-600 transition-colors ${
                  pathname === link.href ? 'text-primary-600 font-semibold' : 'text-gray-700'
                }`}
              >
                {link.label}
              </Link>
            ))}
            {user ? (
              <>
                {user.role ? (
                  <Link
                    href="/admin"
                    className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
                  >
                    Адмін панель
                  </Link>
                ) : (
                  <Link
                    href="/account"
                    className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
                  >
                    Мій кабінет
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="text-gray-700 hover:text-primary-600 transition-colors"
                >
                  Вийти
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-gray-700 hover:text-primary-600 transition-colors"
                >
                  Увійти
                </Link>
                <Link
                  href="/register"
                  className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
                >
                  Реєстрація
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-gray-700"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`block py-2 ${
                  pathname === link.href ? 'text-primary-600 font-semibold' : 'text-gray-700'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-4 border-t mt-4">
              {user ? (
                <>
                  {user.role ? (
                    <Link
                      href="/admin"
                      className="block bg-primary-600 text-white px-4 py-2 rounded-lg mb-2 text-center"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Адмін панель
                    </Link>
                  ) : (
                    <Link
                      href="/account"
                      className="block bg-primary-600 text-white px-4 py-2 rounded-lg mb-2 text-center"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Мій кабінет
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      handleLogout()
                      setIsMenuOpen(false)
                    }}
                    className="block w-full text-left text-gray-700 py-2"
                  >
                    Вийти
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="block text-gray-700 py-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Увійти
                  </Link>
                  <Link
                    href="/register"
                    className="block bg-primary-600 text-white px-4 py-2 rounded-lg mt-2 text-center"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Реєстрація
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}



