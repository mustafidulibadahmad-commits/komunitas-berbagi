import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'
import { getDatabase, dbRun, dbGet, dbAll, initDatabase } from '@/lib/db'
import { calculateDays, calculateLateFee } from '@/lib/utils'

export async function POST(request: NextRequest) {
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
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    const { itemId, startDate, endDate } = await request.json()

    if (!itemId || !startDate || !endDate) {
      db.close()
      return NextResponse.json(
        { error: 'Item ID, start date, and end date are required' },
        { status: 400 }
      )
    }

    const item = await dbGet<{
      id: number
      owner_id: number
      deposit_amount: number
      daily_rate: number
      available: number
    }>(
      db,
      'SELECT id, owner_id, deposit_amount, daily_rate, available FROM items WHERE id = ?',
      [itemId]
    )

    if (!item) {
      db.close()
      return NextResponse.json({ error: 'Item not found' }, { status: 404 })
    }

    if (item.owner_id === decoded.userId) {
      db.close()
      return NextResponse.json(
        { error: 'Cannot book your own item' },
        { status: 400 }
      )
    }

    if (item.available === 0) {
      db.close()
      return NextResponse.json(
        { error: 'Item is not available' },
        { status: 400 }
      )
    }

    const overlapping = await dbGet<{ id: number }>(
      db,
      `SELECT id FROM bookings 
       WHERE item_id = ? 
       AND status IN ('pending', 'approved', 'active')
       AND (
         (start_date <= ? AND end_date >= ?) OR
         (start_date <= ? AND end_date >= ?) OR
         (start_date >= ? AND end_date <= ?)
       )`,
      [itemId, startDate, startDate, endDate, endDate, startDate, endDate]
    )

    if (overlapping) {
      db.close()
      return NextResponse.json(
        { error: 'Item is already booked for these dates' },
        { status: 400 }
      )
    }

    const bookingResult = await dbRun(
      db,
      `INSERT INTO bookings 
       (item_id, borrower_id, owner_id, start_date, end_date, deposit_amount, status)
       VALUES (?, ?, ?, ?, ?, ?, 'pending')`,
      [
        itemId,
        decoded.userId,
        item.owner_id,
        startDate,
        endDate,
        item.deposit_amount
      ]
    )

    await dbRun(
      db,
      'INSERT INTO deposits (booking_id, amount, status) VALUES (?, ?, ?)',
      [bookingResult.lastID, item.deposit_amount, 'pending']
    )

    await dbRun(
      db,
      `INSERT INTO notifications (user_id, type, message, related_id)
       VALUES (?, 'booking_request', ?, ?)`,
      [
        item.owner_id,
        `Permintaan peminjaman baru untuk item Anda`,
        bookingResult.lastID
      ]
    )

    db.close()

    return NextResponse.json({
      success: true,
      bookingId: bookingResult.lastID,
      message: 'Booking request created successfully'
    })
  } catch (error: any) {
    console.error('Booking error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to create booking' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
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
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    const searchParams = request.nextUrl.searchParams
    const type = searchParams.get('type') // 'borrowed' or 'lent'

    let query = `
      SELECT 
        b.*,
        i.name as item_name,
        i.image_url as item_image,
        owner.name as owner_name,
        borrower.name as borrower_name
      FROM bookings b
      JOIN items i ON b.item_id = i.id
      JOIN users owner ON b.owner_id = owner.id
      JOIN users borrower ON b.borrower_id = borrower.id
      WHERE 
    `

    if (type === 'borrowed') {
      query += 'b.borrower_id = ?'
    } else if (type === 'lent') {
      query += 'b.owner_id = ?'
    } else {
      query += '(b.borrower_id = ? OR b.owner_id = ?)'
    }

    query += ' ORDER BY b.created_at DESC'

    const params = type === 'borrowed' || type === 'lent' 
      ? [decoded.userId] 
      : [decoded.userId, decoded.userId]

    const bookings = await dbAll<any>(db, query, params)
    db.close()

    return NextResponse.json(bookings)
  } catch (error: any) {
    console.error('Error fetching bookings:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch bookings' },
      { status: 500 }
    )
  }
}
