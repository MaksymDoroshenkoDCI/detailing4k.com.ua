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
    default: 'Detailing 4K — Професійний детейлінг',
    template: '%s | Detailing 4K'
  },
  description: 'Преміальний детейлінг, полірування, кераміка, захист кузова та салону.',
  keywords: [
    'детейлінг київ',
    'детейлінг авто київ',
    'студія детейлінгу київ',
    'полірування авто київ',
    'хімчистка салону авто',
    'керамічне покриття авто',
    'антигравійна плівка київ',
    'detailing 4k',
    'захист кузова київ'
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
    title: 'Detailing 4K — Професійний детейлінг',
    description: 'Преміальний детейлінг, полірування, кераміка, захист кузова та салону.',
    url: 'https://detailing4k.com.ua',
    siteName: 'Detailing 4K',
    images: [
      {
        url: '/opengraph-image',
        width: 1200,
        height: 630,
        alt: 'Detailing 4K — Детейлінг у Києві'
      }
    ],
    locale: 'uk_UA',
    type: 'website'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Detailing 4K',
    description: 'Преміальний детейлінг у Києві',
    images: ['/opengraph-image']
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
