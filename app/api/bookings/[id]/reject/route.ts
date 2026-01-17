import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'
import { getDatabase, dbRun, dbGet, initDatabase } from '@/lib/db'

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
      owner_id: number
      status: string
      borrower_id: number
    }>(
      db,
      'SELECT id, owner_id, status, borrower_id FROM bookings WHERE id = ?',
      [params.id]
    )

    if (!booking) {
      db.close()
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 })
    }

    if (booking.owner_id !== decoded.userId) {
      db.close()
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    if (booking.status !== 'pending') {
      db.close()
      return NextResponse.json(
        { error: 'Booking is not pending' },
        { status: 400 }
      )
    }

    await dbRun(
      db,
      'UPDATE bookings SET status = ? WHERE id = ?',
      ['rejected', params.id]
    )

    await dbRun(
      db,
      'UPDATE deposits SET status = ?, refunded_at = CURRENT_TIMESTAMP WHERE booking_id = ?',
      ['refunded', params.id]
    )

    await dbRun(
      db,
      `INSERT INTO notifications (user_id, type, message, related_id)
       VALUES (?, 'booking_rejected', ?, ?)`,
      [
        booking.borrower_id,
        'Permintaan peminjaman Anda ditolak',
        params.id
      ]
    )

    db.close()

    return NextResponse.json({
      success: true,
      message: 'Booking rejected successfully'
    })
  } catch (error: any) {
    console.error('Reject booking error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to reject booking' },
      { status: 500 }
    )
  }
}
