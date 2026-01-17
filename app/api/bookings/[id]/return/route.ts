import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'
import { getDatabase, dbRun, dbGet, initDatabase } from '@/lib/db'
import { calculateLateFee } from '@/lib/utils'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await initDatabase()
    const db = getDatabase()
    
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    if (!token) {
      db.close()
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const decoded = verifyToken(token)
    if (!decoded) {
      db.close()
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 }      )
    }

    const booking = await dbGet<{
      id: number
      borrower_id: number
      owner_id: number
      status: string
      end_date: string
      item_id: number
      deposit_amount: number
    }>(
      db,
      'SELECT id, borrower_id, owner_id, status, end_date, item_id, deposit_amount FROM bookings WHERE id = ?',
      [params.id]
    )

    if (!booking) {
      db.close()
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 })
    }

    if (booking.borrower_id !== decoded.userId) {
      db.close()
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    if (booking.status !== 'active' && booking.status !== 'approved') {
      db.close()
      return NextResponse.json(
        { error: 'Booking is not active or approved' },
        { status: 400 }
      )
    }

    const lateFee = calculateLateFee(booking.end_date, 0)

    await dbRun(
      db,
      'UPDATE bookings SET status = ?, returned_at = CURRENT_TIMESTAMP, late_fee = ? WHERE id = ?',
      ['completed', lateFee, params.id]
    )

    await dbRun(
      db,
      'UPDATE items SET available = 1 WHERE id = ?',
      [booking.item_id]
    )

    const refundAmount = booking.deposit_amount - lateFee
    await dbRun(
      db,
      'UPDATE deposits SET status = ?, refunded_at = CURRENT_TIMESTAMP WHERE booking_id = ?',
      ['refunded', params.id]
    )

    await dbRun(
      db,
      `INSERT INTO notifications (user_id, type, message, related_id)
       VALUES (?, 'item_returned', ?, ?)`,
      [
        booking.owner_id,
        'Barang telah dikembalikan',
        params.id
      ]
    )

    db.close()

    return NextResponse.json({
      success: true,
      message: 'Item returned successfully',
      lateFee,
      refundAmount
    })
  } catch (error: any) {
    console.error('Return item error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to return item' },
      { status: 500 }
    )
  }
}
