export default function StructuredData() {
    const structuredData = {
        '@context': 'https://schema.org',
        '@type': 'AutoRepair',
        name: 'Detailing 4K',
        image: 'https://detailing4k.com.ua/logo.png',
        '@id': 'https://detailing4k.com.ua',
        url: 'https://detailing4k.com.ua',
        telephone: '+380989946178',
        priceRange: '$$',
        address: {
            '@type': 'PostalAddress',
            streetAddress: 'вул. Володимира Брожка 38/58',
            addressLocality: 'Київ',
            addressRegion: 'Київська область',
            addressCountry: 'UA'
        },
        geo: {
            '@type': 'GeoCoordinates',
            latitude: 50.4119396,
            longitude: 30.509576
        },
        openingHoursSpecification: [
            {
                '@type': 'OpeningHoursSpecification',
                dayOfWeek: [
                    'Monday',
                    'Tuesday',
                    'Wednesday',
                    'Thursday',
                    'Friday'
                ],
                opens: '09:00',
                closes: '18:00'
            },
            {
                '@type': 'OpeningHoursSpecification',
                dayOfWeek: 'Saturday',
                opens: '10:00',
                closes: '16:00'
            }
        ],
        sameAs: [
            'https://t.me/Detaling_4k'
        ],
        aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: '4.9',
            reviewCount: '50'
        },
        hasOfferCatalog: {
            '@type': 'OfferCatalog',
            name: 'Послуги детейлінгу',
            itemListElement: [
                {
                    '@type': 'Offer',
                    itemOffered: {
                        '@type': 'Service',
                        name: 'Полірування кузова',
                        description: 'Професійне полірування автомобіля для відновлення блиску'
                    }
                },
                {
                    '@type': 'Offer',
                    itemOffered: {
                        '@type': 'Service',
                        name: 'Керамічне покриття',
                        description: 'Захист кузова керамічним покриттям'
                    }
                },
                {
                    '@type': 'Offer',
                    itemOffered: {
                        '@type': 'Service',
                        name: 'Хімчистка салону',
                        description: 'Глибоке чищення салону автомобіля'
                    }
                },
                {
                    '@type': 'Offer',
                    itemOffered: {
                        '@type': 'Service',
                        name: 'Детейлінг фар',
                        description: 'Полірування та відновлення прозорості фар'
                    }
                }
            ]
        }
    }

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
    )
}
