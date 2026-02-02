import Link from 'next/link'
import Image from 'next/image'
import { prisma } from '@/lib/prisma'
import { Metadata } from 'next'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
    title: 'Автодогляд — Корисні поради | Detailing 4K',
    description: 'Блог про правильний догляд за автомобілем. Поради щодо полірування, хімчистки та захисту кузова від професіоналів Detailing 4K.',
    alternates: {
        canonical: '/autodohlyad',
    },
    openGraph: {
        title: 'Поради по догляду за авто від Detailing 4K',
        description: 'Дізнайтесь, як зберегти ідеальний вигляд вашого автомобіля.',
        images: ['/opengraph-image'],
    }
}

export default async function AutodohlyadPage() {
    const posts = await prisma.post.findMany({
        where: { published: true },
        orderBy: { createdAt: 'desc' },
    })

    return (
        <div className="bg-white min-h-screen">
            <div className="container mx-auto max-w-6xl px-4 py-16">
                <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900 text-center">Автодогляд</h1>
                <p className="text-xl text-gray-600 text-center mb-16">
                    Корисні поради та статті про те, як зберегти ваш автомобіль в ідеальному стані
                </p>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {posts.map((post) => (
                        <Link
                            key={post.id}
                            href={`/autodohlyad/${post.slug}`}
                            className="group bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 hover:shadow-xl transition-all h-full flex flex-col"
                        >
                            <div className="h-56 bg-gray-800 relative overflow-hidden">
                                {post.imageUrl ? (
                                    <img
                                        src={post.imageUrl}
                                        alt={post.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-6xl opacity-50">✨</div>
                                )}
                            </div>
                            <div className="p-6 flex flex-col flex-grow">
                                <h2 className="text-xl font-bold mb-3 text-gray-900 group-hover:text-primary-600 transition-colors line-clamp-2">
                                    {post.title}
                                </h2>
                                <p className="text-gray-600 mb-4 line-clamp-3 text-sm flex-grow">
                                    {post.excerpt || (post.content.length > 150 ? post.content.substring(0, 150) + '...' : post.content)}
                                </p>
                                <div className="mt-auto flex items-center text-primary-600 font-semibold text-sm">
                                    Читати далі <span className="ml-2">→</span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

                {posts.length === 0 && (
                    <div className="text-center py-20 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                        <p className="text-gray-500 text-lg">Зараз тут немає опублікованих порад. Поверніться згодом!</p>
                    </div>
                )}
            </div>
        </div>
    )
}
