import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'
import { getDatabase, dbGet, dbRun, initDatabase } from '@/lib/db'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await initDatabase()
    const db = getDatabase()
    
    const item = await dbGet<any>(
      db,
      `SELECT 
        i.*,
        u.name as owner_name,
        u.email as owner_email,
        u.phone as owner_phone,
        u.reputation_score as owner_reputation,
        u.verified as owner_verified
      FROM items i
      JOIN users u ON i.owner_id = u.id
      WHERE i.id = ?`,
      [params.id]
    )

    db.close()

    if (!item) {
      return NextResponse.json(
        { error: 'Item not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(item)
  } catch (error: any) {
    console.error('Error fetching item:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch item' },
      { status: 500 }
    )
  }
}

export async function PUT(
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
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    const item = await dbGet<{ owner_id: number }>(
      db,
      'SELECT owner_id FROM items WHERE id = ?',
      [params.id]
    )

    if (!item) {
      db.close()
      return NextResponse.json({ error: 'Item not found' }, { status: 404 })
    }

    if (item.owner_id !== decoded.userId) {
      db.close()
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const { name, description, category, location, deposit_amount, daily_rate, image_url, available } = await request.json()

    if (!name || !description || !category || !location || deposit_amount === undefined || daily_rate === undefined) {
      db.close()
      return NextResponse.json(
        { error: 'All required fields must be provided' },
        { status: 400 }
      )
    }

    await dbRun(
      db,
      `UPDATE items 
       SET name = ?, description = ?, category = ?, location = ?, 
           deposit_amount = ?, daily_rate = ?, image_url = ?, available = ?
       WHERE id = ? AND owner_id = ?`,
      [
        name,
        description,
        category,
        location,
        deposit_amount,
        daily_rate,
        image_url || null,
        available !== undefined ? (available ? 1 : 0) : 1,
        params.id,
        decoded.userId
      ]
    )

    db.close()

    return NextResponse.json({
      success: true,
      message: 'Item updated successfully'
    })
  } catch (error: any) {
    console.error('Error updating item:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to update item' },
      { status: 500 }
    )
  }
}

export async function DELETE(
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
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    const item = await dbGet<{ owner_id: number }>(
      db,
      'SELECT owner_id FROM items WHERE id = ?',
      [params.id]
    )

    if (!item) {
      db.close()
      return NextResponse.json({ error: 'Item not found' }, { status: 404 })
    }

    if (item.owner_id !== decoded.userId) {
      db.close()
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const activeBooking = await dbGet<{ id: number }>(
      db,
      `SELECT id FROM bookings 
       WHERE item_id = ? AND status IN ('pending', 'approved', 'active')`,
      [params.id]
    )

    if (activeBooking) {
      db.close()
      return NextResponse.json(
        { error: 'Cannot delete item with active bookings' },
        { status: 400 }
      )
    }

    await dbRun(
      db,
      'DELETE FROM items WHERE id = ? AND owner_id = ?',
      [params.id, decoded.userId]
    )

    db.close()

    return NextResponse.json({
      success: true,
      message: 'Item deleted successfully'
    })
  } catch (error: any) {
    console.error('Error deleting item:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to delete item' },
      { status: 500 }
    )
  }
}
