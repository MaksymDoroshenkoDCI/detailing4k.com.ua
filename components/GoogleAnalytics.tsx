// Додайте цей код в <head> секцію вашого layout.tsx після налаштування Google Search Console

// 1. Спочатку зареєструйте сайт в Google Search Console: https://search.google.com/search-console
// 2. Оберіть метод верифікації "HTML tag"
// 3. Скопіюйте код верифікації
// 4. Додайте його в metadata.verification.google в app/layout.tsx

// Приклад:
// export const metadata: Metadata = {
//   ...
//   verification: {
//     google: 'ваш-код-верифікації-тут',
//   },
// }

// Google Analytics 4 Setup
// Додайте цей компонент в app/layout.tsx

import Script from 'next/script'

export function GoogleAnalytics({ GA_MEASUREMENT_ID }: { GA_MEASUREMENT_ID: string }) {
    return (
        <>
            <Script
                strategy="afterInteractive"
                src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
            />
            <Script
                id="google-analytics"
                strategy="afterInteractive"
                dangerouslySetInnerHTML={{
                    __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_MEASUREMENT_ID}', {
              page_path: window.location.pathname,
            });
          `,
                }}
            />
        </>
    )
}

// Використання в layout.tsx:
// import { GoogleAnalytics } from '@/components/GoogleAnalytics'
// 
// export default function RootLayout({ children }) {
//   return (
//     <html lang="uk">
//       <head>
//         <StructuredData />
//         {process.env.NEXT_PUBLIC_GA_ID && (
//           <GoogleAnalytics GA_MEASUREMENT_ID={process.env.NEXT_PUBLIC_GA_ID} />
//         )}
//       </head>
//       <body>
//         {children}
//       </body>
//     </html>
//   )
// }

// Додайте в .env.local:
// NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX

// Кроки для налаштування:
// 1. Створіть акаунт Google Analytics 4: https://analytics.google.com/
// 2. Створіть новий property для вашого сайту
// 3. Отримайте Measurement ID (формат: G-XXXXXXXXXX)
// 4. Додайте його в .env.local
// 5. Розкоментуйте код вище в layout.tsx
