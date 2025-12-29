export interface Service {
  serviceId: string
  name: string
  description: string | null
  price: number
  durationMinutes: number
  categoryId: string | null
  imageUrl: string | null
  category?: {
    name: string
  }
}

export interface Booking {
  bookingId: string
  clientId: string | null
  serviceId: string
  bookingDate: string
  startTime: string
  endTime: string
  vehicleMake: string | null
  vehicleModel: string | null
  status: string
  clientName: string | null
  clientEmail: string | null
  clientPhone: string | null
  service?: Service
}

export interface GalleryImage {
  imageId: string
  serviceId: string | null
  title: string | null
  description: string | null
  beforeImageUrl: string
  afterImageUrl: string
  service?: {
    name: string
  }
}

export interface Testimonial {
  testimonialId: string
  clientId: string | null
  text: string
  rating: number | null
  datePosted: string
  approved: boolean
  clientName: string | null
  client?: {
    name: string
  }
}

export interface Consultation {
  consultationId: string
  name: string
  email: string
  phone: string | null
  message: string
  status: string
  createdAt: string
}



