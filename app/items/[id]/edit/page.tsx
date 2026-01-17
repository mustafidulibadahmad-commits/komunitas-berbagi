'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { MapPin, DollarSign, Package } from 'lucide-react'
import toast from 'react-hot-toast'

const categories = [
  'Alat Pertukangan',
  'Alat Berkebun',
  'Perabotan',
  'Elektronik',
  'Olahraga',
  'Lainnya'
]

interface Item {
  id: number
  name: string
  description: string
  category: string
  location: string
  deposit_amount: number
  daily_rate: number
  image_url: string
  available: number
  owner_id: number
}

export default function EditItemPage() {
  const params = useParams()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    location: '',
    deposit_amount: '',
    daily_rate: '',
    image_url: '',
    available: true
  })

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      toast.error('Silakan login terlebih dahulu')
      router.push('/login')
      return
    }
    fetchItem()
  }, [])

  const fetchItem = async () => {
    const token = localStorage.getItem('token')
    try {
      const response = await fetch(`/api/items/${params.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      const data = await response.json()

      if (response.ok) {
        // Check if user is the owner
        const userId = parseInt(localStorage.getItem('userId') || '0')
        if (data.owner_id !== userId) {
          toast.error('Anda tidak memiliki izin untuk mengedit barang ini')
          router.push('/dashboard')
          return
        }

        setFormData({
          name: data.name,
          description: data.description,
          category: data.category,
          location: data.location,
          deposit_amount: data.deposit_amount.toString(),
          daily_rate: data.daily_rate.toString(),
          image_url: data.image_url || '',
          available: data.available === 1
        })
      } else {
        toast.error(data.error || 'Gagal memuat data barang')
        router.push('/dashboard')
      }
    } catch (error) {
      toast.error('Terjadi kesalahan')
      router.push('/dashboard')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    const token = localStorage.getItem('token')
    if (!token) {
      toast.error('Silakan login terlebih dahulu')
      router.push('/login')
      return
    }

    try {
      const response = await fetch(`/api/items/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...formData,
          deposit_amount: parseFloat(formData.deposit_amount),
          daily_rate: parseFloat(formData.daily_rate)
        })
      })

      const data = await response.json()

      if (response.ok) {
        toast.success('Barang berhasil diperbarui!')
        router.push('/dashboard')
      } else {
        toast.error(data.error || 'Gagal memperbarui barang')
      }
    } catch (error) {
      toast.error('Terjadi kesalahan')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
          <div className="space-y-4">
            <div className="h-12 bg-gray-200 rounded"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
            <div className="h-12 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-4xl font-bold mb-8">Edit Barang</h1>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">
            Nama Barang *
          </label>
          <input
            type="text"
            required
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            placeholder="Contoh: Bor Listrik, Tangga Lipat, dll"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Deskripsi *
          </label>
          <textarea
            required
            rows={4}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            placeholder="Jelaskan kondisi barang, spesifikasi, dll"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Kategori *
          </label>
          <select
            required
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
          >
            <option value="">Pilih Kategori</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2 flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            Lokasi *
          </label>
          <input
            type="text"
            required
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            placeholder="Contoh: Jakarta Selatan, Bandung, dll"
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
          />
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2 flex items-center gap-2">
              <DollarSign className="w-4 h-4" />
              Deposit (Rp) *
            </label>
            <input
              type="number"
              required
              min="0"
              step="1000"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="50000"
              value={formData.deposit_amount}
              onChange={(e) => setFormData({ ...formData, deposit_amount: e.target.value })}
            />
            <p className="text-xs text-gray-500 mt-1">
              Deposit akan dikembalikan setelah barang dikembalikan
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Tarif Harian (Rp) *
            </label>
            <input
              type="number"
              required
              min="0"
              step="1000"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="10000"
              value={formData.daily_rate}
              onChange={(e) => setFormData({ ...formData, daily_rate: e.target.value })}
            />
            <p className="text-xs text-gray-500 mt-1">
              Tarif per hari peminjaman
            </p>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            URL Gambar (Opsional)
          </label>
          <input
            type="url"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            placeholder="https://example.com/image.jpg"
            value={formData.image_url}
            onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
          />
          <p className="text-xs text-gray-500 mt-1">
            Masukkan URL gambar dari internet
          </p>
        </div>

        <div>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
              checked={formData.available}
              onChange={(e) => setFormData({ ...formData, available: e.target.checked })}
            />
            <span className="text-sm font-medium">Barang Tersedia untuk Dipinjam</span>
          </label>
          <p className="text-xs text-gray-500 mt-1 ml-6">
            Uncheck jika barang sedang tidak tersedia (misalnya sedang diperbaiki)
          </p>
        </div>

        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="flex-1 px-6 py-3 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition"
          >
            Batal
          </button>
          <button
            type="submit"
            disabled={saving}
            className="flex-1 px-6 py-3 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition disabled:opacity-50"
          >
            {saving ? 'Menyimpan...' : 'Simpan Perubahan'}
          </button>
        </div>
      </form>
    </div>
  )
}
