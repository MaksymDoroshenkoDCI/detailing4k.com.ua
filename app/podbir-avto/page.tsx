import Link from 'next/link'
import type { Metadata } from 'next'
import type { ReactNode } from 'react'

export const metadata: Metadata = {
  title: 'Підбір авто в Києві та Україні',
  description:
    'Професійний підбір та перевірка автомобілів у 16 регіонах України. Безпека, економія часу, звіти в Telegram. Залиште заявку — Detailing 4K.',
  alternates: {
    canonical: '/podbir-avto',
  },
  openGraph: {
    title: 'Підбір авто в Києві та Україні | Detailing 4K',
    description:
      'Пошук і перевірка авто по Україні. Експерти, діагностика, бази даних, звіти в Telegram.',
    images: ['/opengraph-image'],
  },
}

const contactHref = '/contact?topic=podbir-avto'

function CtaButton({
  children,
  className = '',
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <Link
      href={contactHref}
      className={`inline-flex items-center justify-center rounded-xl bg-primary-500 px-6 py-3.5 text-base font-bold text-black shadow-lg transition hover:bg-primary-400 ${className}`}
    >
      {children}
    </Link>
  )
}

function CtaOutline({ children }: { children: ReactNode }) {
  return (
    <Link
      href={contactHref}
      className="inline-flex items-center justify-center rounded-xl border-2 border-gray-900 bg-white px-6 py-3.5 text-base font-semibold text-gray-900 transition hover:bg-gray-50"
    >
      {children}
    </Link>
  )
}

