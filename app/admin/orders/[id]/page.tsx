import Link from "next/link";
import { notFound } from "next/navigation";
import { ObjectId } from "mongodb";
import { ordersCol, publicOrder } from "@/lib/orders";
import AdminOrderEditor from "@/components/admin/AdminOrderEditor";
import { ArrowIcon } from "@/components/Icons";

export const dynamic = "force-dynamic";

export default async function AdminOrderDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  if (!ObjectId.isValid(id)) notFound();

  const col = await ordersCol();
  const orderDoc = await col.findOne({ _id: new ObjectId(id) });
  if (!orderDoc) notFound();

  const order = publicOrder(orderDoc);

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <Link
            href="/admin/orders"
            className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.3em] text-bolt"
          >
            <ArrowIcon className="h-4 w-4 rotate-180" /> Back to orders
          </Link>
          <h1 className="mt-2 font-display text-3xl font-bold text-white">
            Order #{order.id.slice(-6).toUpperCase()}
          </h1>
          <p className="mt-1 text-xs text-ash">
            Placed{" "}
            {new Date(order.createdAt).toLocaleString("en-GB", {
              day: "numeric",
              month: "short",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>
      </div>

      <AdminOrderEditor order={order} />
    </div>
  );
}
