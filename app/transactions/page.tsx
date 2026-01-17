'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { History, Filter, Download, ArrowDownLeft, ArrowUpRight, CreditCard, Search } from 'lucide-react'
import { formatCurrency, formatDateTime, formatDate } from '@/lib/utils'
import toast from 'react-hot-toast'

interface Transaction {
  id: number
  type: string
  amount: number
  description: string
  status: string
  payment_method: string
  payment_reference: string
  related_id: number | null
  created_at: string
  completed_at: string | null
}

const transactionTypes = [
  'Semua',
  'deposit',
  'listing_fee',
  'rental',
  'refund',
  'topup'
]

const statusFilters = [
  'Semua',
  'completed',
  'pending',
  'failed'
]

export default function TransactionsPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedType, setSelectedType] = useState(searchParams.get('type') || 'Semua')
  const [selectedStatus, setSelectedStatus] = useState('Semua')
  const [searchQuery, setSearchQuery] = useState('')
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([])

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/login')
      return
    }
    fetchTransactions()
  }, [])

  useEffect(() => {
    filterTransactions()
  }, [transactions, selectedType, selectedStatus, searchQuery])

  const fetchTransactions = async () => {
    const token = localStorage.getItem('token')
    try {
      const response = await fetch('/api/payments/transactions?limit=100', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      const data = await response.json()
      if (response.ok) {
        setTransactions(data)
      } else {
        toast.error(data.error || 'Gagal memuat transaksi')
      }
    } catch (error) {
      toast.error('Terjadi kesalahan')
    } finally {
      setLoading(false)
    }
  }

  const filterTransactions = () => {
    let filtered = [...transactions]

    if (selectedType !== 'Semua') {
      filtered = filtered.filter(t => t.type === selectedType)
    }

    if (selectedStatus !== 'Semua') {
      filtered = filtered.filter(t => t.status === selectedStatus)
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(t =>
        t.description.toLowerCase().includes(query) ||
        t.payment_reference?.toLowerCase().includes(query) ||
        t.type.toLowerCase().includes(query)
      )
    }

    setFilteredTransactions(filtered)
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
      case 'processing':
        return <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">Diproses</span>
      case 'failed':
        return <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs">Gagal</span>
      case 'refunded':
        return <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-xs">Dikembalikan</span>
      default:
        return <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-xs">{status}</span>
    }
  }

  const calculateSummary = () => {
    const income = filteredTransactions
      .filter(t => (t.type === 'refund' || t.type === 'topup') && t.status === 'completed')
      .reduce((sum, t) => sum + t.amount, 0)
    
    const expense = filteredTransactions
      .filter(t => (t.type === 'deposit' || t.type === 'listing_fee' || t.type === 'rental') && t.status === 'completed')
      .reduce((sum, t) => sum + t.amount, 0)

    return { income, expense, net: income - expense }
  }

  const summary = calculateSummary()

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="h-20 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold flex items-center gap-3">
          <History className="w-10 h-10" />
          Riwayat Transaksi
        </h1>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <div className="bg-green-50 rounded-lg p-6 border border-green-200">
          <div className="text-sm text-green-600 mb-1">Total Pemasukan</div>
          <div className="text-3xl font-bold text-green-700">
            {formatCurrency(summary.income)}
          </div>
        </div>
        <div className="bg-red-50 rounded-lg p-6 border border-red-200">
          <div className="text-sm text-red-600 mb-1">Total Pengeluaran</div>
          <div className="text-3xl font-bold text-red-700">
            {formatCurrency(summary.expense)}
          </div>
        </div>
        <div className={`rounded-lg p-6 border ${
          summary.net >= 0 
            ? 'bg-blue-50 border-blue-200' 
            : 'bg-orange-50 border-orange-200'
        }`}>
          <div className={`text-sm mb-1 ${
            summary.net >= 0 ? 'text-blue-600' : 'text-orange-600'
          }`}>
            Saldo Bersih
          </div>
          <div className={`text-3xl font-bold ${
            summary.net >= 0 ? 'text-blue-700' : 'text-orange-700'
          }`}>
            {formatCurrency(summary.net)}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="grid md:grid-cols-4 gap-4">
          <div className="md:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Cari transaksi..."
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div>
            <select
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
            >
              {transactionTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          <div>
            <select
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
            >
              {statusFilters.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">
              {filteredTransactions.length} Transaksi
            </h3>
          </div>
        </div>
        <div className="divide-y">
          {filteredTransactions.length === 0 ? (
            <div className="p-12 text-center text-gray-500">
              <History className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <p className="text-lg font-medium mb-2">Tidak ada transaksi</p>
              <p className="text-sm">Coba ubah filter atau cari dengan kata kunci lain</p>
            </div>
          ) : (
            filteredTransactions.map((transaction) => (
              <div key={transaction.id} className="p-6 hover:bg-gray-50 transition">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 flex-1">
                    <div className="bg-gray-100 p-3 rounded-lg">
                      {getTransactionIcon(transaction.type)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <div className="font-semibold">{getTransactionTypeLabel(transaction.type)}</div>
                        {getStatusBadge(transaction.status)}
                      </div>
                      <div className="text-sm text-gray-600 mb-1">{transaction.description}</div>
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span>{formatDateTime(transaction.created_at)}</span>
                        {transaction.payment_reference && (
                          <span>Ref: {transaction.payment_reference}</span>
                        )}
                        {transaction.payment_method && (
                          <span className="capitalize">• {transaction.payment_method}</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`font-bold text-xl ${
                      transaction.type === 'refund' || transaction.type === 'topup'
                        ? 'text-green-600'
                        : 'text-red-600'
                    }`}>
                      {transaction.type === 'refund' || transaction.type === 'topup' ? '+' : '-'}
                      {formatCurrency(transaction.amount)}
                    </div>
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
