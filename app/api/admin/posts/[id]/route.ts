import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/middleware'
import { z } from 'zod'

const postSchema = z.object({
    title: z.string().min(1, 'Title is required'),
    slug: z.string().min(1, 'Slug is required'),
    content: z.string().min(1, 'Content is required'),
    excerpt: z.string().optional().nullable(),
    imageUrl: z.string().optional().nullable(),
    published: z.boolean().default(false),
})

export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const { error } = await requireAdmin(request)
        if (error) return error

        const post = await prisma.post.findUnique({
            where: { id: params.id },
        })

        if (!post) {
            return NextResponse.json({ error: 'Post not found' }, { status: 404 })
        }

        return NextResponse.json(post)
    } catch (error) {
        console.error('[POST_GET_BY_ID]', error)
        return NextResponse.json({ error: 'Internal error' }, { status: 500 })
    }
}

export async function PATCH(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const { error } = await requireAdmin(request)
        if (error) return error

        const body = await request.json()
        const validatedData = postSchema.partial().parse(body)

        if (validatedData.slug) {
            const existingPost = await prisma.post.findFirst({
                where: {
                    slug: validatedData.slug,
                    NOT: { id: params.id }
                }
            })
            if (existingPost) {
                return NextResponse.json({ error: 'Slug must be unique' }, { status: 400 })
            }
        }

        const post = await prisma.post.update({
            where: { id: params.id },
            data: validatedData,
        })

        return NextResponse.json(post)
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json({ error: 'Invalid input', details: error.errors }, { status: 400 })
        }
        console.error('[POST_PATCH]', error)
        return NextResponse.json({ error: 'Internal error' }, { status: 500 })
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const { error } = await requireAdmin(request)
        if (error) return error

        await prisma.post.delete({
            where: { id: params.id },
        })

        return new NextResponse(null, { status: 204 })
    } catch (error) {
        console.error('[POST_DELETE]', error)
        return NextResponse.json({ error: 'Internal error' }, { status: 500 })
    }
}
