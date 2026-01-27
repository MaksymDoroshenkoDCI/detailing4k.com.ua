import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/middleware'
import { z } from 'zod'

export const dynamic = 'force-dynamic'

const postSchema = z.object({
    title: z.string().min(1, 'Title is required'),
    slug: z.string().min(1, 'Slug is required'),
    content: z.string().min(1, 'Content is required'),
    excerpt: z.string().optional().nullable(),
    imageUrl: z.string().optional().nullable(),
    published: z.boolean().default(false),
})

export async function GET(request: NextRequest) {
    try {
        const { error } = await requireAdmin(request)
        if (error) return error

        const posts = await prisma.post.findMany({
            orderBy: { createdAt: 'desc' },
        })

        return NextResponse.json(posts)
    } catch (error) {
        console.error('[POSTS_GET]', error)
        return NextResponse.json({ error: 'Internal error' }, { status: 500 })
    }
}

export async function POST(request: NextRequest) {
    try {
        const { error } = await requireAdmin(request)
        if (error) return error

        const body = await request.json()
        const validatedData = postSchema.parse(body)

        // Check if slug is unique
        const existingPost = await prisma.post.findUnique({
            where: { slug: validatedData.slug }
        })

        if (existingPost) {
            return NextResponse.json({ error: 'Slug must be unique' }, { status: 400 })
        }

        const post = await prisma.post.create({
            data: validatedData,
        })

        return NextResponse.json(post, { status: 201 })
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json({ error: 'Invalid input', details: error.errors }, { status: 400 })
        }
        console.error('[POSTS_POST]', error)
        return NextResponse.json({ error: 'Internal error' }, { status: 500 })
    }
}
