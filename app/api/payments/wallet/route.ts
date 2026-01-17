import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'
import { getDatabase, dbGet, dbRun, initDatabase } from '@/lib/db'

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

    let wallet = await dbGet<{ balance: number }>(
      db,
      'SELECT balance FROM user_wallets WHERE user_id = ?',
      [decoded.userId]
    )

    if (!wallet) {
      await dbRun(
        db,
        'INSERT INTO user_wallets (user_id, balance) VALUES (?, 0)',
        [decoded.userId]
      )
      wallet = { balance: 0 }
    }

    db.close()

    return NextResponse.json({
      balance: wallet.balance,
      userId: decoded.userId
    })
  } catch (error: any) {
    console.error('Error fetching wallet:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch wallet' },
      { status: 500 }
    )
  }
}
