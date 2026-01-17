'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { MapPin, Star, Calendar, Shield, User, Phone, Mail, Edit } from 'lucide-react'
import { formatCurrency, formatDate, calculateDays } from '@/lib/utils'
import toast from 'react-hot-toast'

interface Item {
  id: number
  name: string
  description: string
  category: string
  location: string
  deposit_amount: number
  daily_rate: number
  image_url: string
  owner_id: number
  owner_name: string
  owner_email: string
  owner_phone: string
  owner_reputation: number
  owner_verified: number
}

export default function ItemDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [item, setItem] = useState<Item | null>(null)
  const [loading, setLoading] = useState(true)
  const [bookingDates, setBookingDates] = useState({
    startDate: '',
    endDate: ''
  })
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isOwner, setIsOwner] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('token')
    setIsLoggedIn(!!token)
    fetchItem()
  }, [])

  const fetchItem = async () => {
    try {
      const response = await fetch(`/api/items/${params.id}`)
      const data = await response.json()
      if (response.ok) {
        setItem(data)
        const userId = parseInt(localStorage.getItem('userId') || '0')
        setIsOwner(data.owner_id === userId)
      } else {
        toast.error(data.error || 'Gagal memuat data barang')
      }
    } catch (error) {
      toast.error('Terjadi kesalahan')
    } finally {
      setLoading(false)
    }
  }

  const handleBooking = async () => {
    if (!isLoggedIn) {
      toast.error('Silakan login terlebih dahulu')
      router.push('/login')
      return
    }

    if (!bookingDates.startDate || !bookingDates.endDate) {
      toast.error('Pilih tanggal peminjaman')
      return
    }

    if (new Date(bookingDates.startDate) >= new Date(bookingDates.endDate)) {
      toast.error('Tanggal akhir harus setelah tanggal mulai')
      return
    }

    const token = localStorage.getItem('token')
    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          itemId: item?.id,
          startDate: bookingDates.startDate,
          endDate: bookingDates.endDate
        })
      })

      const data = await response.json()

      if (response.ok) {
        const days = calculateDays(bookingDates.startDate, bookingDates.endDate)
        const rentalFee = days * item.daily_rate
        const totalPayment = item.deposit_amount + rentalFee
        
        toast.success('Permintaan peminjaman berhasil dibuat! Silakan bayar deposit dan biaya sewa.')
        router.push(`/payment?type=deposit&amount=${totalPayment}&description=Deposit dan Sewa: ${item.name}&relatedId=${data.bookingId}`)
      } else {
        toast.error(data.error || 'Gagal membuat peminjaman')
      }
    } catch (error) {
      toast.error('Terjadi kesalahan')
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-96 bg-gray-200 rounded-lg mb-6"></div>
          <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    )
  }

  if (!item) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p className="text-gray-600">Barang tidak ditemukan</p>
      </div>
    )
  }

  const days = bookingDates.startDate && bookingDates.endDate
    ? calculateDays(bookingDates.startDate, bookingDates.endDate)
    : 0
  const totalCost = days * item.daily_rate

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <div className="bg-gray-200 rounded-lg h-96 flex items-center justify-center">
            {item.image_url ? (
              <img src={item.image_url} alt={item.name} className="w-full h-full object-cover rounded-lg" />
            ) : (
              <div className="text-gray-400 text-center">
                <p>Tidak ada gambar</p>
              </div>
            )}
          </div>
        </div>

        <div>
          <div className="flex justify-between items-start mb-4">
            <h1 className="text-4xl font-bold">{item.name}</h1>
            {isOwner && (
              <Link
                href={`/items/${item.id}/edit`}
                className="flex items-center gap-2 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition"
              >
                <Edit className="w-4 h-4" />
                Edit
              </Link>
            )}
          </div>
          <div className="flex items-center gap-2 mb-4">
            <span className="bg-primary-100 text-primary-800 px-3 py-1 rounded-full text-sm">
              {item.category}
            </span>
          </div>

          <p className="text-gray-700 mb-6">{item.description}</p>

          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <User className="w-5 h-5" />
              Informasi Pemilik
            </h3>
            <div className="space-y-2 text-sm">
              <p className="flex items-center gap-2">
                <span className="font-medium">Nama:</span> {item.owner_name}
                {item.owner_verified === 1 && (
                  <span className="bg-green-100 text-green-800 px-2 py-0.5 rounded text-xs">
                    Terverifikasi
                  </span>
                )}
              </p>
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 text-yellow-500" />
                <span className="font-medium">Reputasi:</span> {item.owner_reputation}/200
              </div>
              {item.owner_phone && (
                <p className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  {item.owner_phone}
                </p>
              )}
              {item.owner_email && (
                <p className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  {item.owner_email}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 text-gray-600 mb-6">
            <MapPin className="w-5 h-5" />
            <span>{item.location}</span>
          </div>

          <div className="bg-primary-50 rounded-lg p-6 mb-6">
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>Deposit:</span>
                <span className="font-semibold">{formatCurrency(item.deposit_amount)}</span>
              </div>
              <div className="flex justify-between">
                <span>Tarif Harian:</span>
                <span className="font-semibold">{formatCurrency(item.daily_rate)}</span>
              </div>
              <div className="border-t pt-3 flex justify-between font-bold text-lg">
                <span>Total (untuk {days} hari):</span>
                <span className="text-primary-600">
                  {totalCost > 0 ? formatCurrency(totalCost) : '-'}
                </span>
              </div>
            </div>
          </div>

          {isLoggedIn && (
            <div className="bg-white border rounded-lg p-6 mb-6">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Pilih Tanggal Peminjaman
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Tanggal Mulai</label>
                  <input
                    type="date"
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    value={bookingDates.startDate}
                    onChange={(e) => setBookingDates({ ...bookingDates, startDate: e.target.value })}
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Tanggal Akhir</label>
                  <input
                    type="date"
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    value={bookingDates.endDate}
                    onChange={(e) => setBookingDates({ ...bookingDates, endDate: e.target.value })}
                    min={bookingDates.startDate || new Date().toISOString().split('T')[0]}
                  />
                </div>
              </div>
            </div>
          )}

          {isLoggedIn ? (
            <button
              onClick={handleBooking}
              className="w-full bg-primary-600 text-white py-3 rounded-lg font-semibold hover:bg-primary-700 transition flex items-center justify-center gap-2"
            >
              <Shield className="w-5 h-5" />
              Pinjam Sekarang (Deposit: {formatCurrency(item.deposit_amount)})
            </button>
          ) : (
            <button
              onClick={() => router.push('/login')}
              className="w-full bg-primary-600 text-white py-3 rounded-lg font-semibold hover:bg-primary-700 transition"
            >
              Login untuk Meminjam
            </button>
          )}

          <div className="mt-4 text-sm text-gray-600 bg-blue-50 p-4 rounded-lg">
            <p className="font-semibold mb-2">Catatan:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Deposit akan dikembalikan setelah barang dikembalikan dalam kondisi baik</li>
              <li>Denda keterlambatan: 10% dari tarif harian per hari</li>
              <li>Pemilik akan menerima notifikasi dan dapat menyetujui/menolak permintaan</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
