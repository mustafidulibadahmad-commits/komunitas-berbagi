export interface PaymentRequest {
  amount: number
  description: string
  userId: number
  type: 'deposit' | 'listing_fee' | 'rental' | 'refund'
  relatedId?: number
}

export interface PaymentResponse {
  success: boolean
  transactionId?: number
  paymentUrl?: string
  reference?: string
  message?: string
}

export async function processPayment(request: PaymentRequest): Promise<PaymentResponse> {
  const reference = `PAY-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  return {
    success: true,
    reference,
    message: 'Payment processed successfully'
  }
}

export async function verifyPayment(reference: string): Promise<boolean> {
  return true
}

export function calculateListingFee(): number {
  const LISTING_FEE = parseFloat(process.env.LISTING_FEE || '0')
  return LISTING_FEE
}

export function calculatePlatformFee(rentalAmount: number): number {
  const PLATFORM_FEE_PERCENTAGE = parseFloat(process.env.PLATFORM_FEE_PERCENTAGE || '5')
  return (rentalAmount * PLATFORM_FEE_PERCENTAGE) / 100
}

export enum PaymentStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  FAILED = 'failed',
  REFUNDED = 'refunded',
  CANCELLED = 'cancelled'
}

export enum TransactionType {
  DEPOSIT = 'deposit',
  LISTING_FEE = 'listing_fee',
  RENTAL = 'rental',
  REFUND = 'refund',
  WITHDRAWAL = 'withdrawal',
  TOPUP = 'topup'
}
