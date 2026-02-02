import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Контакти | Detailing 4K',
    description: 'Ми знаходимось у Києві на вулиці Брожка 38/58. Зв\'яжіться з нами по телефону або через месенджери для консультації.',
    alternates: {
        canonical: '/contact',
    },
    openGraph: {
        title: 'Контакти Detailing 4K — Детейлінг у Києві',
        description: 'Адреса, телефон та графік роботи студії детейлінгу Detailing 4K.',
        images: ['/opengraph-image'],
    }
}

export default function ContactLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return <>{children}</>
}
