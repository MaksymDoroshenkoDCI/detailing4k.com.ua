'use client'

import { useState } from 'react'

export default function ConsultantWidget() {
    const [isOpen, setIsOpen] = useState(false)
    const [showForm, setShowForm] = useState(false)
    const [formData, setFormData] = useState({ name: '', phone: '' })
    const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')

    const toggleMenu = () => {
        setIsOpen(!isOpen)
        setShowForm(false)
        setStatus('idle')
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setStatus('submitting')

        try {
            const res = await fetch('/api/consultation', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            })

            if (!res.ok) throw new Error('Error')

            setStatus('success')
            setFormData({ name: '', phone: '' })

            // Auto close after success
            setTimeout(() => {
                setIsOpen(false)
                setShowForm(false)
                setStatus('idle')
            }, 3000)
        } catch (error) {
            setStatus('error')
        }
    }

    // Icons (Inline SVGs)
    const ChatIcon = () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
        </svg>
    )

    const XIcon = () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
    )

    const PhoneIcon = () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
        </svg>
    )

    const SendIcon = () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="22" y1="2" x2="11" y2="13"></line>
            <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
        </svg>
    )

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-4">

            {/* Menu Content */}
            {isOpen && (
                <div className="bg-white rounded-lg shadow-xl p-4 w-72 mb-2 animate-in slide-in-from-bottom-5 fade-in duration-200">

                    {!showForm ? (
                        <div className="flex flex-col gap-3">
                            <div className="text-center mb-2">
                                <p className="font-bold text-gray-800">Потрібна консультація?</p>
                                <p className="text-xs text-gray-500">Ми завжди на зв'язку!</p>
                            </div>

                            <a
                                href="tel:+380989946178"
                                className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors text-gray-700 font-medium"
                            >
                                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                                    <PhoneIcon />
                                </div>
                                +38 098 994 6178
                            </a>

                            <a
                                href="https://t.me/Detaling_4k"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors text-gray-700 font-medium"
                            >
                                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-500">
                                    <SendIcon />
                                </div>
                                Написати в Telegram
                            </a>

                            <button
                                onClick={() => setShowForm(true)}
                                className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors text-gray-700 font-medium w-full text-left"
                            >
                                <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-600">
                                    <span className="font-bold text-lg">?</span>
                                </div>
                                Замовити дзвінок
                            </button>
                        </div>
                    ) : (
                        <div>
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="font-bold text-gray-800">Замовити дзвінок</h3>
                                <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600">
                                    <span className="text-sm">← Назад</span>
                                </button>
                            </div>

                            {status === 'success' ? (
                                <div className="text-center py-4">
                                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2 text-green-600">✓</div>
                                    <p className="text-green-600 font-medium">Дякуємо! <br /> Ми зателефонуємо вам найближчим часом.</p>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                                    <input
                                        type="text"
                                        placeholder="Ваше ім'я"
                                        required
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-primary-500 outline-none text-gray-900"
                                    />
                                    <input
                                        type="tel"
                                        placeholder="Ваш телефон"
                                        required
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-primary-500 outline-none text-gray-900"
                                    />
                                    {status === 'error' && <p className="text-red-500 text-xs">Виникла помилка. Спробуйте ще раз.</p>}

                                    <button
                                        type="submit"
                                        disabled={status === 'submitting'}
                                        className="w-full bg-black text-white py-2 rounded-md font-medium hover:bg-gray-800 transition-colors disabled:bg-gray-400"
                                    >
                                        {status === 'submitting' ? 'Відправка...' : 'Чекаю дзвінка'}
                                    </button>
                                </form>
                            )}
                        </div>
                    )}
                </div>
            )}

            {/* Toggle Button */}
            <button
                onClick={toggleMenu}
                className="w-14 h-14 bg-primary-500 hover:bg-primary-400 text-black rounded-full shadow-lg flex items-center justify-center transition-transform hover:scale-105 active:scale-95"
            >
                {isOpen ? <XIcon /> : <ChatIcon />}
            </button>
        </div>
    )
}
