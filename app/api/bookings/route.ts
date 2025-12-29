import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/middleware'
import { z } from 'zod'

const bookingSchema = z.object({
  serviceId: z.string().uuid(),
  bookingDate: z.string(),
  startTime: z.string(),
  vehicleMake: z.string().optional(),
  vehicleModel: z.string().optional(),
  clientName: z.string().optional(),
  clientEmail: z.string().email().optional(),
  clientPhone: z.string().optional(),
})

export async function POST(request: NextRequest) {
  try {
    const { error: authError, user } = await requireAuth(request)
    
    const body = await request.json()
    const validatedData = bookingSchema.parse(body)

    // Get service to calculate end time
    const service = await prisma.service.findUnique({
      where: { serviceId: validatedData.serviceId },
    })

    if (!service) {
      return NextResponse.json(
        { error: 'Service not found' },
        { status: 404 }
      )
    }

    // Calculate end time (simplified - in production, parse time properly)
    const [hours, minutes] = validatedData.startTime.split(':').map(Number)
    const startMinutes = hours * 60 + minutes
    const endMinutes = startMinutes + service.durationMinutes
    const endHours = Math.floor(endMinutes / 60)
    const endMins = endMinutes % 60
    const endTime = `${endHours.toString().padStart(2, '0')}:${endMins.toString().padStart(2, '0')}`

    // Check for conflicts
    const conflictingBooking = await prisma.booking.findFirst({
      where: {
        bookingDate: new Date(validatedData.bookingDate),
        status: {
          not: 'Cancelled',
        },
        OR: [
          {
            AND: [
              { startTime: { lte: validatedData.startTime } },
              { endTime: { gt: validatedData.startTime } },
            ],
          },
          {
            AND: [
              { startTime: { lt: endTime } },
              { endTime: { gte: endTime } },
            ],
          },
          {
            AND: [
              { startTime: { gte: validatedData.startTime } },
              { endTime: { lte: endTime } },
            ],
          },
        ],
      },
    })

    if (conflictingBooking) {
      return NextResponse.json(
        { error: 'Time slot is already booked' },
        { status: 400 }
      )
    }

    const booking = await prisma.booking.create({
      data: {
        clientId: user && 'clientId' in user ? user.clientId : null,
        serviceId: validatedData.serviceId,
        bookingDate: new Date(validatedData.bookingDate),
        startTime: validatedData.startTime,
        endTime,
        vehicleMake: validatedData.vehicleMake,
        vehicleModel: validatedData.vehicleModel,
        clientName: validatedData.clientName || (user && 'name' in user ? user.name : null),
        clientEmail: validatedData.clientEmail || (user && 'email' in user ? user.email : null),
        clientPhone: validatedData.clientPhone || (user && 'phone' in user ? user.phone : null),
        status: 'Pending',
      },
      include: {
        service: {
          include: {
            category: true,
          },
        },
      },
    })

    return NextResponse.json(booking, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Error creating booking:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { error: authError, user } = await requireAuth(request)
    
    if (authError) {
      return authError
    }

    // If admin, return all bookings; if client, return only their bookings
    if (user && 'role' in user && user.role) {
      // Admin - return all bookings
      const bookings = await prisma.booking.findMany({
        include: {
          service: {
            include: {
              category: true,
            },
          },
          client: {
            select: {
              name: true,
              email: true,
              phone: true,
            },
          },
        },
        orderBy: {
          bookingDate: 'desc',
        },
      })
      return NextResponse.json(bookings)
    } else if (user && 'clientId' in user) {
      // Client - return only their bookings
      const bookings = await prisma.booking.findMany({
        where: { clientId: user.clientId },
        include: {
          service: {
            include: {
              category: true,
            },
          },
        },
        orderBy: {
          bookingDate: 'desc',
        },
      })
      return NextResponse.json(bookings)
    }

    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    )
  } catch (error) {
    console.error('Error fetching bookings:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}



