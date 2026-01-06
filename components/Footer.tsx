import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4 text-primary-500">Detailing 4K</h3>
            <p className="text-gray-400">
              Професійний авто детейлінг у Києві. Відновлюємо первозданний вигляд вашого автомобіля.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4 text-white">Навігація</h4>
            <ul className="space-y-2 text-gray-400">
              <li><Link href="/" className="hover:text-primary-500 transition-colors">Головна</Link></li>
              <li><Link href="/services" className="hover:text-primary-500 transition-colors">Послуги</Link></li>
              <li><Link href="/gallery" className="hover:text-white transition-colors">Галерея</Link></li>
              <li><Link href="/testimonials" className="hover:text-primary-500 transition-colors">Відгуки</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4 text-white">Контакти</h4>
            <ul className="space-y-2 text-gray-400">
              <li>Брожка 38/58, Київ, Україна</li>
              <li>
                <a href="tel:+380989946178" className="hover:text-primary-500 transition-colors">
                  098 994 6178
                </a>
              </li>
              <li>
                <a href="tel:+380681670042" className="hover:text-primary-500 transition-colors">
                  068 167 0042
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4 text-white">Соціальні мережі</h4>
            <div className="flex flex-col gap-2">
              <a
                href="https://www.instagram.com/_detailing_4k/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-primary-500 transition-colors font-bold"
              >
                Instagram
              </a>
              <a
                href="https://www.facebook.com/detailingcenter4k/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-primary-500 transition-colors font-bold"
              >
                Facebook
              </a>
              <a
                href="https://www.youtube.com/channel/UCAkAlWXl8pWklmPEQSROAIg/videos?view=0&sort=da"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-primary-500 transition-colors font-bold"
              >
                YouTube
              </a>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} Detailing 4K. Всі права захищені.</p>
        </div>
      </div>
    </footer>
  )
}



