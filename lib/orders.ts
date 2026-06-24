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
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  razorpaySignature?: string;
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
  };
  items: OrderItem[];
  subtotal: number;
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
    deposit: o.deposit,
    balance: o.balance,
    currency: o.currency,
    paymentMode: o.paymentMode,
    status: o.status,
    payments: {
      deposit: o.payments.deposit
        ? {
            razorpayOrderId: o.payments.deposit.razorpayOrderId,
            amount: o.payments.deposit.amount,
            currency: o.payments.deposit.currency,
            status: o.payments.deposit.status,
            manual: o.payments.deposit.manual,
            paidAt: o.payments.deposit.paidAt,
          }
        : null,
      balance: o.payments.balance
        ? {
            razorpayOrderId: o.payments.balance.razorpayOrderId,
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
    createdAt: o.createdAt,
    updatedAt: o.updatedAt,
  };
}
