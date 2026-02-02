import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Наші послуги | Detailing 4K',
    description: 'Повний спектр послуг детейлінгу: полірування, керамічне покриття, хімчистка, захист плівкою. Ознайомтесь з цінами та запишіться онлайн.',
    alternates: {
        canonical: '/services',
    },
    openGraph: {
        title: 'Послуги детейлінгу в Києві — Detailing 4K',
        description: 'Професійне полірування, хімчистка та захисні покриття для вашого авто.',
        images: ['/opengraph-image'],
    }
}

export default function ServicesLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return <>{children}</>
}
