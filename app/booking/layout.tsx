import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Записатися онлайн | Detailing 4K',
    description: 'Зручний онлайн запис на послуги детейлінгу в Києві. Оберіть послугу, дату та час і забронюйте візит за кілька хвилин.',
    alternates: {
        canonical: '/booking',
    },
    openGraph: {
        title: 'Онлайн бронювання детейлінгу — Detailing 4K',
        description: 'Записуйтесь на полірування, хімчистку або кераміку онлайн.',
        images: ['/opengraph-image'],
    }
}

export default function BookingLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return <>{children}</>
}
