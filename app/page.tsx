import Link from 'next/link'
import Image from 'next/image'

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-primary-700 to-primary-900 text-white py-20 px-4">
        <div className="container mx-auto max-w-6xl text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Detailing 4K
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-primary-100">
            Професійний авто детейлінг у Києві
          </p>
          <p className="text-lg mb-10 text-primary-200 max-w-2xl mx-auto">
            Відновлюємо первозданний вигляд вашого автомобіля. Полірування, керамічне покриття, 
            глибоке чищення та комплексний догляд.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link
              href="/services"
              className="bg-white text-primary-700 px-8 py-3 rounded-lg font-semibold hover:bg-primary-50 transition-colors"
            >
              Наші послуги
            </Link>
            <Link
              href="/booking"
              className="bg-primary-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-600 transition-colors border-2 border-white"
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
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-4xl mb-4">✨</div>
              <h3 className="text-xl font-semibold mb-2">Полірування</h3>
              <p className="text-gray-600">
                Відновлення блиску та усунення дрібних подряпин на фарбі автомобіля
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-4xl mb-4">🛡️</div>
              <h3 className="text-xl font-semibold mb-2">Керамічне покриття</h3>
              <p className="text-gray-600">
                Довготривалий захист кузова з покращеним блиском та гідрофобними властивостями
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-4xl mb-4">🧹</div>
              <h3 className="text-xl font-semibold mb-2">Глибоке чищення</h3>
              <p className="text-gray-600">
                Комплексне чищення салону та кузова з використанням професійних засобів
              </p>
            </div>
          </div>
          <div className="text-center mt-10">
            <Link
              href="/services"
              className="text-primary-600 hover:text-primary-700 font-semibold"
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
              className="bg-white text-primary-700 px-8 py-3 rounded-lg font-semibold hover:bg-primary-50 transition-colors"
            >
              Записатися онлайн
            </Link>
            <Link
              href="/contact"
              className="bg-primary-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors border-2 border-white"
            >
              Зв&apos;язатися з нами
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}



