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
      item_id: number
      borrower_id: number
    }>(
      db,
      'SELECT id, owner_id, status, item_id, borrower_id FROM bookings WHERE id = ?',
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
      ['approved', params.id]
    )

    await dbRun(
      db,
      'UPDATE items SET available = 0 WHERE id = ?',
      [booking.item_id]
    )

    await dbRun(
      db,
      'UPDATE deposits SET status = ? WHERE booking_id = ?',
      ['held', params.id]
    )

    await dbRun(
      db,
      `INSERT INTO notifications (user_id, type, message, related_id)
       VALUES (?, 'booking_approved', ?, ?)`,
      [
        booking.borrower_id,
        'Permintaan peminjaman Anda disetujui',
        params.id
      ]
    )

    db.close()

    return NextResponse.json({
      success: true,
      message: 'Booking approved successfully'
    })
  } catch (error: any) {
    console.error('Approve booking error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to approve booking' },
      { status: 500 }
    )
  }
}