export default function PodbirAvtoPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-gray-900 via-gray-900 to-gray-800 text-white">
        <div className="pointer-events-none absolute inset-0 opacity-[0.07] [background-image:radial-gradient(circle_at_1px_1px,white_1px,transparent_0)] [background-size:24px_24px]" />
        <div className="container relative mx-auto max-w-4xl px-4 py-16 md:py-24 text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-primary-400">
            Підбір авто в Києві та в Україні
          </p>
          <h1 className="mb-6 text-3xl font-bold leading-tight md:text-5xl">
            Професійний підбір та перевірка автомобіля
          </h1>
          <div className="mb-8 flex flex-wrap justify-center gap-3">
            {['Професійно', 'Результативно', 'Безпечно'].map((t) => (
              <span
                key={t}
                className="rounded-full border border-white/20 bg-white/5 px-4 py-1.5 text-sm font-medium text-gray-100"
              >
                {t}
              </span>
            ))}
          </div>
          <p className="mx-auto mb-10 max-w-2xl text-lg text-gray-300">
            Пошук і перевірка автомобілів у <strong className="text-white">16 регіонах України</strong>.
            Ми знаємо, на що звертати увагу, вміємо торгуватися та економимо ваш час і гроші.
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <CtaButton>Залишити заявку</CtaButton>
            <CtaOutline>Підберіть мені авто</CtaOutline>
          </div>
        </div>
      </section>

      {/* Підбір авто — Detailing 4K */}
      <section className="border-b border-gray-100 bg-gray-50 py-14">
        <div className="container mx-auto max-w-3xl px-4">
          <p className="text-center text-sm font-semibold uppercase tracking-wide text-primary-700">
            Ми працюємо в 16 регіонах України
          </p>
          <h2 className="mt-3 text-center text-2xl font-bold text-gray-900 md:text-3xl">
            Detailing 4K — всеукраїнський сервіс підбору авто
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-gray-700">
            Сучасні технології дозволяють відремонтувати аварійний автомобіль майже без слідів. Але чи
            буде він безпечним і надійним? Наш досвід і обладнання для первинної діагностики заощадять
            ваш час і гроші на поїздки, а висновок офіційного сервісу підтвердить стан автомобіля.
          </p>
          <p className="mt-4 text-lg leading-relaxed text-gray-700">
            Маємо доступ до баз даних: перевіряємо пробіг, історію робіт, участь у ДТП і реальну кількість
            власників. Наші агенти є в <strong className="text-gray-900">16 містах України</strong>. Ми
            знаємо, на що звертати увагу, і вміємо аргументовано торгуватися. Займайтеся своїми справами —
            свою винагороду ми гарантовано відпрацюємо. Професійний автопідбір по Україні — це послуга
            Detailing 4K.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <CtaButton>Отримати консультацію</CtaButton>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12">
        <div className="container mx-auto max-w-5xl px-4">
          <div className="grid gap-6 rounded-2xl border border-gray-200 bg-white p-8 shadow-sm md:grid-cols-3">
            <div className="text-center">
              <p className="text-3xl font-bold text-primary-600">2015</p>
              <p className="mt-1 text-gray-600">року на ринку</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-primary-600">24</p>
              <p className="mt-1 text-gray-600">експерти в команді</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-primary-600">16</p>
              <p className="mt-1 text-gray-600">міст · звіти в Telegram</p>
            </div>
          </div>
        </div>
      </section>

      {/* Why */}
      <section className="bg-gray-900 py-16 text-white">
        <div className="container mx-auto max-w-5xl px-4">
          <h2 className="mb-10 text-center text-2xl font-bold md:text-3xl">Навіщо вам це?</h2>
          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                title: 'Безпека',
                text: 'Знаємо, на що звернути увагу. Мінімізуємо ризик купівлі проблемного б/у авто.',
              },
              {
                title: 'Час',
                text: '16 міст України — немає потреби їздити на марні перегляди по всій країні.',
              },
              {
                title: 'Результат',
                text: 'Підбір згідно з вашими вимогами. Гарантовано відпрацюємо свій гонорар.',
              },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm"
              >
                <h3 className="mb-3 text-xl font-bold text-primary-400">{item.title}</h3>
                <p className="leading-relaxed text-gray-300">{item.text}</p>
              </div>
            ))}
          </div>
          <div className="mt-10 text-center">
            <CtaButton className="!bg-white !text-gray-900 hover:!bg-gray-100">
              Залишити заявку на підбір
            </CtaButton>
          </div>
        </div>
      </section>

      {/* Expert check */}
      <section className="py-16">
        <div className="container mx-auto max-w-3xl px-4">
          <h2 className="mb-4 text-center text-2xl font-bold text-gray-900 md:text-3xl">
            Експертна перевірка автомобілів
          </h2>
          <p className="mb-2 text-center text-lg font-medium text-gray-800">
            Знаємо, як купити гідну машину.
          </p>
          <p className="mb-8 text-center text-gray-600">
            Унікальна система оцінки вживаного авто — деталізовано, інформативно і завжди онлайн. Діліться
            звітами про переглянуті автомобілі з друзями, обговорюйте та коментуйте.
          </p>
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <CtaButton>Підберіть мені авто</CtaButton>
            <a
              href="tel:+380989946178"
              className="inline-flex items-center justify-center rounded-xl border-2 border-primary-500 px-6 py-3.5 text-base font-semibold text-gray-900 transition hover:bg-primary-50"
            >
              Зателефонувати
            </a>
          </div>
        </div>
      </section>

      {/* How to start */}
      <section className="border-t border-gray-100 bg-gray-50 py-16">
        <div className="container mx-auto max-w-3xl px-4">
          <h2 className="mb-8 text-center text-2xl font-bold text-gray-900 md:text-3xl">
            З чого почати підбір авто?
          </h2>
          <div className="space-y-5 text-lg leading-relaxed text-gray-700">
            <p>
              Спочатку визначтеся з бажаною моделлю або кількома варіантами. Проаналізуйте діапазон цін на
              автомобілі, які вас цікавлять. Пам&apos;ятайте: найдешевша пропозиція часто не варта уваги —
              велика ймовірність прихованих проблем.
            </p>
            <p>
              Якщо на ринку є пропозиції в діапазоні 20–24 тис. $ за авто одного року випуску, краще
              орієнтуватися на <strong className="text-gray-900">середню ціну</strong> (наприклад, близько
              22 тис. $), а не на мінімум і надію лише на торг.
            </p>
            <p>
              Не варто орієнтуватися на оголошення з віддалених маленьких міст без нормального сервісу та
              інфраструктури — такі авто часто не пройдуть нашу експертну перевірку Detailing 4K і з високою
              ймовірністю матимуть приховані ризики.
            </p>
            <p className="rounded-xl border border-primary-200 bg-primary-50/80 p-5 font-medium text-gray-900">
              Знайдемо кращий автомобіль, перевіримо його та заощадимо ваші гроші завдяки аргументованому
              торгу. Залиште заявку — розпочнемо підбір сьогодні.
            </p>
          </div>
          <div className="mt-10 flex flex-col items-stretch gap-4 sm:flex-row sm:justify-center">
            <CtaButton className="w-full sm:w-auto">Залишити заявку</CtaButton>
            <Link
              href={contactHref}
              className="inline-flex w-full items-center justify-center rounded-xl bg-gray-900 px-6 py-3.5 text-base font-bold text-white transition hover:bg-gray-800 sm:w-auto"
            >
              Написати в формі на сайті
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
