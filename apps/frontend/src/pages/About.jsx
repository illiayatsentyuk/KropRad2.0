export const AboutPage = () => {
    return (
        <div className="w-full px-6 py-12 md:px-8">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl md:text-4xl font-bold text-center text-gray-900">Про KROP‑RAD</h1>
                <p className="mt-4 text-base md:text-lg text-gray-600 text-center">
                KROP-RAD — це ініціатива, що допомагає жителям Кропивницького швидко перевіряти і візуалізувати орієнтовний рівень радіації у своєму районі. За допомогою наших статей користувачі можуть отримати науково обґрунтовані рекомендації з радіаційної безпеки та дізнатися, як зменшити власний вплив радіаційних факторів у повсякденному житті.
                </p>

                <div className="mt-10 space-y-6">
                    <section className="bg-white/90 rounded-2xl shadow-sm ring-1 ring-black/5 p-6 md:p-8">
                        <h2 className="text-xl font-semibold text-gray-900">Мета проєкту</h2>
                        <p className="mt-3 text-gray-700 leading-relaxed">
                            Надати жителям міста доступну та науково обґрунтовану інформацію про рівні радіаційного фону через інтерактивну карту та статті. Проєкт спрямований на підвищення обізнаності та формування безпечної поведінки щодо радіаційних ризиків.
                        </p>
                    </section>

                    <section className="bg-white/90 rounded-2xl shadow-sm ring-1 ring-black/5 p-6 md:p-8">
                        <h2 className="text-xl font-semibold text-gray-900">Як це працює</h2>
                        <ul className="mt-3 list-disc pl-5 text-gray-700 space-y-2">
                            <li>На інтерактивній карті відображаються позначки з орієнтовними показами.</li>
                            <li>Можна наближати район і переглядати актуальні точки вимірювань.</li>
                            <li>Інтерфейс адаптований під мобільні пристрої для швидкого доступу.</li>
                        </ul>
                    </section>

                    <section className="bg-white/90 rounded-2xl shadow-sm ring-1 ring-black/5 p-6 md:p-8">
                        <h2 className="text-xl font-semibold text-gray-900">Як користуватися</h2>
                        <ol className="mt-3 list-decimal pl-5 text-gray-700 space-y-2">
                            <li>Відкрийте карту та знайдіть ваш район.</li>
                            <li>Натисніть на маркер, щоб переглянути деталі.</li>
                            <li>Порівняйте показники у різних точках, щоб скласти загальну картину.</li>
                        </ol>
                    </section>

                    <section className="bg-white/90 rounded-2xl shadow-sm ring-1 ring-black/5 p-6 md:p-8">
                        <h2 className="text-xl font-semibold text-gray-900">Застереження</h2>
                        <p className="mt-3 text-gray-700 leading-relaxed">
                            Дані мають інформативний характер і не є офіційною довідкою. На значення можуть впливати
                            погодні умови, обладнання та інші фактори. За підозри на підвищений рівень — звертайтеся до відповідних служб.
                        </p>
                    </section>

                    <div className="flex items-center justify-center gap-3 md:gap-4 pt-2">
                        <a href="/map" className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-5 py-2.5 text-white font-medium shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                            Відкрити карту
                        </a>
                        <a href="/" className="inline-flex items-center justify-center rounded-xl bg-white px-5 py-2.5 text-gray-800 font-medium shadow-sm ring-1 ring-black/10 hover:bg-gray-50">
                            На головну
                        </a>
                    </div>

                    <p className="mt-8 text-sm text-gray-500 text-center">
                        Сайт розроблений командою КЗ "Ліцею НТН" КМР" — RoboLegion, а саме за участі Яцентюка Іллі. Автором інформаційних матеріалів і статей є учень 11 класу — Попович Максим.
                    </p>
                </div>
            </div>
        </div>
    )
}