import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import ConsultantWidget from '@/components/ConsultantWidget'
import StructuredData from '@/components/StructuredData'

const inter = Inter({ subsets: ['latin', 'cyrillic'] })

export const metadata: Metadata = {
  metadataBase: new URL('https://detailing4k.com.ua'),
  title: {
    default: 'Detailing 4K - Професійний авто детейлінг у Києві',
    template: '%s | Detailing 4K'
  },
  description: 'Професійний авто детейлінг у Києві: полірування кузова, керамічне покриття, хімчистка салону, детейлінг фар. Відновлюємо ваш автомобіль до ідеального стану ⭐ Запис онлайн 24/7',
  keywords: [
    'детейлінг київ',
    'авто детейлінг',
    'полірування авто київ',
    'керамічне покриття київ',
    'хімчистка салону київ',
    'детейлінг фар',
    'detailing 4k',
    'полірування кузова',
    'захист кузова',
    'детейлінг студія київ'
  ],
  authors: [{ name: 'Detailing 4K' }],
  creator: 'Detailing 4K',
  publisher: 'Detailing 4K',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: '/favicon.png',
    apple: '/favicon.png',
  },
  openGraph: {
    type: 'website',
    locale: 'uk_UA',
    url: 'https://detailing4k.com.ua',
    siteName: 'Detailing 4K',
    title: 'Detailing 4K - Професійний авто детейлінг у Києві',
    description: 'Професійний авто детейлінг: полірування, керамічне покриття, хімчистка салону. Відновлюємо ваш автомобіль до ідеального стану ⭐',
    images: [
      {
        url: '/logo.png',
        width: 1200,
        height: 630,
        alt: 'Detailing 4K - Професійний авто детейлінг',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Detailing 4K - Професійний авто детейлінг у Києві',
    description: 'Професійний авто детейлінг: полірування, керамічне покриття, хімчистка салону',
    images: ['/logo.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    // Додайте ваш код верифікації з Google Search Console
    // google: 'your-verification-code',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="uk">
      <head>
        <StructuredData />
      </head>
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
