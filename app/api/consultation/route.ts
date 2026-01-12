import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const consultationSchema = z.object({
    name: z.string().min(2, 'Name too short'),
    phone: z.string().min(5, 'Phone too short'),
})

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const validatedData = consultationSchema.parse(body)

        const consultation = await prisma.consultation.create({
            data: {
                name: validatedData.name,
                phone: validatedData.phone,
                email: 'callback@request', // Placeholder as email is not in the form but required by schema? Check schema.
                message: 'Request callback via widget',
                status: 'New',
            },
        })

        return NextResponse.json(consultation, { status: 201 })
    } catch (error) {
        // If Prisma fails because email is required and we didn't provide valid one:
        // Schema check: 
        // model Consultation { email String } is required.
        // So we must provide a dummy or fix the schema. 
        // I will use a dummy unique-ish email or empty string if allowed, likely dummy.

        console.error('Error creating consultation:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}
