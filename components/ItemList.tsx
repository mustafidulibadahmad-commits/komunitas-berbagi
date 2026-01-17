'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Package, MapPin, Star } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'

interface Item {
  id: number
  name: string
  description: string
  category: string
  location: string
  deposit_amount: number
  daily_rate: number
  image_url: string
  owner_name: string
  owner_reputation: number
}

interface ItemListProps {
  limit?: number
  category?: string
  search?: string
}

export default function ItemList({ limit, category, search }: ItemListProps) {
  const [items, setItems] = useState<Item[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchItems()
  }, [category, search])

  const fetchItems = async () => {
    try {
      const params = new URLSearchParams()
      if (category && category !== 'Semua') {
        params.append('category', category)
      }
      if (search) {
        params.append('search', search)
      }
      
      const response = await fetch(`/api/items?${params.toString()}`)
      const data = await response.json()
      setItems(limit ? data.slice(0, limit) : data)
    } catch (error) {
      console.error('Error fetching items:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="grid md:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white rounded-lg shadow p-6 animate-pulse">
            <div className="h-48 bg-gray-200 rounded mb-4"></div>
            <div className="h-4 bg-gray-200 rounded mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          </div>
        ))}
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-12">
        <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600">Belum ada barang yang tersedia</p>
      </div>
    )
  }

  return (
    <div className="grid md:grid-cols-3 gap-6">
      {items.map((item) => (
        <Link
          key={item.id}
          href={`/items/${item.id}`}
          className="bg-white rounded-lg shadow hover:shadow-lg transition overflow-hidden"
        >
          <div className="h-48 bg-gray-200 flex items-center justify-center">
            {item.image_url ? (
              <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
            ) : (
              <Package className="w-16 h-16 text-gray-400" />
            )}
          </div>
          <div className="p-6">
            <h3 className="text-xl font-semibold mb-2">{item.name}</h3>
            <p className="text-gray-600 text-sm mb-4 line-clamp-2">{item.description}</p>
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
              <MapPin className="w-4 h-4" />
              {item.location}
            </div>
            <div className="flex items-center gap-2 text-sm mb-4">
              <Star className="w-4 h-4 text-yellow-500" />
              <span className="font-semibold">{item.owner_reputation}/200</span>
              <span className="text-gray-500">• {item.owner_name}</span>
            </div>
            <div className="flex justify-between items-center pt-4 border-t">
              <div>
                <p className="text-xs text-gray-500">Deposit</p>
                <p className="font-semibold text-primary-600">{formatCurrency(item.deposit_amount)}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-500">Harian</p>
                <p className="font-semibold">{formatCurrency(item.daily_rate)}</p>
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  )
}
