'use client'

import { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { CreditCard, Wallet, CheckCircle, AlertCircle } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'
import toast from 'react-hot-toast'

export default function PaymentPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [walletBalance, setWalletBalance] = useState(0)
  const [paymentData, setPaymentData] = useState({
    type: searchParams.get('type') || '',
    amount: parseFloat(searchParams.get('amount') || '0'),
    description: searchParams.get('description') || '',
    relatedId: searchParams.get('relatedId') || null
  })
  const [paymentMethod, setPaymentMethod] = useState<'wallet' | 'gateway'>('wallet')

  useEffect(() => {
    fetchWalletBalance()
  }, [])

  const fetchWalletBalance = async () => {
    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/login')
      return
    }

    try {
      const response = await fetch('/api/payments/wallet', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      const data = await response.json()
      if (response.ok) {
        setWalletBalance(data.balance || 0)
      }
    } catch (error) {
      console.error('Error fetching wallet:', error)
    }
  }

  const handlePayment = async () => {
    if (paymentData.amount <= 0) {
      toast.error('Amount must be greater than 0')
      return
    }

    if (paymentMethod === 'wallet' && walletBalance < paymentData.amount) {
      toast.error('Insufficient wallet balance')
      return
    }

    setLoading(true)
    const token = localStorage.getItem('token')

    try {
      const response = await fetch('/api/payments/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...paymentData,
          paymentMethod: paymentMethod === 'wallet' ? 'wallet' : 'gateway'
        })
      })

      const data = await response.json()

      if (response.ok) {
        toast.success('Payment successful!')
        
        await fetchWalletBalance()
        
        if (paymentData.type === 'listing_fee') {
          router.push('/dashboard?tab=items')
        } else if (paymentData.type === 'deposit') {
          router.push('/dashboard?tab=bookings')
        } else {
          router.push('/dashboard')
        }
      } else {
        toast.error(data.error || 'Payment failed')
      }
    } catch (error) {
      toast.error('Terjadi kesalahan')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-4xl font-bold mb-8">Pembayaran</h1>

      <div className="bg-white rounded-lg shadow p-6 space-y-6">
        <div className="bg-gray-50 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Ringkasan Pembayaran</h2>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Jenis:</span>
              <span className="font-semibold capitalize">
                {paymentData.type === 'listing_fee' ? 'Biaya Listing' :
                 paymentData.type === 'deposit' ? 'Deposit Peminjaman' :
                 paymentData.type === 'rental' ? 'Sewa Barang' :
                 paymentData.type}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Deskripsi:</span>
              <span className="font-semibold">{paymentData.description || '-'}</span>
            </div>
            <div className="border-t pt-2 flex justify-between text-lg">
              <span className="font-semibold">Total:</span>
              <span className="font-bold text-primary-600 text-xl">
                {formatCurrency(paymentData.amount)}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-primary-50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Wallet className="w-5 h-5 text-primary-600" />
              <span className="font-medium">Saldo Wallet:</span>
            </div>
            <span className="font-bold text-primary-600">
              {formatCurrency(walletBalance)}
            </span>
          </div>
          {walletBalance < paymentData.amount && (
            <div className="mt-2 flex items-center gap-2 text-sm text-yellow-600">
              <AlertCircle className="w-4 h-4" />
              <span>Saldo tidak cukup. Gunakan payment gateway.</span>
            </div>
          )}
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-4">Metode Pembayaran</h3>
          <div className="space-y-3">
            <label className={`flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer transition ${
              paymentMethod === 'wallet' 
                ? 'border-primary-600 bg-primary-50' 
                : 'border-gray-200 hover:border-gray-300'
            }`}>
              <input
                type="radio"
                name="paymentMethod"
                value="wallet"
                checked={paymentMethod === 'wallet'}
                onChange={(e) => setPaymentMethod(e.target.value as 'wallet')}
                className="w-4 h-4 text-primary-600"
                disabled={walletBalance < paymentData.amount}
              />
              <Wallet className="w-5 h-5" />
              <div className="flex-1">
                <div className="font-semibold">Wallet</div>
                <div className="text-sm text-gray-600">
                  Gunakan saldo wallet Anda
                  {walletBalance >= paymentData.amount && (
                    <span className="text-green-600 ml-2">✓ Cukup</span>
                  )}
                </div>
              </div>
            </label>

            <label className={`flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer transition ${
              paymentMethod === 'gateway' 
                ? 'border-primary-600 bg-primary-50' 
                : 'border-gray-200 hover:border-gray-300'
            }`}>
              <input
                type="radio"
                name="paymentMethod"
                value="gateway"
                checked={paymentMethod === 'gateway'}
                onChange={(e) => setPaymentMethod(e.target.value as 'gateway')}
                className="w-4 h-4 text-primary-600"
              />
              <CreditCard className="w-5 h-5" />
              <div className="flex-1">
                <div className="font-semibold">Payment Gateway</div>
                <div className="text-sm text-gray-600">
                  Transfer Bank, E-Wallet, atau Kartu Kredit
                </div>
              </div>
            </label>
          </div>
        </div>

        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="flex items-start gap-2">
            <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5" />
            <div className="text-sm text-blue-800">
              <p className="font-semibold mb-1">Catatan:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Pembayaran diproses secara aman</li>
                <li>Deposit akan dikembalikan setelah barang dikembalikan</li>
                <li>Biaya listing digunakan untuk aktivasi barang</li>
              </ul>
            </div>
          </div>
        </div>

        <button
          onClick={handlePayment}
          disabled={loading || (paymentMethod === 'wallet' && walletBalance < paymentData.amount)}
          className="w-full bg-primary-600 text-white py-3 rounded-lg font-semibold hover:bg-primary-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading ? (
            'Memproses...'
          ) : (
            <>
              <CreditCard className="w-5 h-5" />
              Bayar {formatCurrency(paymentData.amount)}
            </>
          )}
        </button>

        <button
          onClick={() => router.back()}
          className="w-full bg-gray-100 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-200 transition"
        >
          Batal
        </button>
      </div>
    </div>
  )
}
