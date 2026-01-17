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

    const searchParams = request.nextUrl.searchParams
    const type = searchParams.get('type')
    const limit = parseInt(searchParams.get('limit') || '50')

    let query = 'SELECT * FROM transactions WHERE user_id = ?'
    const params: any[] = [decoded.userId]

    if (type) {
      query += ' AND type = ?'
      params.push(type)
    }

    query += ' ORDER BY created_at DESC LIMIT ?'
    params.push(limit)

    const transactions = await dbAll<any>(db, query, params)

    db.close()

    return NextResponse.json(transactions)
  } catch (error: any) {
    console.error('Error fetching transactions:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch transactions' },
      { status: 500 }
    )
  }
}
