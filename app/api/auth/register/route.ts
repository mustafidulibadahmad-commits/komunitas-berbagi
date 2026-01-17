import { NextRequest, NextResponse } from 'next/server'
import { hashPassword } from '@/lib/auth'
import { getDatabase, dbRun, dbGet, initDatabase } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    await initDatabase()
    const db = getDatabase()
    
    const { name, email, password, phone, address } = await request.json()

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Name, email, and password are required' },
        { status: 400 }
      )
    }

    const existingUser = await dbGet<{ id: number }>(
      db,
      'SELECT id FROM users WHERE email = ?',
      [email]
    )

    if (existingUser) {
      db.close()
      return NextResponse.json(
        { error: 'Email already registered' },
        { status: 400 }
      )
    }

    const hashedPassword = await hashPassword(password)

    const result = await dbRun(
      db,
      `INSERT INTO users (name, email, password, phone, address, verified) 
       VALUES (?, ?, ?, ?, ?, 0)`,
      [name, email, hashedPassword, phone || null, address || null]
    )

    db.close()

    return NextResponse.json({
      success: true,
      userId: result.lastID,
      message: 'Registration successful'
    })
  } catch (error: any) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { error: error.message || 'Registration failed' },
      { status: 500 }
    )
  }
}
