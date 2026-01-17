'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Package, MapPin, DollarSign } from 'lucide-react'
import toast from 'react-hot-toast'

const categories = [
  'Alat Pertukangan',
  'Alat Berkebun',
  'Perabotan',
  'Elektronik',
  'Olahraga',
  'Lainnya'
]

export default function NewItemPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    location: '',
    deposit_amount: '',
    daily_rate: '',
    image_url: ''
  })

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      toast.error('Silakan login terlebih dahulu')
      router.push('/login')
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const token = localStorage.getItem('token')
    if (!token) {
      toast.error('Silakan login terlebih dahulu')
      router.push('/login')
      return
    }

    try {
      const response = await fetch('/api/items', {
        method: 'POST',
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
        if (data.listingFee && data.listingFee > 0) {
          toast.success('Barang berhasil didaftarkan! Silakan bayar biaya listing.')
          router.push(`/payment?type=listing_fee&amount=${data.listingFee}&description=Biaya Listing Barang&relatedId=${data.itemId}`)
        } else {
          toast.success('Barang berhasil didaftarkan!')
          router.push('/dashboard')
        }
      } else {
        toast.error(data.error || 'Gagal mendaftarkan barang')
      }
    } catch (error) {
      toast.error('Terjadi kesalahan')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-4xl font-bold mb-8">Daftarkan Barang Baru</h1>

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

        <div className="bg-blue-50 p-4 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>Catatan:</strong> Setelah barang didaftarkan, Anda akan menerima notifikasi 
            ketika ada yang ingin meminjam. Anda dapat menyetujui atau menolak permintaan tersebut.
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
            disabled={loading}
            className="flex-1 px-6 py-3 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition disabled:opacity-50"
          >
            {loading ? 'Mendaftarkan...' : 'Daftarkan Barang'}
          </button>
        </div>
      </form>
    </div>
  )
}
