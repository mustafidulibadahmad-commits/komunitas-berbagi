import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'
import { getDatabase, dbAll, initDatabase } from '@/lib/db'

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

    const items = await dbAll<any>(
      db,
      `SELECT * FROM items WHERE owner_id = ? ORDER BY created_at DESC`,
      [decoded.userId]
    )

    db.close()

    return NextResponse.json(items)
  } catch (error: any) {
    console.error('Error fetching user items:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch items' },
      { status: 500 }
    )
  }
}
