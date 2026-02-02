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

    const staticDate = new Date('2026-02-02')

    return [
        {
            url: baseUrl,
            lastModified: staticDate,
            changeFrequency: 'daily',
            priority: 1.0,
        },
        {
            url: `${baseUrl}/services`,
            lastModified: staticDate,
            changeFrequency: 'weekly',
            priority: 0.9,
        },
        {
            url: `${baseUrl}/gallery`,
            lastModified: staticDate,
            changeFrequency: 'weekly',
            priority: 0.8,
        },
        {
            url: `${baseUrl}/autodohlyad`,
            lastModified: staticDate,
            changeFrequency: 'weekly',
            priority: 0.8,
        },
        {
            url: `${baseUrl}/booking`,
            lastModified: staticDate,
            changeFrequency: 'monthly',
            priority: 0.8,
        },
        {
            url: `${baseUrl}/contact`,
            lastModified: staticDate,
            changeFrequency: 'monthly',
            priority: 0.7,
        },
        {
            url: `${baseUrl}/testimonials`,
            lastModified: staticDate,
            changeFrequency: 'weekly',
            priority: 0.6,
        },
        // Додати всі послуги
        ...services.map((service) => ({
            url: `${baseUrl}/services/${service.serviceId}`,
            lastModified: new Date(service.updatedAt),
            changeFrequency: 'monthly' as const,
            priority: 0.7,
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
