'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Package, User, LogOut, LogIn, Wallet } from 'lucide-react'
import { useEffect, useState } from 'react'

export default function Navbar() {
  const pathname = usePathname()
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userName, setUserName] = useState('')

  useEffect(() => {
    const token = localStorage.getItem('token')
    const name = localStorage.getItem('userName')
    setIsLoggedIn(!!token)
    setUserName(name || '')
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('userId')
    localStorage.removeItem('userName')
    window.location.href = '/'
  }

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center gap-2 text-primary-600 font-bold text-xl">
            <Package className="w-6 h-6" />
            Komunitas Berbagi
          </Link>
          
          <div className="flex items-center gap-6">
            <Link
              href="/items"
              className={`hover:text-primary-600 transition ${pathname === '/items' ? 'text-primary-600 font-semibold' : ''}`}
            >
              Barang
            </Link>
            
            {isLoggedIn ? (
              <>
                <Link
                  href="/wallet"
                  className={`hover:text-primary-600 transition flex items-center gap-2 ${pathname === '/wallet' ? 'text-primary-600 font-semibold' : ''}`}
                >
                  <Wallet className="w-4 h-4" />
                  Wallet
                </Link>
                <Link
                  href="/dashboard"
                  className={`hover:text-primary-600 transition flex items-center gap-2 ${pathname === '/dashboard' ? 'text-primary-600 font-semibold' : ''}`}
                >
                  <User className="w-4 h-4" />
                  {userName || 'Dashboard'}
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 text-red-600 hover:text-red-700 transition"
                >
                  <LogOut className="w-4 h-4" />
                  Keluar
                </button>
              </>
            ) : (
              <Link
                href="/login"
                className="flex items-center gap-2 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition"
              >
                <LogIn className="w-4 h-4" />
                Masuk
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
