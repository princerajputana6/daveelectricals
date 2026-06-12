import { ordersCol, publicOrder } from "@/lib/orders";
import AdminOrdersTable from "@/components/admin/AdminOrdersTable";
import type { OrderPublic } from "@/components/OrdersSection";

export const dynamic = "force-dynamic";

export default async function AdminOrdersPage() {
  const col = await ordersCol();
  const docs = await col.find({}).sort({ createdAt: -1 }).limit(200).toArray();
  const orders = docs.map(publicOrder) as unknown as OrderPublic[];

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-bolt">
            Orders
          </p>
          <h1 className="mt-2 font-display text-3xl font-bold text-white">
            All orders
            <span className="ml-3 rounded-full bg-bolt/15 px-2.5 py-0.5 align-middle text-sm font-semibold text-bolt">
              {orders.length}
            </span>
          </h1>
          <p className="mt-1 text-xs text-ash">
            Issue certificates inline — uploaded files are stored on Cloudinary
            and the customer is emailed automatically.
          </p>
        </div>
      </header>

      <AdminOrdersTable orders={orders} />
    </div>
  );
}
