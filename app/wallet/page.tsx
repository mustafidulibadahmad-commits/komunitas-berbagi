'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Wallet, Plus, ArrowUpRight, ArrowDownLeft, History, CreditCard } from 'lucide-react'
import { formatCurrency, formatDateTime } from '@/lib/utils'
import toast from 'react-hot-toast'
import Link from 'next/link'

interface WalletData {
  balance: number
  userId: number
}

interface RecentTransaction {
  id: number
  type: string
  amount: number
  description: string
  status: string
  created_at: string
}

export default function WalletPage() {
  const router = useRouter()
  const [wallet, setWallet] = useState<WalletData | null>(null)
  const [loading, setLoading] = useState(true)
  const [topUpAmount, setTopUpAmount] = useState('')
  const [showTopUp, setShowTopUp] = useState(false)
  const [recentTransactions, setRecentTransactions] = useState<RecentTransaction[]>([])

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/login')
      return
    }
    fetchWallet()
    fetchRecentTransactions()
  }, [])

  const fetchWallet = async () => {
    const token = localStorage.getItem('token')
    try {
      const response = await fetch('/api/payments/wallet', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      const data = await response.json()
      if (response.ok) {
        setWallet(data)
      } else {
        toast.error(data.error || 'Gagal memuat data wallet')
      }
    } catch (error) {
      toast.error('Terjadi kesalahan')
    } finally {
      setLoading(false)
    }
  }

  const fetchRecentTransactions = async () => {
    const token = localStorage.getItem('token')
    try {
      const response = await fetch('/api/payments/transactions?limit=5', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      const data = await response.json()
      if (response.ok) {
        setRecentTransactions(data)
      }
    } catch (error) {
      console.error('Error fetching transactions:', error)
    }
  }

  const handleTopUp = async () => {
    const amount = parseFloat(topUpAmount)
    if (isNaN(amount) || amount <= 0) {
      toast.error('Masukkan jumlah yang valid')
      return
    }

    if (amount < 10000) {
      toast.error('Minimum top up adalah Rp 10.000')
      return
    }

    const token = localStorage.getItem('token')
    try {
      const response = await fetch('/api/payments/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          type: 'topup',
          amount: amount,
          description: `Top Up Wallet`,
          paymentMethod: 'gateway'
        })
      })

      const data = await response.json()

      if (response.ok) {
        toast.success('Top up berhasil!')
        setTopUpAmount('')
        setShowTopUp(false)
        fetchWallet()
        fetchRecentTransactions()
      } else {
        toast.error(data.error || 'Top up gagal')
      }
    } catch (error) {
      toast.error('Terjadi kesalahan')
    }
  }

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'deposit':
      case 'listing_fee':
      case 'rental':
        return <ArrowDownLeft className="w-5 h-5 text-red-500" />
      case 'refund':
      case 'topup':
        return <ArrowUpRight className="w-5 h-5 text-green-500" />
      default:
        return <CreditCard className="w-5 h-5 text-gray-500" />
    }
  }

  const getTransactionTypeLabel = (type: string) => {
    switch (type) {
      case 'deposit': return 'Deposit Peminjaman'
      case 'listing_fee': return 'Biaya Listing'
      case 'rental': return 'Biaya Sewa'
      case 'refund': return 'Pengembalian Deposit'
      case 'topup': return 'Top Up Wallet'
      default: return type
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">Selesai</span>
      case 'pending':
        return <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs">Menunggu</span>
      case 'failed':
        return <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs">Gagal</span>
      default:
        return <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-xs">{status}</span>
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-32 bg-gray-200 rounded-lg mb-6"></div>
          <div className="h-64 bg-gray-200 rounded-lg"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8">Wallet</h1>

      <div className="bg-gradient-to-r from-primary-600 to-primary-800 rounded-lg shadow-lg p-8 text-white mb-8">
        <div className="flex justify-between items-start mb-6">
          <div>
            <p className="text-primary-100 mb-2">Saldo Wallet</p>
            <h2 className="text-5xl font-bold">
              {wallet ? formatCurrency(wallet.balance) : formatCurrency(0)}
            </h2>
          </div>
          <Wallet className="w-16 h-16 opacity-80" />
        </div>
        <button
          onClick={() => setShowTopUp(!showTopUp)}
          className="bg-white text-primary-600 px-6 py-3 rounded-lg font-semibold hover:bg-primary-50 transition flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Top Up
        </button>
      </div>

      {showTopUp && (
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h3 className="text-xl font-semibold mb-4">Top Up Wallet</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Jumlah Top Up</label>
              <input
                type="number"
                min="10000"
                step="1000"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="Minimum Rp 10.000"
                value={topUpAmount}
                onChange={(e) => setTopUpAmount(e.target.value)}
              />
              <p className="text-xs text-gray-500 mt-1">Minimum top up: Rp 10.000</p>
            </div>
            <div className="flex gap-4">
              <button
                onClick={handleTopUp}
                className="flex-1 bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition"
              >
                Top Up Sekarang
              </button>
              <button
                onClick={() => {
                  setShowTopUp(false)
                  setTopUpAmount('')
                }}
                className="px-6 py-3 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition"
              >
                Batal
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="grid md:grid-cols-3 gap-4 mb-8">
        <Link
          href="/payment?type=topup&amount=50000&description=Top Up Wallet"
          className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition text-center"
        >
          <div className="text-2xl font-bold text-primary-600 mb-2">Rp 50.000</div>
          <div className="text-sm text-gray-600">Top Up Cepat</div>
        </Link>
        <Link
          href="/payment?type=topup&amount=100000&description=Top Up Wallet"
          className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition text-center"
        >
          <div className="text-2xl font-bold text-primary-600 mb-2">Rp 100.000</div>
          <div className="text-sm text-gray-600">Top Up Cepat</div>
        </Link>
        <Link
          href="/payment?type=topup&amount=200000&description=Top Up Wallet"
          className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition text-center"
        >
          <div className="text-2xl font-bold text-primary-600 mb-2">Rp 200.000</div>
          <div className="text-sm text-gray-600">Top Up Cepat</div>
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b flex justify-between items-center">
          <h3 className="text-xl font-semibold flex items-center gap-2">
            <History className="w-5 h-5" />
            Transaksi Terakhir
          </h3>
          <Link
            href="/transactions"
            className="text-primary-600 hover:text-primary-700 font-semibold text-sm"
          >
            Lihat Semua →
          </Link>
        </div>
        <div className="divide-y">
          {recentTransactions.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <History className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <p>Belum ada transaksi</p>
            </div>
          ) : (
            recentTransactions.map((transaction) => (
              <div key={transaction.id} className="p-6 hover:bg-gray-50 transition">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="bg-gray-100 p-3 rounded-lg">
                      {getTransactionIcon(transaction.type)}
                    </div>
                    <div>
                      <div className="font-semibold">{getTransactionTypeLabel(transaction.type)}</div>
                      <div className="text-sm text-gray-600">{transaction.description}</div>
                      <div className="text-xs text-gray-500 mt-1">
                        {formatDateTime(transaction.created_at)}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`font-bold text-lg ${
                      transaction.type === 'refund' || transaction.type === 'topup'
                        ? 'text-green-600'
                        : 'text-red-600'
                    }`}>
                      {transaction.type === 'refund' || transaction.type === 'topup' ? '+' : '-'}
                      {formatCurrency(transaction.amount)}
                    </div>
                    {getStatusBadge(transaction.status)}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
