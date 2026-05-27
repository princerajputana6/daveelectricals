import { ObjectId } from "mongodb";
import { getDb } from "./mongodb";

export type OrderStatus =
  | "pending_deposit"
  | "deposit_paid"
  | "in_progress"
  | "ready_for_balance"
  | "completed"
  | "cancelled";

export type OrderItem = {
  productId: string;
  name: string;
  unit: string;
  unitPrice: number;
  qty: number;
  lineTotal: number;
};

export type PaymentRecord = {
  razorpayOrderId: string;
  razorpayPaymentId?: string;
  razorpaySignature?: string;
  amount: number; // pounds
  currency: string;
  status: "created" | "paid" | "failed";
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
    notes?: string;
  };
  items: OrderItem[];
  subtotal: number;
  deposit: number;
  balance: number;
  currency: string;
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
    customer: o.customer,
    items: o.items,
    subtotal: o.subtotal,
    deposit: o.deposit,
    balance: o.balance,
    currency: o.currency,
    status: o.status,
    payments: {
      deposit: o.payments.deposit
        ? {
            razorpayOrderId: o.payments.deposit.razorpayOrderId,
            amount: o.payments.deposit.amount,
            currency: o.payments.deposit.currency,
            status: o.payments.deposit.status,
            paidAt: o.payments.deposit.paidAt,
          }
        : null,
      balance: o.payments.balance
        ? {
            razorpayOrderId: o.payments.balance.razorpayOrderId,
            amount: o.payments.balance.amount,
            currency: o.payments.balance.currency,
            status: o.payments.balance.status,
            paidAt: o.payments.balance.paidAt,
          }
        : null,
    },
    certificate: o.certificate,
    createdAt: o.createdAt,
    updatedAt: o.updatedAt,
  };
}
