import Link from 'next/link'
import { Search, TrendingUp, Shield, Star, Clock, Users } from 'lucide-react'
import ItemList from '@/components/ItemList'

export default function Home() {
  return (
    <div className="min-h-screen">
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-5xl font-bold mb-6">
              Komunitas Berbagi
            </h1>
            <p className="text-xl mb-8 text-primary-100">
              Platform untuk berbagi sumber daya dan alat-alat dalam komunitas Anda.
              Hemat uang, kurangi limbah, dan perkuat komunitas.
            </p>
            <div className="flex gap-4 justify-center">
              <Link
                href="/items/new"
                className="bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-primary-50 transition"
              >
                Daftarkan Barang
              </Link>
              <Link
                href="/items"
                className="bg-primary-700 text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-600 transition border border-white"
              >
                Jelajahi Barang
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Mengapa Pilih Komunitas Berbagi?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Sistem Jaminan</h3>
              <p className="text-gray-600">
                Deposit dan sistem rating memastikan keamanan transaksi dan pengembalian tepat waktu.
              </p>
            </div>
            <div className="text-center p-6">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Rating & Reputasi</h3>
              <p className="text-gray-600">
                Sistem rating membantu Anda menemukan pengguna terpercaya dalam komunitas.
              </p>
            </div>
            <div className="text-center p-6">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Notifikasi Otomatis</h3>
              <p className="text-gray-600">
                Dapatkan pengingat untuk pengembalian barang dan update status peminjaman.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">Barang Tersedia</h2>
            <Link
              href="/items"
              className="text-primary-600 hover:text-primary-700 font-semibold flex items-center gap-2"
            >
              Lihat Semua
              <TrendingUp className="w-5 h-5" />
            </Link>
          </div>
          <ItemList limit={6} />
        </div>
      </section>
    </div>
  )
}
