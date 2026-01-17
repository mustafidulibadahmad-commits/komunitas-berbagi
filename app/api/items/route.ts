import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'
import { getDatabase, dbRun, dbAll, initDatabase } from '@/lib/db'
import { calculateListingFee } from '@/lib/payment'

export async function GET(request: NextRequest) {
  try {
    await initDatabase()
    const db = getDatabase()
    
    const searchParams = request.nextUrl.searchParams
    const category = searchParams.get('category')
    const search = searchParams.get('search')

    let query = `
      SELECT 
        i.*,
        u.name as owner_name,
        u.reputation_score as owner_reputation
      FROM items i
      JOIN users u ON i.owner_id = u.id
      WHERE i.available = 1
    `
    const params: any[] = []

    if (category && category !== 'Semua') {
      query += ' AND i.category = ?'
      params.push(category)
    }

    if (search) {
      query += ' AND (i.name LIKE ? OR i.description LIKE ?)'
      params.push(`%${search}%`, `%${search}%`)
    }

    query += ' ORDER BY i.created_at DESC'

    const items = await dbAll<any>(db, query, params)
    db.close()

    return NextResponse.json(items)
  } catch (error: any) {
    console.error('Error fetching items:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch items' },
      { status: 500 }
    )
  }
}

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

    const { name, description, category, location, deposit_amount, daily_rate, image_url } = await request.json()

    if (!name || !description || !category || !location || deposit_amount === undefined || daily_rate === undefined) {
      db.close()
      return NextResponse.json(
        { error: 'All required fields must be provided' },
        { status: 400 }
      )
    }

    const result = await dbRun(
      db,
      `INSERT INTO items 
       (owner_id, name, description, category, location, deposit_amount, daily_rate, image_url, available)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1)`,
      [
        decoded.userId,
        name,
        description,
        category,
        location,
        deposit_amount,
        daily_rate,
        image_url || null
      ]
    )

    const listingFee = calculateListingFee()
    let listingFeeId = null

    if (listingFee > 0) {
      const listingFeeResult = await dbRun(
        db,
        'INSERT INTO listing_fees (item_id, amount, status) VALUES (?, ?, ?)',
        [result.lastID, listingFee, 'pending']
      )
      listingFeeId = listingFeeResult.lastID
    }

    db.close()

    return NextResponse.json({
      success: true,
      itemId: result.lastID,
      listingFee: listingFee > 0 ? listingFee : null,
      listingFeeId,
      message: listingFee > 0 
        ? 'Item created. Please pay listing fee to activate.' 
        : 'Item created successfully'
    })
  } catch (error: any) {
    console.error('Error creating item:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to create item' },
      { status: 500 }
    )
  }
}
