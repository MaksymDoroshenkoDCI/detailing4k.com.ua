import { MetadataRoute } from 'next'
import { prisma } from '@/lib/prisma'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = 'https://detailing4k.com.ua'

    // Отримати всі послуги з БД
    const services = await prisma.service.findMany({
        select: {
            serviceId: true,
            updatedAt: true,
        }
    })

    // Отримати всі статті з БД
    const posts = await prisma.post.findMany({
        where: { published: true },
        select: {
            slug: true,
            updatedAt: true,
        }
    })

    return [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 1,
        },
        {
            url: `${baseUrl}/services`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.9,
        },
        {
            url: `${baseUrl}/gallery`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.8,
        },
        {
            url: `${baseUrl}/autodohlyad`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.8,
        },
        {
            url: `${baseUrl}/booking`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.9,
        },
        {
            url: `${baseUrl}/contact`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.7,
        },
        // Додати всі послуги
        ...services.map((service) => ({
            url: `${baseUrl}/services/${service.serviceId}`,
            lastModified: new Date(service.updatedAt),
            changeFrequency: 'weekly' as const,
            priority: 0.8,
        })),
        // Додати всі статті
        ...posts.map((post) => ({
            url: `${baseUrl}/autodohlyad/${post.slug}`,
            lastModified: new Date(post.updatedAt),
            changeFrequency: 'monthly' as const,
            priority: 0.7,
        })),
    ]
}
