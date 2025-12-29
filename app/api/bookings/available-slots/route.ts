import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const querySchema = z.object({
  date: z.string(),
  serviceId: z.string().uuid(),
})

// Studio hours: 9:00 - 18:00
const WORK_START = 9
const WORK_END = 18

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const date = searchParams.get('date')
    const serviceId = searchParams.get('serviceId')

    if (!date || !serviceId) {
      return NextResponse.json(
        { error: 'Date and serviceId are required' },
        { status: 400 }
      )
    }

    const validated = querySchema.parse({ date, serviceId })

    // Get service duration
    const service = await prisma.service.findUnique({
      where: { serviceId: validated.serviceId },
    })

    if (!service) {
      return NextResponse.json(
        { error: 'Service not found' },
        { status: 404 }
      )
    }

    // Get existing bookings for the date
    const bookings = await prisma.booking.findMany({
      where: {
        bookingDate: new Date(validated.date),
        status: {
          not: 'Cancelled',
        },
      },
    })

    // Generate all possible time slots
    const slots: string[] = []
    const serviceDurationHours = Math.ceil(service.durationMinutes / 60)

    for (let hour = WORK_START; hour <= WORK_END - serviceDurationHours; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        if (hour === WORK_END - serviceDurationHours && minute > 0) break
        
        const slotTime = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`
        const [slotHours, slotMins] = [hour, minute]
        const slotStartMinutes = slotHours * 60 + slotMins
        const slotEndMinutes = slotStartMinutes + service.durationMinutes

        // Check if slot conflicts with existing bookings
        const hasConflict = bookings.some((booking) => {
          const [bookHours, bookMins] = booking.startTime.split(':').map(Number)
          const [bookEndHours, bookEndMins] = booking.endTime.split(':').map(Number)
          const bookStartMinutes = bookHours * 60 + bookMins
          const bookEndMinutes = bookEndHours * 60 + bookEndMins

          return (
            (slotStartMinutes >= bookStartMinutes && slotStartMinutes < bookEndMinutes) ||
            (slotEndMinutes > bookStartMinutes && slotEndMinutes <= bookEndMinutes) ||
            (slotStartMinutes <= bookStartMinutes && slotEndMinutes >= bookEndMinutes)
          )
        })

        if (!hasConflict) {
          slots.push(slotTime)
        }
      }
    }

    return NextResponse.json({ slots })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Error fetching available slots:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}



