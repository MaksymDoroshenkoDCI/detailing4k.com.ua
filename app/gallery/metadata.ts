import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Галерея робіт',
    description: 'Фото та відео наших робіт з детейлінгу автомобілів у Києві. Результати до і після: полірування, керамічне покриття, хімчистка салону. Переконайтеся в якості Detailing 4K',
    keywords: [
        'галерея детейлінг',
        'фото робіт детейлінг',
        'до і після детейлінг',
        'результати полірування',
        'detailing 4k роботи'
    ],
    openGraph: {
        title: 'Галерея робіт - Detailing 4K Київ',
        description: 'Переглянь наші роботи: фото та відео результатів детейлінгу',
        url: 'https://detailing4k.com.ua/gallery',
        images: [
            {
                url: '/logo.png',
                width: 1200,
                height: 630,
                alt: 'Галерея робіт Detailing 4K',
            },
        ],
    },
}
