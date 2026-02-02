import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Відгуки клієнтів | Detailing 4K',
    description: 'Що кажуть наші клієнти про якість послуг Detailing 4K. Відгуки про полірування, хімчистку та захисні покриття.',
    alternates: {
        canonical: '/testimonials',
    },
    openGraph: {
        title: 'Відгуки про Detailing 4K — Студія детейлінгу в Києві',
        description: 'Реальні відгуки наших клієнтів та результати нашої роботи.',
        images: ['/opengraph-image'],
    }
}

export default function TestimonialsLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return <>{children}</>
}
