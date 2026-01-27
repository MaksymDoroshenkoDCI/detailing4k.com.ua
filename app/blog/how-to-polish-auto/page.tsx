import { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'

export const metadata: Metadata = {
    title: 'Як правильно полірувати авто: детальний гід | Detailing 4K',
    description: 'Дізнайтеся, як правильно полірувати автомобіль своїми руками та в студії. Покрокова інструкція, вибір паст та обладнання. Поради від професіоналів Detailing 4K.',
    openGraph: {
        title: 'Як правильно полірувати авто: детальний гід для автолюбителів',
        description: 'Покрокова інструкція з полірування автомобіля. Розбираємо матеріали, обладнання та етапи роботи.',
        type: 'article',
        url: 'https://detailing4k.com.ua/blog/how-to-polish-auto',
    }
}

export default function PolishGuidePage() {
    return (
        <div className="bg-white min-h-screen pt-24 pb-16">
            <article className="container mx-auto px-4 max-w-4xl">
                <header className="mb-10 text-center">
                    <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6">
                        Як правильно полірувати авто: детальний гід для автолюбителів
                    </h1>
                    <p className="text-xl text-gray-600 leading-relaxed">
                        Полірування авто — це процес, який повертає лакофарбовому покриттю автомобіля блиск,
                        усуває дрібні подряпини та забезпечує додатковий захист.
                    </p>
                </header>

                <div className="prose prose-lg max-w-none text-gray-700 space-y-8">
                    <section>
                        <p>
                            Багато автолюбителів задаються питанням: “Як полірувати авто?”, “Чим краще полірувати авто?”
                            або навіть “Як полірувати машину в домашніх умовах?”. У цій статті ми розберемося, як правильно
                            це зробити, які інструменти використовувати та що потрібно для полірування авто.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">Що таке полірування авто і для чого воно потрібне?</h2>
                        <p className="mb-4">
                            Полірування автомобіля — це процес відновлення поверхні ЛФП за допомогою спеціальних паст і обладнання.
                            Його основна мета:
                        </p>
                        <ul className="list-disc pl-6 space-y-2 mb-4">
                            <li>Усунення подряпин, потертостей і слідів окислення.</li>
                            <li>Відновлення кольору та блиску.</li>
                            <li>Захист поверхні від подальших пошкоджень.</li>
                        </ul>
                        <p>
                            Професійне полірування і полірування авто своїми руками відрізняються рівнем обладнання та досвіду,
                            але і домашнє полірування може дати гарний результат за правильної підготовки.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">Як правильно полірувати автомобіль?</h2>
                        <p className="mb-4">Процес полірування машини складається з кількох етапів:</p>

                        <h3 className="text-xl font-semibold text-gray-900 mb-2">1. Підготовка авто</h3>
                        <ul className="list-disc pl-6 space-y-2 mb-6">
                            <li><strong>Мийка:</strong> ретельно вимийте автомобіль, бажано двофазно, щоб повністю усунути забруднення.</li>
                            <li><strong>Очищення кузова:</strong> використовуйте спеціальну глину для видалення залишків бітуму, клею та інших вкраплень.</li>
                            <li><strong>Обклеювання деталей:</strong> гумові та пластикові елементи обклейте малярною стрічкою, щоб уникнути їх пошкодження.</li>
                        </ul>

                        <h3 className="text-xl font-semibold text-gray-900 mb-2">2. Вибір паст і обладнання</h3>
                        <p className="mb-2">Що потрібно для полірування авто?</p>
                        <div className="mb-4">
                            <strong>Полірувальні пасти:</strong>
                            <ul className="list-disc pl-6 mt-1">
                                <li>Koch Chemie H9.01 — для усунення глибоких подряпин.</li>
                                <li>Koch Chemie F6.01 — для середніх дефектів.</li>
                                <li>Koch Chemie M3.02 — для фінішного полірування.</li>
                            </ul>
                        </div>
                        <p className="mb-6">
                            <strong>Полірувальні машинки:</strong> ексцентрикові або роторні (RUPES, FLEX).<br />
                            <strong>Полірувальні круги:</strong> хутряні, середньої жорсткості та м’які (для фінішу).
                        </p>

                        <h3 className="text-xl font-semibold text-gray-900 mb-2">3. Сам процес полірування</h3>
                        <ol className="list-decimal pl-6 space-y-2 mb-6">
                            <li>Почніть із видалення найбільших подряпин хутряним кругом із абразивною пастою.</li>
                            <li>Перейдіть до середньозернистої пасти та поролонового круга для вирівнювання поверхні.</li>
                            <li>Завершіть полірування м’яким кругом із пастою для усунення голограм.</li>
                        </ol>

                        <h3 className="text-xl font-semibold text-gray-900 mb-2">4. Захист після полірування</h3>
                        <p className="mb-6">
                            Нанесіть віск або керамічне покриття, щоб закріпити результат і захистити ЛФП.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">Як полірувати машину в домашніх умовах?</h2>
                        <p className="mb-4">
                            Поліровка авто в домашніх умовах — це реальність для тих, хто готовий інвестувати у якісні матеріали
                            та приділити процесу час.
                        </p>
                        <ul className="list-disc pl-6 space-y-2 mb-6">
                            <li><strong>Виберіть обладнання:</strong> Для полірування машини вручну потрібна кутова шліфувальна машинка з можливістю регулювання швидкості.</li>
                            <li><strong>Дотримуйтесь обережності:</strong> Особливо ретельно працюйте з кутами та ребрами жорсткості кузова, оскільки тут можна легко зняти верхній шар фарби.</li>
                            <li><strong>Купуйте якісні матеріали:</strong> Використовуйте пасти середньої зернистості та круги, що відповідають вашим потребам.</li>
                            <li><strong>Тримайте робочу температуру:</strong> Не допускайте перегріву поверхні, щоб уникнути пошкодження фарби.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">Чому слід обрати професіоналів?</h2>
                        <p className="mb-4">
                            Поліровка машини своїми руками може бути корисним досвідом, але професійне полірування авто гарантує:
                        </p>
                        <ul className="list-disc pl-6 space-y-2 mb-4">
                            <li>Відсутність ризику пошкодження ЛФП.</li>
                            <li>Використання спеціального обладнання та матеріалів.</li>
                            <li>Ідеальний результат у найкоротші терміни.</li>
                        </ul>
                        <p>
                            У детейлінг-центрі <strong>Detailing 4K</strong> ми проводимо полірування за чіткими стандартами якості,
                            використовуючи лише перевірені матеріали (Koch Chemie, RUPES, FLEX).
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">Таблиця матеріалів і обладнання</h2>
                        <div className="overflow-x-auto">
                            <table className="w-full border-collapse border border-gray-300 mb-8">
                                <thead className="bg-gray-100">
                                    <tr>
                                        <th className="border border-gray-300 p-3 text-left font-bold text-gray-900">Матеріал / Обладнання</th>
                                        <th className="border border-gray-300 p-3 text-left font-bold text-gray-900">Призначення</th>
                                        <th className="border border-gray-300 p-3 text-left font-bold text-gray-900">Рекомендації</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td className="border border-gray-300 p-3">Koch Chemie H9.01</td>
                                        <td className="border border-gray-300 p-3">Видалення глибоких подряпин</td>
                                        <td className="border border-gray-300 p-3">Хутряний круг</td>
                                    </tr>
                                    <tr>
                                        <td className="border border-gray-300 p-3">Koch Chemie F6.01</td>
                                        <td className="border border-gray-300 p-3">Усунення середніх дефектів</td>
                                        <td className="border border-gray-300 p-3">Поролон середньої жорсткості</td>
                                    </tr>
                                    <tr>
                                        <td className="border border-gray-300 p-3">Koch Chemie M3.02</td>
                                        <td className="border border-gray-300 p-3">Фінішне полірування</td>
                                        <td className="border border-gray-300 p-3">М’який поролон</td>
                                    </tr>
                                    <tr>
                                        <td className="border border-gray-300 p-3">RUPES</td>
                                        <td className="border border-gray-300 p-3">Ексцентрикова полірувальна машинка</td>
                                        <td className="border border-gray-300 p-3">Для рівномірного зняття шару ЛФП</td>
                                    </tr>
                                    <tr>
                                        <td className="border border-gray-300 p-3">FLEX</td>
                                        <td className="border border-gray-300 p-3">Роторна машинка</td>
                                        <td className="border border-gray-300 p-3">Для важкодоступних місць</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </section>

                    <section className="bg-gray-50 p-8 rounded-xl border border-gray-200">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">Підсумок</h2>
                        <p className="mb-6">
                            Полірування авто — це комплексний процес, який потребує знань, досвіду та якісних матеріалів.
                            Якщо ви шукаєте, як правильно полірувати машину або чим полірувати авто, враховуйте,
                            що професійне обладнання та фахівці здатні зробити це ідеально.
                        </p>
                        <p className="font-semibold text-lg text-gray-900 mb-6">
                            Звертайтеся до Detailing 4K, і ми зробимо ваш автомобіль бездоганним!
                        </p>

                        <div className="flex gap-4 flex-wrap">
                            <Link
                                href="/booking"
                                className="bg-primary-500 text-black px-8 py-3 rounded-lg font-semibold hover:bg-primary-400 transition-colors"
                            >
                                Записатися на полірування
                            </Link>
                            <Link
                                href="/services"
                                className="bg-black text-white px-8 py-3 rounded-lg font-semibold hover:bg-gray-900 transition-colors"
                            >
                                Переглянути послуги
                            </Link>
                        </div>
                    </section>
                </div>
            </article>
        </div>
    )
}
