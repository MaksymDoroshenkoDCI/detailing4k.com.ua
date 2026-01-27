import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'

export const dynamic = 'force-dynamic'

export default async function PostDetailPage({
    params,
}: {
    params: { slug: string }
}) {
    const post = await prisma.post.findUnique({
        where: { slug: params.slug },
    })

    if (!post || !post.published) {
        notFound()
    }

    return (
        <div className="bg-white min-h-screen">
            <article className="container mx-auto max-w-4xl px-4 py-16">
                <Link
                    href="/autodohlyad"
                    className="text-primary-600 font-semibold mb-8 inline-flex items-center hover:translate-x-[-4px] transition-transform"
                >
                    <span className="mr-2">←</span> Назад до порад
                </Link>

                {post.imageUrl && (
                    <div className="relative w-full h-[300px] md:h-[500px] mb-12 rounded-2xl overflow-hidden shadow-lg">
                        <img
                            src={post.imageUrl}
                            alt={post.title}
                            className="w-full h-full object-cover"
                        />
                    </div>
                )}

                <header className="mb-12">
                    <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                        {post.title}
                    </h1>
                    {post.excerpt && (
                        <p className="text-xl text-gray-600 leading-relaxed italic border-l-4 border-primary-500 pl-6">
                            {post.excerpt}
                        </p>
                    )}
                </header>

                <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed space-y-6">
                    <div
                        className="article-content"
                        dangerouslySetInnerHTML={{ __html: post.content }}
                    />
                </div>

                <div className="mt-20 p-8 bg-gray-50 rounded-2xl border border-gray-100 flex flex-col md:flex-row items-center justify-between gap-8">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Сподобалася стаття?</h2>
                        <p className="text-gray-600">Запишіться до нас на професійний догляд вже сьогодні!</p>
                    </div>
                    <Link
                        href="/booking"
                        className="bg-primary-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-primary-700 transition-colors shadow-md"
                    >
                        Записатися онлайн
                    </Link>
                </div>
            </article>


        </div>
    )
}
