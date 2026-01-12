import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import ConsultantWidget from '@/components/ConsultantWidget'

const inter = Inter({ subsets: ['latin', 'cyrillic'] })

export const metadata: Metadata = {
  title: 'Detailing 4K - Авто детейлінг студія в Києві',
  description: 'Професійний авто детейлінг: полірування, керамічне покриття, глибоке чищення та комплексний догляд за автомобілем',
  icons: {
    icon: '/favicon.png',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="uk">
      <body className={inter.className}>
        <Navbar />
        <main className="min-h-screen">
          {children}
        </main>
        <Footer />
        <ConsultantWidget />
      </body>
    </html>
  )
}
