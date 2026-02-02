import Link from 'next/link'
import Image from 'next/image'
import { prisma } from '@/lib/prisma'
import { Metadata } from 'next'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Detailing 4K — Професійний детейлінг авто в Києві',
  description: 'Преміальний детейлінг у Києві. Полірування, кераміка, хімчистка та антигравійна плівка. Відновлення та захист вашого авто в студії Detailing 4K.',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Detailing 4K — Професійний детейлінг авто в Києві',
    description: 'Преміальний детейлінг, полірування, кераміка, захист кузова та салону.',
    images: ['/opengraph-image'],
  }
}

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
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-white leading-tight">
            Детейлінг авто в Києві — <br className="hidden md:block" /> студія Detailing4K
          </h1>

          <div className="flex justify-center mb-6">
            <div className="relative w-[400px] h-[320px] overflow-hidden">
              <Image
                src="/logo-white.png"
                alt="Detailing 4K - професійний авто детейлінг у Києві"
                width={400}
                height={400}
                priority
                className="object-cover object-top"
              />
            </div>
          </div>

          <p className="text-xl md:text-2xl mb-8 text-primary-300 font-medium tracking-wide">
            Відновлюємо первозданний вигляд вашого автомобіля
          </p>

          <p className="text-lg mb-10 text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Повний комплекс послуг: полірування, керамічне покриття, хімчистка та антигравійна плівка.
            Професійний догляд з гарантією якості.
          </p>

          <div className="flex flex-col items-center gap-6">
            <div className="flex gap-4 justify-center flex-wrap">
              <Link
                href="/services"
                title="Переглянути послуги детейлінгу"
                className="bg-white text-black px-8 py-3 rounded-lg font-bold hover:bg-gray-100 transition-colors shadow-lg"
              >
                Наші послуги
              </Link>
              <Link
                href="/booking"
                title="Записатись на детейлінг"
                className="bg-primary-500 text-black px-8 py-3 rounded-lg font-bold hover:bg-primary-400 transition-colors shadow-lg hover:shadow-primary-500/50"
              >
                Записатися
              </Link>
            </div>

            {/* Micro-text / Badges */}
            <div className="flex gap-4 md:gap-8 text-sm md:text-base text-gray-300 font-medium">
              <span className="flex items-center"><span className="text-primary-400 mr-2">✓</span> Працюємо без вихідних</span>
              <span className="flex items-center"><span className="text-primary-400 mr-2">✓</span> Гарантія на роботи</span>
              <span className="flex items-center"><span className="text-primary-400 mr-2">✓</span> Преміум матеріали</span>
            </div>
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
                    <Image
                      src={service.imageUrl}
                      alt={service.name}
                      fill
                      className="object-cover"
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

      {/* SEO Info Section */}
      <section className="py-16 px-4 bg-gray-50 border-y border-gray-200">
        <div className="container mx-auto max-w-4xl">
          <header className="mb-10 text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Детейлінг авто в Києві — студія Detailing4K
            </h2>
            <p className="text-lg text-gray-700 leading-relaxed">
              <strong>Detailing4K</strong> — це сучасна студія детейлінгу в Києві, що спеціалізується на професійному догляді, відновленні та захисті автомобілів. Ми надаємо повний комплекс послуг з <strong>детейлінгу авто в Києві</strong>, поєднуючи досвід майстрів, преміальні матеріали та уважне ставлення до кожної деталі.
            </p>
            <p className="mt-4 text-gray-700">
              Якщо вам потрібен якісний <strong>детейлінг авто Київ</strong> — ви за адресою.
            </p>
          </header>

          <div className="space-y-12">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Послуги студії детейлінгу Detailing4K</h3>

              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h4 className="text-xl font-semibold text-gray-900 mb-2">Мийка та полірування авто в Києві</h4>
                  <p className="text-gray-600 mb-4">
                    Професійна мийка та <strong>полірування авто в Києві</strong> — одна з ключових послуг нашої студії. Ми виконуємо багатофазну ручну мийку, повністю видаляючи забруднення з кузова, дисків і важкодоступних зон. Полірування дозволяє усунути дрібні подряпини, сліди зношування та повернути лакофарбовому покриттю глибокий колір і блиск.
                  </p>
                </div>

                <div>
                  <h4 className="text-xl font-semibold text-gray-900 mb-2">Керамічне покриття та антигравійна плівка</h4>
                  <p className="text-gray-600 mb-4">
                    Для довготривалого захисту ми пропонуємо <strong>керамічне покриття авто</strong> та обклеювання автомобіля <strong>антигравійною плівкою</strong>. Дані послуги захищають кузов від сколів, подряпин, реагентів, ультрафіолету та агресивних умов експлуатації. <strong>Антигравійна плівка в Києві</strong> — оптимальне рішення для збереження ідеального вигляду автомобіля.
                  </p>
                </div>

                <div>
                  <h4 className="text-xl font-semibold text-gray-900 mb-2">Детейлінг салону та хімчистка авто</h4>
                  <p className="text-gray-600 mb-4">
                    <strong>Хімчистка салону авто</strong> — важлива частина комплексного детейлінгу. Ми проводимо глибоке очищення сидінь, підлоги, стелі, пластикових і шкіряних елементів салону. Видаляємо складні плями, запахи та бактерії, повертаючи салону чистоту, свіжість і охайний вигляд.
                  </p>
                </div>

                <div>
                  <h4 className="text-xl font-semibold text-gray-900 mb-2">Полірування фар і захист скла</h4>
                  <p className="text-gray-600 mb-4">
                    Полірування фар дозволяє відновити прозорість оптики та покращити освітлення дороги. Додатково наносимо антидощові покриття на скло, що забезпечує кращу видимість і комфорт керування автомобілем у дощову погоду.
                  </p>
                </div>
              </div>

              <div className="mt-6 bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <h4 className="text-xl font-semibold text-gray-900 mb-2">Озонація салону</h4>
                <p className="text-gray-600">
                  Озонація салону — ефективний спосіб усунення неприємних запахів і знищення бактерій. Процедура ідеально підходить для автомобілів із запахом тютюну, вологи або тварин та створює здоровий мікроклімат всередині авто.
                </p>
              </div>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-md border border-gray-100">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Чому варто обрати студію детейлінгу Detailing4K у Києві</h3>
              <p className="text-gray-700 mb-4">Нас обирають клієнти, які цінують результат:</p>
              <ul className="text-gray-700 grid md:grid-cols-2 gap-3 list-none">
                <li className="flex items-center"><span className="text-primary-500 mr-2">✓</span> професійний{' '}<strong>детейлінг у Києві</strong>{' '}з гарантією якості</li>
                <li className="flex items-center"><span className="text-primary-500 mr-2">✓</span> використання сертифікованих матеріалів і автохімії</li>
                <li className="flex items-center"><span className="text-primary-500 mr-2">✓</span> індивідуальний підбір комплексу послуг</li>
                <li className="flex items-center"><span className="text-primary-500 mr-2">✓</span> чесна та прозора вартість</li>
              </ul>
            </div>

            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Вартість детейлінгу авто в Києві</h3>
              <div className="flex flex-col md:flex-row gap-8 items-start">
                <div className="flex-1">
                  <p className="text-gray-700 mb-4">Ціна на <strong>детейлінг авто в Києві</strong> залежить від:</p>
                  <ul className="list-disc pl-5 space-y-2 text-gray-700">
                    <li>типу та розміру автомобіля</li>
                    <li>обраного комплексу послуг</li>
                    <li>стану кузова та салону</li>
                    <li>виду захисного покриття</li>
                  </ul>
                  <p className="mt-4 text-gray-700 font-medium">Ми допоможемо підібрати оптимальне рішення для вашого авто та бюджету.</p>
                </div>

                <div className="flex-1 bg-primary-50 p-6 rounded-lg border border-primary-100">
                  <h4 className="text-xl font-bold text-gray-900 mb-2">Замовити детейлінг авто в Києві</h4>
                  <p className="text-gray-700 mb-6">
                    Хочете, щоб ваш автомобіль виглядав як новий і був захищений від зовнішніх впливів? Запрошуємо до <strong>Detailing4K</strong> — професійної <strong>студії детейлінгу в Києві</strong>.
                  </p>
                  <p className="text-gray-900 font-bold mb-6">
                    Detailing4K — якісний детейлінг авто в Києві з видимим результатом.
                  </p>
                  <Link
                    href="/contact"
                    className="inline-block bg-primary-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-primary-700 transition-colors w-full text-center"
                  >
                    Зв'язатися з нами
                  </Link>
                </div>
              </div>
            </div>
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

      {/* Blog/Advice Section */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">Поради по догляду за авто</h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {(await prisma.post.findMany({
              where: { published: true },
              take: 6,
              orderBy: { createdAt: 'desc' }
            })).map((post) => (
              <div key={post.id} className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-xl transition-all flex flex-col h-full">
                <div className="h-48 bg-gray-800 relative flex items-center justify-center overflow-hidden">
                  {post.imageUrl ? (
                    <Image
                      src={post.imageUrl}
                      alt={post.title}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <span className="text-4xl">✨</span>
                  )}
                </div>
                <div className="p-6 flex flex-col flex-grow">
                  <h3 className="text-xl font-bold mb-3 text-gray-900 line-clamp-2">{post.title}</h3>
                  <p className="text-gray-600 mb-4 line-clamp-3 text-sm flex-grow">
                    {post.excerpt || post.content.substring(0, 150) + '...'}
                  </p>
                  <Link
                    href={`/autodohlyad/${post.slug}`}
                    className="text-primary-600 font-semibold hover:text-primary-500 inline-flex items-center text-sm"
                  >
                    Читати статтю <span className="ml-2">→</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              href="/autodohlyad"
              className="inline-block bg-black text-white px-8 py-3 rounded-lg font-bold hover:bg-gray-900 transition-colors"
            >
              Більше порад →
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">Часті питання</h2>

          <div className="space-y-6">
            <details className="bg-white rounded-lg shadow-md p-6 group">
              <summary className="font-semibold text-lg cursor-pointer list-none flex justify-between items-center text-gray-900">
                Що таке детейлінг автомобіля?
                <span className="text-2xl group-open:rotate-45 transition-transform text-gray-900">+</span>
              </summary>
              <p className="mt-4 text-gray-600">
                Детейлінг - це комплексний професійний догляд за автомобілем, який включає глибоке чищення,
                полірування, захист кузова та салону. На відміну від звичайної мийки, детейлінг відновлює
                первозданний вигляд автомобіля та захищає його від зовнішніх впливів.
              </p>
            </details>

            <details className="bg-white rounded-lg shadow-md p-6 group">
              <summary className="font-semibold text-lg cursor-pointer list-none flex justify-between items-center text-gray-900">
                Скільки часу займає детейлінг?
                <span className="text-2xl group-open:rotate-45 transition-transform text-gray-900">+</span>
              </summary>
              <p className="mt-4 text-gray-600">
                Час виконання залежить від обраних послуг: експрес-детейлінг займає 2-3 години,
                повний детейлінг - від 6 до 12 годин, керамічне покриття - 1-2 дні. Ми завжди
                повідомляємо точний час при записі.
              </p>
            </details>

            <details className="bg-white rounded-lg shadow-md p-6 group">
              <summary className="font-semibold text-lg cursor-pointer list-none flex justify-between items-center text-gray-900">
                Як часто потрібно робити детейлінг?
                <span className="text-2xl group-open:rotate-45 transition-transform text-gray-900">+</span>
              </summary>
              <p className="mt-4 text-gray-600">
                Рекомендуємо комплексний детейлінг 2-4 рази на рік (кожен сезон). Керамічне покриття
                служить 1-3 роки залежно від умов експлуатації. Хімчистку салону краще робити
                кожні 6 місяців або за потреби.
              </p>
            </details>

            <details className="bg-white rounded-lg shadow-md p-6 group">
              <summary className="font-semibold text-lg cursor-pointer list-none flex justify-between items-center text-gray-900">
                Чи безпечне полірування для лакофарбового покриття?
                <span className="text-2xl group-open:rotate-45 transition-transform text-gray-900">+</span>
              </summary>
              <p className="mt-4 text-gray-600">
                Так, професійне полірування абсолютно безпечне. Ми використовуємо сучасне обладнання
                та преміальні полірувальні пасти, які знімають мінімальний шар лаку (1-3 мікрони).
                Товщина лаку вимірюється перед роботою.
              </p>
            </details>

            <details className="bg-white rounded-lg shadow-md p-6 group">
              <summary className="font-semibold text-lg cursor-pointer list-none flex justify-between items-center text-gray-900">
                Що входить у вартість послуг?
                <span className="text-2xl group-open:rotate-45 transition-transform text-gray-900">+</span>
              </summary>
              <p className="mt-4 text-gray-600">
                Вартість включає всі матеріали преміум-класу, роботу майстрів, використання
                професійного обладнання. Ми працюємо прозоро - фінальна ціна обговорюється
                до початку робіт і не змінюється.
              </p>
            </details>

            <details className="bg-white rounded-lg shadow-md p-6 group">
              <summary className="font-semibold text-lg cursor-pointer list-none flex justify-between items-center text-gray-900">
                Чи надаєте гарантію на роботи?
                <span className="text-2xl group-open:rotate-45 transition-transform text-gray-900">+</span>
              </summary>
              <p className="mt-4 text-gray-600">
                Так, ми надаємо гарантію на всі види робіт. На керамічне покриття - до 3 років,
                на полірування - до 6 місяців, на хімчистку салону - 1 місяць. Умови гарантії
                обговорюються індивідуально.
              </p>
            </details>
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

      {/* Full-width Map Section */}
      <section className="w-full h-[400px] relative mt-16 grayscale hover:grayscale-0 transition-all duration-700">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2542.5652370895664!2d30.509576!3d50.4119396!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x40d4cf5a0829f613%3A0xfe497d3c54ef9e7a!2z0JTQtdGC0LXQudC70ZbQvdCzINGG0LXQvdGC0YAgNNCaIC0g0KXRltC80YfQuNGB0YLQutCwLCDQn9C-0LvRltGA0YPQstCw0L3QvdGPLCDQoNC10YHRgtCw0LLRgNCw0YbRltGPINGE0LDRgCAo0LTQtdGC0LXQudC70ZbQvdCzKQ!5e0!3m2!1suk!2sde!4v1769595696911!5m2!1suk!2sde"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Студія Detailing 4K на карті"
        />
      </section>
    </div>
  )
}
