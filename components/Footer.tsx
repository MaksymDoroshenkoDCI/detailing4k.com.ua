import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">Detailing 4K</h3>
            <p className="text-gray-400">
              Професійний авто детейлінг у Києві. Відновлюємо первозданний вигляд вашого автомобіля.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Навігація</h4>
            <ul className="space-y-2 text-gray-400">
              <li><Link href="/" className="hover:text-white transition-colors">Головна</Link></li>
              <li><Link href="/services" className="hover:text-white transition-colors">Послуги</Link></li>
              <li><Link href="/gallery" className="hover:text-white transition-colors">Галерея</Link></li>
              <li><Link href="/testimonials" className="hover:text-white transition-colors">Відгуки</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Контакти</h4>
            <ul className="space-y-2 text-gray-400">
              <li>Київ, Україна</li>
              <li>
                <a href="tel:+380XXXXXXXXX" className="hover:text-white transition-colors">
                  +380 XX XXX XX XX
                </a>
              </li>
              <li>
                <a href="mailto:info@detailing4k.com" className="hover:text-white transition-colors">
                  info@detailing4k.com
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Соціальні мережі</h4>
            <div className="flex gap-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                Facebook
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                Instagram
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                Telegram
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



