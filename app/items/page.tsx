'use client'

import { useState, useEffect } from 'react'
import { Search, Filter } from 'lucide-react'
import ItemList from '@/components/ItemList'
import Link from 'next/link'

const categories = [
  'Semua',
  'Alat Pertukangan',
  'Alat Berkebun',
  'Perabotan',
  'Elektronik',
  'Olahraga',
  'Lainnya'
]

export default function ItemsPage() {
  const [selectedCategory, setSelectedCategory] = useState('Semua')
  const [searchQuery, setSearchQuery] = useState('')

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">Daftar Barang Tersedia</h1>
        <p className="text-gray-600">
          Temukan barang yang Anda butuhkan dari komunitas
        </p>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Cari barang..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-2 overflow-x-auto">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg whitespace-nowrap transition ${
                  selectedCategory === category
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Items List */}
      <ItemList category={selectedCategory} search={searchQuery} />
    </div>
  )
}
