import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'
import { getDatabase, dbRun, dbGet, initDatabase } from '@/lib/db'
import { processPayment, calculateListingFee, PaymentStatus } from '@/lib/payment'

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

    const { type, amount, description, relatedId, paymentMethod } = await request.json()

    if (!type || !amount || amount <= 0) {
      db.close()
      return NextResponse.json(
        { error: 'Type and amount are required' },
        { status: 400 }
      )
    }

    const paymentResult = await processPayment({
      amount,
      description: description || `Payment for ${type}`,
      userId: decoded.userId,
      type,
      relatedId
    })

    if (!paymentResult.success) {
      db.close()
      return NextResponse.json(
        { error: paymentResult.message || 'Payment failed' },
        { status: 400 }
      )
    }

    const transactionResult = await dbRun(
      db,
      `INSERT INTO transactions 
       (user_id, type, amount, description, status, payment_method, payment_reference, related_id)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        decoded.userId,
        type,
        amount,
        description || `Payment for ${type}`,
        PaymentStatus.COMPLETED,
        paymentMethod || 'simulated',
        paymentResult.reference,
        relatedId || null
      ]
    )

    if (type === 'refund' || type === 'withdrawal' || type === 'topup') {
      const existingWallet = await dbGet<{ balance: number }>(
        db,
        'SELECT balance FROM user_wallets WHERE user_id = ?',
        [decoded.userId]
      )

      if (existingWallet) {
        await dbRun(
          db,
          'UPDATE user_wallets SET balance = balance + ?, updated_at = CURRENT_TIMESTAMP WHERE user_id = ?',
          [amount, decoded.userId]
        )
      } else {
        await dbRun(
          db,
          'INSERT INTO user_wallets (user_id, balance) VALUES (?, ?)',
          [decoded.userId, amount]
        )
      }
    } else {
      const wallet = await dbGet<{ balance: number }>(
        db,
        'SELECT balance FROM user_wallets WHERE user_id = ?',
        [decoded.userId]
      )

      if (wallet && wallet.balance >= amount) {
        await dbRun(
          db,
          'UPDATE user_wallets SET balance = balance - ?, updated_at = CURRENT_TIMESTAMP WHERE user_id = ?',
          [amount, decoded.userId]
        )
      }
    }

    if (type === 'listing_fee' && relatedId) {
      await dbRun(
        db,
        `UPDATE listing_fees 
         SET status = 'paid', transaction_id = ?, paid_at = CURRENT_TIMESTAMP 
         WHERE item_id = ?`,
        [transactionResult.lastID, relatedId]
      )
    }

    if (type === 'deposit' && relatedId) {
      await dbRun(
        db,
        `UPDATE deposits 
         SET status = 'paid' 
         WHERE booking_id = ?`,
        [relatedId]
      )
    }

    db.close()

    return NextResponse.json({
      success: true,
      transactionId: transactionResult.lastID,
      reference: paymentResult.reference,
      message: 'Payment processed successfully'
    })
  } catch (error: any) {
    console.error('Payment error:', error)
    return NextResponse.json(
      { error: error.message || 'Payment processing failed' },
      { status: 500 }
    )
  }
}
