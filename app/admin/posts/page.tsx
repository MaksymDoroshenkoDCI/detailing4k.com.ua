'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

interface Post {
    id: string
    slug: string
    title: string
    content: string
    excerpt: string | null
    imageUrl: string | null
    published: boolean
    createdAt: string
    updatedAt: string
}

export default function AdminPostsPage() {
    const router = useRouter()
    const [posts, setPosts] = useState<Post[]>([])
    const [loading, setLoading] = useState(true)
    const [showForm, setShowForm] = useState(false)
    const [editingPost, setEditingPost] = useState<Post | null>(null)
    const [formData, setFormData] = useState({
        title: '',
        slug: '',
        content: '',
        excerpt: '',
        imageUrl: '',
        published: false,
    })
    const [uploadingImage, setUploadingImage] = useState(false)
    const [imagePreview, setImagePreview] = useState<string | null>(null)

    useEffect(() => {
        fetch('/api/auth/me')
            .then((res) => res.json())
            .then((data) => {
                if (!data.user || !data.user.role) {
                    router.push('/login?isAdmin=true')
                } else {
                    fetchPosts()
                }
            })
    }, [router])

    const fetchPosts = () => {
        fetch('/api/admin/posts')
            .then((res) => res.json())
            .then((data) => {
                setPosts(data)
                setLoading(false)
            })
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        const url = editingPost
            ? `/api/admin/posts/${editingPost.id}`
            : '/api/admin/posts'
        const method = editingPost ? 'PATCH' : 'POST'

        if (!formData.title || !formData.slug || !formData.content) {
            alert('Будь ласка, заповніть всі обов\'язкові поля')
            return
        }

        try {
            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            })

            if (response.ok) {
                fetchPosts()
                setShowForm(false)
                setEditingPost(null)
                setFormData({
                    title: '',
                    slug: '',
                    content: '',
                    excerpt: '',
                    imageUrl: '',
                    published: false,
                })
                setImagePreview(null)
            } else {
                const errorData = await response.json()
                alert(errorData.error || 'Помилка при збереженні статті')
            }
        } catch (error) {
            alert('Помилка при збереженні статті')
        }
    }

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        if (!file.type.startsWith('image/')) {
            alert('Будь ласка, виберіть файл зображення')
            return
        }

        setUploadingImage(true)

        try {
            const formDataToUpload = new FormData()
            formDataToUpload.append('file', file)

            const response = await fetch('/api/upload', {
                method: 'POST',
                body: formDataToUpload,
            })

            if (!response.ok) throw new Error('Upload failed')

            const data = await response.json()
            setFormData((prev) => ({ ...prev, imageUrl: data.url }))
            setImagePreview(data.url)
        } catch (error) {
            console.error('Error uploading image:', error)
            alert('Помилка при завантаженні зображення')
        } finally {
            setUploadingImage(false)
        }
    }

    const handleEdit = (post: Post) => {
        setEditingPost(post)
        setFormData({
            title: post.title,
            slug: post.slug,
            content: post.content,
            excerpt: post.excerpt || '',
            imageUrl: post.imageUrl || '',
            published: post.published,
        })
        setImagePreview(post.imageUrl)
        setShowForm(true)
    }

    const handleDelete = async (id: string) => {
        if (!confirm('Ви впевнені, що хочете видалити цю статтю?')) return

        try {
            const response = await fetch(`/api/admin/posts/${id}`, {
                method: 'DELETE',
            })

            if (response.ok) {
                fetchPosts()
            } else {
                alert('Помилка при видаленні статті')
            }
        } catch (error) {
            alert('Помилка при видаленні статті')
        }
    }

    const generateSlug = (title: string) => {
        return title
            .toLowerCase()
            .trim()
            .replace(/[^\w\s-]/g, '')
            .replace(/[\s_-]+/g, '-')
            .replace(/^-+|-+$/g, '')
    }

    if (loading) return <div className="p-8 text-center">Завантаження...</div>

    return (
        <div className="container mx-auto max-w-6xl px-4 py-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">Керування статтями (Автодогляд)</h1>
                <button
                    onClick={() => {
                        setShowForm(!showForm)
                        setEditingPost(null)
                        setFormData({
                            title: '',
                            slug: '',
                            content: '',
                            excerpt: '',
                            imageUrl: '',
                            published: false,
                        })
                        setImagePreview(null)
                    }}
                    className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition-colors"
                >
                    {showForm ? 'Скасувати' : '+ Нова стаття'}
                </button>
            </div>

            {showForm && (
                <div className="bg-white rounded-lg shadow-md p-6 mb-8 border border-gray-200">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-1 text-gray-900">Заголовок *</label>
                            <input
                                type="text"
                                value={formData.title}
                                onChange={(e) => {
                                    const title = e.target.value
                                    setFormData({
                                        ...formData,
                                        title,
                                        slug: editingPost ? formData.slug : generateSlug(title)
                                    })
                                }}
                                className="w-full px-4 py-2 border rounded-lg text-gray-900"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1 text-gray-900">Slug (URL) *</label>
                            <input
                                type="text"
                                value={formData.slug}
                                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                                className="w-full px-4 py-2 border rounded-lg text-gray-900"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1 text-gray-900">Короткий опис (витяг)</label>
                            <textarea
                                value={formData.excerpt}
                                onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                                rows={2}
                                className="w-full px-4 py-2 border rounded-lg text-gray-900"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1 text-gray-900">Зміст (HTML/Текст) *</label>
                            <textarea
                                value={formData.content}
                                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                rows={10}
                                className="w-full px-4 py-2 border rounded-lg text-gray-900 font-mono text-sm"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1 text-gray-900">Зображення</label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageUpload}
                                className="mb-2 block w-full text-sm text-gray-500"
                            />
                            {imagePreview && (
                                <img src={imagePreview} alt="Preview" className="h-32 w-auto object-cover rounded-lg mb-2" />
                            )}
                            <input
                                type="text"
                                placeholder="Або введіть URL зображення"
                                value={formData.imageUrl}
                                onChange={(e) => {
                                    setFormData({ ...formData, imageUrl: e.target.value })
                                    setImagePreview(e.target.value)
                                }}
                                className="w-full px-4 py-2 border rounded-lg text-gray-900 text-sm"
                            />
                        </div>
                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                id="published"
                                checked={formData.published}
                                onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                                className="w-4 h-4 text-primary-600"
                            />
                            <label htmlFor="published" className="text-sm font-medium text-gray-900">Опублікувати</label>
                        </div>
                        <button
                            type="submit"
                            className="bg-primary-600 text-white px-8 py-2 rounded-lg hover:bg-primary-700 transition-colors font-semibold"
                        >
                            {editingPost ? 'Зберегти зміни' : 'Створити статтю'}
                        </button>
                    </form>
                </div>
            )}

            <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="px-6 py-3 text-sm font-semibold text-gray-900">Стаття</th>
                            <th className="px-6 py-3 text-sm font-semibold text-gray-900">Статус</th>
                            <th className="px-6 py-3 text-sm font-semibold text-gray-900 text-right">Дії</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {posts.map((post) => (
                            <tr key={post.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4">
                                    <div className="font-medium text-gray-900">{post.title}</div>
                                    <div className="text-sm text-gray-500">{post.slug}</div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${post.published ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                                        }`}>
                                        {post.published ? 'Опубліковано' : 'Чернетка'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right space-x-2">
                                    <button
                                        onClick={() => handleEdit(post)}
                                        className="text-primary-600 hover:text-primary-900 font-medium"
                                    >
                                        Редагувати
                                    </button>
                                    <button
                                        onClick={() => handleDelete(post.id)}
                                        className="text-red-600 hover:text-red-900 font-medium"
                                    >
                                        Видалити
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {posts.length === 0 && (
                            <tr>
                                <td colSpan={3} className="px-6 py-8 text-center text-gray-500">Статей поки немає</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
