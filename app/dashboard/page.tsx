'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Package, Calendar, Star, Bell, Plus, CheckCircle, XCircle, Clock, Edit, Trash2 } from 'lucide-react'
import { formatCurrency, formatDate, isOverdue } from '@/lib/utils'
import toast from 'react-hot-toast'
import Link from 'next/link'

interface Booking {
  id: number
  item_name: string
  item_image: string
  start_date: string
  end_date: string
  status: string
  deposit_amount: number
  owner_name: string
  borrower_name: string
  late_fee: number
}

export default function DashboardPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<'bookings' | 'items' | 'notifications'>('bookings')
  const [bookings, setBookings] = useState<Booking[]>([])
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingItems, setLoadingItems] = useState(false)
  const [userId, setUserId] = useState<number | null>(null)

  useEffect(() => {
    const token = localStorage.getItem('token')
    const id = localStorage.getItem('userId')
    
    if (!token || !id) {
      router.push('/login')
      return
    }

    setUserId(parseInt(id))
    fetchBookings()
    fetchMyItems()
  }, [])

  const fetchMyItems = async () => {
    const token = localStorage.getItem('token')
    if (!token) return
    
    setLoadingItems(true)
    try {
      const response = await fetch('/api/items/my', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      const data = await response.json()
      if (response.ok) {
        setItems(data)
      }
    } catch (error) {
      console.error('Error fetching items:', error)
    } finally {
      setLoadingItems(false)
    }
  }

  const fetchBookings = async () => {
    const token = localStorage.getItem('token')
    try {
      const response = await fetch('/api/bookings', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      const data = await response.json()
      if (response.ok) {
        setBookings(data)
      }
    } catch (error) {
      console.error('Error fetching bookings:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleApproveBooking = async (bookingId: number) => {
    const token = localStorage.getItem('token')
    try {
      const response = await fetch(`/api/bookings/${bookingId}/approve`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      const data = await response.json()
      if (response.ok) {
        toast.success('Peminjaman disetujui')
        fetchBookings()
      } else {
        toast.error(data.error || 'Gagal menyetujui')
      }
    } catch (error) {
      toast.error('Terjadi kesalahan')
    }
  }

  const handleRejectBooking = async (bookingId: number) => {
    const token = localStorage.getItem('token')
    try {
      const response = await fetch(`/api/bookings/${bookingId}/reject`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      const data = await response.json()
      if (response.ok) {
        toast.success('Peminjaman ditolak')
        fetchBookings()
      } else {
        toast.error(data.error || 'Gagal menolak')
      }
    } catch (error) {
      toast.error('Terjadi kesalahan')
    }
  }

  const handleReturnItem = async (bookingId: number) => {
    const token = localStorage.getItem('token')
    try {
      const response = await fetch(`/api/bookings/${bookingId}/return`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      const data = await response.json()
      if (response.ok) {
        toast.success('Barang dikembalikan, deposit akan dikembalikan')
        fetchBookings()
      } else {
        toast.error(data.error || 'Gagal mengembalikan')
      }
    } catch (error) {
      toast.error('Terjadi kesalahan')
    }
  }

  const getStatusBadge = (status: string, endDate: string, startDate: string) => {
    const now = new Date()
    const start = new Date(startDate)
    const end = new Date(endDate)
    const overdue = now > end && (status === 'active' || status === 'approved')
    const notStarted = now < start && status === 'approved'
    
    switch (status) {
      case 'pending':
        return <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs">Menunggu Persetujuan</span>
      case 'approved':
        if (notStarted) {
          return <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">Disetujui - Belum Dimulai</span>
        }
        return overdue 
          ? <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs">Terlambat</span>
          : <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">Aktif</span>
      case 'active':
        return overdue 
          ? <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs">Terlambat</span>
          : <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">Aktif</span>
      case 'completed':
        return <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-xs">Selesai</span>
      case 'rejected':
        return <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs">Ditolak</span>
      default:
        return <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-xs">{status}</span>
    }
  }

    const userName = localStorage.getItem('userName')
    const borrowedBookings = bookings.filter(b => b.borrower_name === userName)
    const lentBookings = bookings.filter(b => b.owner_name === userName)

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">Dashboard</h1>
        <Link
          href="/items/new"
          className="bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Daftarkan Barang
        </Link>
      </div>

      <div className="flex gap-4 mb-8 border-b">
        <button
          onClick={() => setActiveTab('bookings')}
          className={`pb-4 px-4 font-semibold transition ${
            activeTab === 'bookings'
              ? 'text-primary-600 border-b-2 border-primary-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <Calendar className="w-5 h-5 inline mr-2" />
          Peminjaman
        </button>
        <button
          onClick={() => setActiveTab('items')}
          className={`pb-4 px-4 font-semibold transition ${
            activeTab === 'items'
              ? 'text-primary-600 border-b-2 border-primary-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <Package className="w-5 h-5 inline mr-2" />
          Barang Saya
        </button>
        <button
          onClick={() => setActiveTab('notifications')}
          className={`pb-4 px-4 font-semibold transition ${
            activeTab === 'notifications'
              ? 'text-primary-600 border-b-2 border-primary-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <Bell className="w-5 h-5 inline mr-2" />
          Notifikasi
        </button>
      </div>

      {activeTab === 'bookings' && (
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-semibold mb-4">Barang yang Saya Pinjam</h2>
            {borrowedBookings.length === 0 ? (
              <div className="bg-white rounded-lg shadow p-8 text-center text-gray-600">
                <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <p>Belum ada peminjaman</p>
              </div>
            ) : (
              <div className="space-y-4">
                {borrowedBookings.map((booking) => (
                  <div key={booking.id} className="bg-white rounded-lg shadow p-6">
                    <div className="flex gap-6">
                      <div className="w-24 h-24 bg-gray-200 rounded-lg flex items-center justify-center">
                        {booking.item_image ? (
                          <img src={booking.item_image} alt={booking.item_name} className="w-full h-full object-cover rounded-lg" />
                        ) : (
                          <Package className="w-8 h-8 text-gray-400" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="text-xl font-semibold">{booking.item_name}</h3>
                          {getStatusBadge(booking.status, booking.end_date, booking.start_date)}
                        </div>
                        <p className="text-gray-600 mb-2">Dari: {booking.owner_name}</p>
                        <div className="flex gap-4 text-sm text-gray-600 mb-4">
                          <span>Mulai: {formatDate(booking.start_date)}</span>
                          <span>Berakhir: {formatDate(booking.end_date)}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="text-sm text-gray-600">Deposit: {formatCurrency(booking.deposit_amount)}</p>
                            {booking.late_fee > 0 && (
                              <p className="text-sm text-red-600">Denda: {formatCurrency(booking.late_fee)}</p>
                            )}
                          </div>
                          {(booking.status === 'active' || booking.status === 'approved') && (
                            <button
                              onClick={() => handleReturnItem(booking.id)}
                              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
                            >
                              Kembalikan Barang
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-4">Barang yang Dipinjamkan</h2>
            {lentBookings.length === 0 ? (
              <div className="bg-white rounded-lg shadow p-8 text-center text-gray-600">
                <Package className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <p>Belum ada yang meminjam barang Anda</p>
              </div>
            ) : (
              <div className="space-y-4">
                {lentBookings.map((booking) => (
                  <div key={booking.id} className="bg-white rounded-lg shadow p-6">
                    <div className="flex gap-6">
                      <div className="w-24 h-24 bg-gray-200 rounded-lg flex items-center justify-center">
                        {booking.item_image ? (
                          <img src={booking.item_image} alt={booking.item_name} className="w-full h-full object-cover rounded-lg" />
                        ) : (
                          <Package className="w-8 h-8 text-gray-400" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="text-xl font-semibold">{booking.item_name}</h3>
                          {getStatusBadge(booking.status, booking.end_date, booking.start_date)}
                        </div>
                        <p className="text-gray-600 mb-2">Dipinjam oleh: {booking.borrower_name}</p>
                        <div className="flex gap-4 text-sm text-gray-600 mb-4">
                          <span>Mulai: {formatDate(booking.start_date)}</span>
                          <span>Berakhir: {formatDate(booking.end_date)}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="text-sm text-gray-600">Deposit: {formatCurrency(booking.deposit_amount)}</p>
                          </div>
                          {booking.status === 'pending' && (
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleApproveBooking(booking.id)}
                                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition flex items-center gap-2"
                              >
                                <CheckCircle className="w-4 h-4" />
                                Setujui
                              </button>
                              <button
                                onClick={() => handleRejectBooking(booking.id)}
                                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition flex items-center gap-2"
                              >
                                <XCircle className="w-4 h-4" />
                                Tolak
                              </button>
                            </div>
                          )}
                          {(booking.status === 'active' || booking.status === 'approved') && (
                            <span className="text-sm text-gray-600">Menunggu pengembalian</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'items' && (
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold">Barang Saya</h2>
            <Link
              href="/items/new"
              className="bg-primary-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-primary-700 transition flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Tambah Barang
            </Link>
          </div>
          
          {loadingItems ? (
            <div className="grid md:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-lg shadow p-6 animate-pulse">
                  <div className="h-48 bg-gray-200 rounded mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                </div>
              ))}
            </div>
          ) : items.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-8 text-center text-gray-600">
              <Package className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <p className="mb-4">Belum ada barang yang didaftarkan</p>
              <Link
                href="/items/new"
                className="inline-block bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition"
              >
                Daftarkan Barang Pertama
              </Link>
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-6">
              {items.map((item) => (
                <div key={item.id} className="bg-white rounded-lg shadow overflow-hidden">
                  <div className="h-48 bg-gray-200 flex items-center justify-center">
                    {item.image_url ? (
                      <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
                    ) : (
                      <Package className="w-16 h-16 text-gray-400" />
                    )}
                  </div>
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-xl font-semibold">{item.name}</h3>
                      <span className={`px-2 py-1 rounded text-xs ${
                        item.available === 1 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {item.available === 1 ? 'Tersedia' : 'Tidak Tersedia'}
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">{item.description}</p>
                    <div className="flex justify-between items-center mb-4">
                      <div>
                        <p className="text-xs text-gray-500">Deposit</p>
                        <p className="font-semibold text-primary-600">{formatCurrency(item.deposit_amount)}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-500">Harian</p>
                        <p className="font-semibold">{formatCurrency(item.daily_rate)}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Link
                        href={`/items/${item.id}/edit`}
                        className="flex-1 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition flex items-center justify-center gap-2 text-sm"
                      >
                        <Edit className="w-4 h-4" />
                        Edit
                      </Link>
                      <Link
                        href={`/items/${item.id}`}
                        className="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition text-sm text-center"
                      >
                        Lihat
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'notifications' && (
        <div>
          <p className="text-gray-600">Fitur ini akan segera hadir</p>
        </div>
      )}
    </div>
  )
}
