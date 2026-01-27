import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export const alt = 'Detailing 4K - Професійний авто детейлінг у Києві'
export const size = {
    width: 1200,
    height: 630,
}

export const contentType = 'image/png'

export default async function Image() {
    return new ImageResponse(
        (
            <div
                style={{
                    background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 50%, #1a1a1a 100%)',
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '40px',
                }}
            >
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <h1
                        style={{
                            fontSize: 72,
                            fontWeight: 'bold',
                            background: 'linear-gradient(90deg, #FFD700 0%, #FFA500 100%)',
                            backgroundClip: 'text',
                            color: 'transparent',
                            margin: 0,
                            padding: 0,
                            textAlign: 'center',
                        }}
                    >
                        Detailing 4K
                    </h1>
                    <p
                        style={{
                            fontSize: 36,
                            color: '#ffffff',
                            margin: '20px 0 0 0',
                            textAlign: 'center',
                        }}
                    >
                        Професійний авто детейлінг у Києві
                    </p>
                    <div
                        style={{
                            display: 'flex',
                            gap: '30px',
                            marginTop: '40px',
                            fontSize: 24,
                            color: '#FFD700',
                        }}
                    >
                        <span>⭐ Полірування</span>
                        <span>💎 Керамічне покриття</span>
                        <span>✨ Хімчистка</span>
                    </div>
                </div>
            </div>
        ),
        {
            ...size,
        }
    )
}
