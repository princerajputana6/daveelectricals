import { ObjectId } from "mongodb";
import { getDb } from "./mongodb";

export type PaymentMode = "split" | "full";

export type OrderStatus =
  | "pending_deposit"
  | "pending_payment"
  | "deposit_paid"
  | "paid_in_full"
  | "in_progress"
  | "ready_for_balance"
  | "completed"
  | "cancelled";

export type OrderItem = {
  productId: string;
  variantId?: string;
  variantLabel?: string;
  name: string;
  unit: string;
  unitPrice: number;
  qty: number;
  lineTotal: number;
};

export type PaymentRecord = {
  stripeSessionId?: string;
  stripePaymentIntentId?: string;
  amount: number; // pounds
  currency: string;
  status: "created" | "paid" | "failed";
  /** True if marked paid manually by admin (e.g. bank transfer) */
  manual?: boolean;
  createdAt: Date;
  paidAt?: Date;
};

export type Certificate = {
  number: string;
  type: string;
  issuedAt: Date;
  expiresAt?: Date;
  notes?: string;
  fileUrl?: string;
};

export type Order = {
  _id: ObjectId;
  userId: string;
  customer: {
    name: string;
    email: string;
    phone: string;
    address: string;
    /** Customer's preferred date for the visit (ISO yyyy-mm-dd) */
    preferredDate: string;
    notes?: string;
    /** Sr23 — property access instructions & key-collection details */
    accessDetails?: string;
    keyCollection?: string;
  };
  items: OrderItem[];
  subtotal: number; // ex-VAT sum of line totals
  vatRate?: number; // % applied at time of order (undefined on legacy orders)
  vatAmount?: number; // VAT in currency
  total?: number; // VAT-inclusive grand total (undefined on legacy orders)
  deposit: number;
  balance: number;
  currency: string;
  paymentMode: PaymentMode;
  status: OrderStatus;
  payments: {
    deposit?: PaymentRecord;
    balance?: PaymentRecord;
  };
  certificate?: Certificate;
  /** Sr21 — set when this order is a same-day emergency slot booking */
  booking?: {
    slotId: string;
    date: string; // yyyy-mm-dd
    time: string; // HH:mm
  };
  createdAt: Date;
  updatedAt: Date;
};

export async function ordersCol() {
  const db = await getDb();
  return db.collection<Order>("orders");
}

export function publicOrder(o: Order) {
  return {
    id: o._id.toString(),
    userId: o.userId,
    customer: o.customer,
    items: o.items,
    subtotal: o.subtotal,
    vatRate: o.vatRate ?? 0,
    vatAmount: o.vatAmount ?? 0,
    // Legacy orders (pre-VAT) have no stored total — fall back to subtotal.
    total: o.total ?? o.subtotal,
    deposit: o.deposit,
    balance: o.balance,
    currency: o.currency,
    paymentMode: o.paymentMode,
    status: o.status,
    payments: {
      deposit: o.payments.deposit
        ? {
            amount: o.payments.deposit.amount,
            currency: o.payments.deposit.currency,
            status: o.payments.deposit.status,
            manual: o.payments.deposit.manual,
            paidAt: o.payments.deposit.paidAt,
          }
        : null,
      balance: o.payments.balance
        ? {
            amount: o.payments.balance.amount,
            currency: o.payments.balance.currency,
            status: o.payments.balance.status,
            manual: o.payments.balance.manual,
            paidAt: o.payments.balance.paidAt,
          }
        : null,
    },
    /** True once nothing is owed by the customer */
    fullyPaid:
      o.payments.deposit?.status === "paid" &&
      (o.paymentMode === "full" || o.payments.balance?.status === "paid"),
    certificate: o.certificate,
    booking: o.booking,
    createdAt: o.createdAt,
    updatedAt: o.updatedAt,
  };
}
