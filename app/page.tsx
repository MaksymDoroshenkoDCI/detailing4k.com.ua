import Link from 'next/link'
import Image from 'next/image'
import { prisma } from '@/lib/prisma'

export default async function Home() {
  const services = await prisma.service.findMany({
    take: 6,
    orderBy: { createdAt: 'desc' },
    include: { category: true }
  })

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative min-h-[70vh] flex items-center justify-center text-white py-20 px-4 overflow-hidden">
        {/* Background Video (Cloudinary) */}
        <div className="absolute inset-0 z-0 bg-black">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
          >
            <source
              src="https://res.cloudinary.com/dh3eueciv/video/upload/f_mp4/v1767702998/1_%D1%85%D0%B2_d09tsq.mov"
              type="video/mp4"
            />
          </video>
          {/* Dark Overlay covers the whole section */}
          <div className="absolute inset-0 bg-black/60" />
        </div>

        <div className="container mx-auto max-w-6xl text-center relative z-10">
          <h1 className="sr-only">Detailing 4K</h1>

          <div className="flex justify-center mb-0">
            <div className="relative w-[500px] h-[400px] overflow-hidden">
              <Image
                src="/logo-white.png"
                alt="Detailing 4K Logo"
                width={500}
                height={500}
                priority
                className="object-cover object-top"
              />
            </div>
          </div>

          <p className="text-xl md:text-2xl mb-8 text-primary-400">
            Професійний авто детейлінг у Києві
          </p>

          <p className="text-lg mb-10 text-gray-300 max-w-2xl mx-auto">
            Відновлюємо первозданний вигляд вашого автомобіля. Полірування, керамічне покриття,
            глибоке чищення та комплексний догляд.
          </p>

          <div className="flex gap-4 justify-center flex-wrap">
            <Link
              href="/services"
              className="bg-white text-black px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Наші послуги
            </Link>
            <Link
              href="/booking"
              className="bg-primary-500 text-black px-8 py-3 rounded-lg font-semibold hover:bg-primary-400 transition-colors"
            >
              Записатися
            </Link>
          </div>
        </div>
      </section>

      {/* Services Preview */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">Наші послуги</h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service: any) => (
              <div
                key={service.serviceId}
                className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col hover:shadow-lg transition-shadow"
              >
                {service.imageUrl && (
                  <div className="h-48 bg-gray-200 relative">
                    <img
                      src={service.imageUrl}
                      alt={service.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                <div className="p-6 flex flex-col flex-grow">
                  <h3 className="text-xl font-semibold mb-2 text-gray-900">{service.name}</h3>

                  <p className="text-gray-600 mb-4 flex-grow line-clamp-3">
                    {service.description}
                  </p>

                  <div className="flex justify-between items-center mt-4">
                    <span className="text-lg font-bold text-gray-900">
                      від {service.price.toString()} грн
                    </span>

                    <Link
                      href={`/booking?serviceId=${service.serviceId}`}
                      className="bg-primary-500 text-black px-4 py-2 rounded-lg hover:bg-primary-400 transition-colors font-semibold text-sm"
                    >
                      Записатися
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              href="/services"
              className="inline-block bg-black text-white px-8 py-3 rounded-lg font-bold hover:bg-gray-900 transition-colors"
            >
              Переглянути всі послуги →
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-center mb-12">Чому обирають нас</h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl mb-3">⭐</div>
              <h3 className="font-semibold mb-2">Висока якість</h3>
              <p className="text-gray-600 text-sm">Професійне обладнання та матеріали</p>
            </div>

            <div className="text-center">
              <div className="text-3xl mb-3">👨‍🔧</div>
              <h3 className="font-semibold mb-2">Досвідчені майстри</h3>
              <p className="text-gray-600 text-sm">Роки досвіду в авто детейлінгу</p>
            </div>

            <div className="text-center">
              <div className="text-3xl mb-3">💎</div>
              <h3 className="font-semibold mb-2">Результат 4K</h3>
              <p className="text-gray-600 text-sm">Досконалий вигляд вашого авто</p>
            </div>

            <div className="text-center">
              <div className="text-3xl mb-3">📞</div>
              <h3 className="font-semibold mb-2">Зручний запис</h3>
              <p className="text-gray-600 text-sm">Онлайн бронювання 24/7</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-primary-600 text-white">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold mb-4">Готові надати вашому авто ідеальний вигляд?</h2>

          <p className="text-lg mb-8 text-primary-100">
            Запишіться на консультацію або оберіть послугу прямо зараз
          </p>

          <div className="flex gap-4 justify-center flex-wrap">
            <Link
              href="/booking"
              className="bg-white text-black px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Записатися онлайн
            </Link>

            <Link
              href="/contact"
              className="bg-black text-white px-8 py-3 rounded-lg font-semibold hover:bg-gray-900 transition-colors border-2 border-white"
            >
              Зв'язатися з нами
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
