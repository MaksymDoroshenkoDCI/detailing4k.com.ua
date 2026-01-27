import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Онлайн запис',
    description: 'Запишіться на детейлінг автомобіля онлайн 24/7. Оберіть послугу, дату та час. Detailing 4K - професійний догляд за вашим авто у Києві',
    keywords: [
        'запис на детейлінг',
        'онлайн бронювання детейлінг',
        'запис детейлінг київ',
        'бронювання детейлінг'
    ],
    openGraph: {
        title: 'Онлайн запис - Detailing 4K Київ',
        description: 'Запишіться на детейлінг онлайн - оберіть послугу та зручний час',
        url: 'https://detailing4k.com.ua/booking',
        images: [
            {
                url: '/logo.png',
                width: 1200,
                height: 630,
                alt: 'Онлайн запис Detailing 4K',
            },
        ],
    },
}
