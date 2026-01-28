import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Галерея робіт | Detailing 4K',
    description: 'Приклади наших робіт: полірування, кераміка, хімчистка салону. Фото та відео результатів детейлінгу автомобілів у Києві.',
    openGraph: {
        title: 'Галерея Detailing 4K — Результати нашої роботи',
        description: 'Дивіться фото до та після детейлінгу автомобілів у нашій студії.',
        images: ['/opengraph-image'],
    }
}

export default function GalleryLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return <>{children}</>
}
