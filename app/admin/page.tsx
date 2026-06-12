import Link from "next/link";
import { getDb } from "@/lib/mongodb";
import { ordersCol, type Order } from "@/lib/orders";
import { formatGBP } from "@/lib/products";
import {
  ArrowIcon,
  BagIcon,
  ChartIcon,
  MailIcon,
  ShieldIcon,
  UsersIcon,
} from "@/components/Icons";

export const dynamic = "force-dynamic";

async function loadStats() {
  const db = await getDb();
  const orders = await ordersCol();

  const [allOrders, customers, enquiries] = await Promise.all([
    orders.find({}).sort({ createdAt: -1 }).toArray(),
    db.collection("users").countDocuments({}),
    db.collection("contacts").countDocuments({}),
  ]);

  const counts = {
    total: allOrders.length,
    pending: 0,
    inProgress: 0,
    readyForBalance: 0,
    completed: 0,
    cancelled: 0,
  };
  let revenuePaid = 0;
  let revenueOwed = 0;
  for (const o of allOrders) {
    if (
      o.status === "pending_deposit" ||
      o.status === "pending_payment"
    )
      counts.pending++;
    else if (
      o.status === "deposit_paid" ||
      o.status === "paid_in_full" ||
      o.status === "in_progress"
    )
      counts.inProgress++;
    else if (o.status === "ready_for_balance") counts.readyForBalance++;
    else if (o.status === "completed") counts.completed++;
    else if (o.status === "cancelled") counts.cancelled++;

    if (o.payments?.deposit?.status === "paid")
      revenuePaid += o.payments.deposit.amount;
    if (o.payments?.balance?.status === "paid")
      revenuePaid += o.payments.balance.amount;
    if (
      o.paymentMode !== "full" &&
      o.payments?.deposit?.status === "paid" &&
      o.payments?.balance?.status !== "paid"
    ) {
      revenueOwed += o.balance;
    }
  }

  // Last 7 days breakdown
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const days: { date: string; label: string; count: number; revenue: number }[] = [];
  for (let i = 6; i >= 0; i--) {
    const start = new Date(today);
    start.setDate(start.getDate() - i);
    const end = new Date(start);
    end.setDate(end.getDate() + 1);
    const inRange = allOrders.filter((o) => {
      const c = new Date(o.createdAt);
      return c >= start && c < end;
    });
    const dayRev = inRange.reduce(
      (s, o) =>
        s +
        (o.payments?.deposit?.status === "paid"
          ? o.payments.deposit.amount
          : 0) +
        (o.payments?.balance?.status === "paid"
          ? o.payments.balance.amount
          : 0),
      0,
    );
    days.push({
      date: start.toISOString().slice(0, 10),
      label: start.toLocaleDateString("en-GB", {
        weekday: "short",
        day: "numeric",
      }),
      count: inRange.length,
      revenue: +dayRev.toFixed(2),
    });
  }

  return {
    counts,
    revenue: { paid: +revenuePaid.toFixed(2), owed: +revenueOwed.toFixed(2) },
    customers,
    enquiries,
    recent: allOrders.slice(0, 6),
    days,
  };
}

const STATUS_LABEL: Record<Order["status"], string> = {
  pending_deposit: "Awaiting deposit",
  pending_payment: "Awaiting payment",
  deposit_paid: "Deposit received",
  paid_in_full: "Paid in full",
  in_progress: "Work in progress",
  ready_for_balance: "Ready for balance",
  completed: "Completed",
  cancelled: "Cancelled",
};

const STATUS_TONE: Record<Order["status"], string> = {
  pending_deposit: "bg-amber-500/15 text-amber-300",
  pending_payment: "bg-amber-500/15 text-amber-300",
  deposit_paid: "bg-bolt/15 text-bolt",
  paid_in_full: "bg-emerald-500/15 text-emerald-300",
  in_progress: "bg-blue-500/15 text-blue-300",
  ready_for_balance: "bg-purple-500/15 text-purple-300",
  completed: "bg-emerald-500/15 text-emerald-300",
  cancelled: "bg-zinc-500/15 text-zinc-400",
};

export default async function AdminDashboard() {
  const stats = await loadStats();
  const maxRev = Math.max(1, ...stats.days.map((d) => d.revenue));
  const maxCount = Math.max(1, ...stats.days.map((d) => d.count));

  const tiles = [
    {
      label: "Total orders",
      value: stats.counts.total,
      icon: BagIcon,
      accent: "bg-bolt/10 text-bolt",
    },
    {
      label: "Revenue collected",
      value: formatGBP(stats.revenue.paid),
      icon: ShieldIcon,
      accent: "bg-emerald-500/10 text-emerald-300",
    },
    {
      label: "Balance owed",
      value: formatGBP(stats.revenue.owed),
      icon: ChartIcon,
      accent: "bg-amber-500/10 text-amber-300",
    },
    {
      label: "Customers",
      value: stats.customers,
      icon: UsersIcon,
      accent: "bg-blue-500/10 text-blue-300",
    },
  ];

  const flow = [
    {
      label: "Awaiting payment",
      value: stats.counts.pending,
      tone: "bg-amber-500/5 border-amber-500/30",
    },
    {
      label: "In progress",
      value: stats.counts.inProgress,
      tone: "bg-blue-500/5 border-blue-500/30",
    },
    {
      label: "Ready for balance",
      value: stats.counts.readyForBalance,
      tone: "bg-purple-500/5 border-purple-500/30",
    },
    {
      label: "Completed",
      value: stats.counts.completed,
      tone: "bg-emerald-500/5 border-emerald-500/30",
    },
  ];

  return (
    <div className="space-y-8">
      <header>
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-bolt">
          Dashboard
        </p>
        <h1 className="mt-2 font-display text-3xl font-bold text-white sm:text-4xl">
          Welcome back
        </h1>
        <p className="mt-2 text-sm text-ash">
          Real-time view of orders, revenue and customers across Dave Electrical
          Services.
        </p>
      </header>

      {/* KPI tiles */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {tiles.map((t) => {
          const I = t.icon;
          return (
            <div
              key={t.label}
              className="relative overflow-hidden rounded-2xl border border-white/10 bg-graphite p-5"
            >
              <div className="flex items-start justify-between gap-3">
                <span
                  className={`grid h-10 w-10 place-items-center rounded-xl ${t.accent}`}
                >
                  <I className="h-5 w-5" />
                </span>
                <span className="text-[10px] uppercase tracking-wider text-ash">
                  Live
                </span>
              </div>
              <p className="mt-4 text-xs uppercase tracking-wider text-ash">
                {t.label}
              </p>
              <p className="mt-1 font-display text-2xl font-bold text-white sm:text-3xl">
                {t.value}
              </p>
            </div>
          );
        })}
      </div>

      {/* 7-day chart */}
      <section className="rounded-2xl border border-white/10 bg-graphite p-6">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="font-display text-lg font-bold text-white">
              Revenue — last 7 days
            </h2>
            <p className="text-xs text-ash">
              All payments received per day (deposit + balance).
            </p>
          </div>
          <p className="font-display text-2xl font-bold text-bolt">
            {formatGBP(stats.days.reduce((s, d) => s + d.revenue, 0))}
          </p>
        </div>
        <div className="mt-6 grid grid-cols-7 gap-2 sm:gap-3">
          {stats.days.map((d) => {
            const pct = (d.revenue / maxRev) * 100;
            const countPct = (d.count / maxCount) * 100;
            return (
              <div key={d.date} className="flex flex-col items-center">
                <div className="relative flex h-40 w-full items-end gap-1 rounded-lg border border-white/5 bg-ink/50 p-1">
                  <div
                    className="flex-1 rounded-t bg-gradient-to-t from-bolt-deep to-bolt"
                    style={{ height: `${Math.max(pct, 2)}%` }}
                    title={`Revenue ${formatGBP(d.revenue)}`}
                  />
                  <div
                    className="flex-1 rounded-t bg-gradient-to-t from-blue-700/60 to-blue-400/80"
                    style={{ height: `${Math.max(countPct, 2)}%` }}
                    title={`${d.count} orders`}
                  />
                </div>
                <p className="mt-2 text-[10px] uppercase tracking-wider text-ash">
                  {d.label}
                </p>
                <p className="text-[11px] font-semibold text-white">
                  {formatGBP(d.revenue)}
                </p>
              </div>
            );
          })}
        </div>
        <div className="mt-4 flex items-center gap-5 text-[11px] text-ash">
          <span className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-sm bg-bolt" /> Revenue
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-sm bg-blue-500" /> Orders
          </span>
        </div>
      </section>

      {/* Pipeline */}
      <section>
        <h2 className="font-display text-lg font-bold text-white">Pipeline</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {flow.map((f) => (
            <div
              key={f.label}
              className={`rounded-2xl border p-5 ${f.tone}`}
            >
              <p className="text-xs uppercase tracking-wider text-zinc-400">
                {f.label}
              </p>
              <p className="mt-2 font-display text-3xl font-bold text-white">
                {f.value}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Recent orders */}
      <section>
        <div className="flex items-center justify-between">
          <h2 className="font-display text-lg font-bold text-white">
            Recent orders
          </h2>
          <Link
            href="/admin/orders"
            className="group flex items-center gap-2 text-sm font-semibold text-bolt"
          >
            View all
            <ArrowIcon className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
        <div className="mt-4 overflow-hidden rounded-2xl border border-white/10 bg-graphite">
          <table className="w-full text-left text-sm">
            <thead className="bg-white/5 text-xs uppercase tracking-wider text-ash">
              <tr>
                <th className="px-5 py-3">Order</th>
                <th className="px-5 py-3">Customer</th>
                <th className="px-5 py-3">Items</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3 text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              {stats.recent.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-5 py-10 text-center text-sm text-ash"
                  >
                    No orders yet.
                  </td>
                </tr>
              ) : (
                stats.recent.map((o) => (
                  <tr
                    key={o._id.toString()}
                    className="border-t border-white/5 transition-colors hover:bg-white/[0.03]"
                  >
                    <td className="px-5 py-3">
                      <Link
                        href={`/admin/orders/${o._id.toString()}`}
                        className="font-display font-bold text-white hover:text-bolt"
                      >
                        #{o._id.toString().slice(-6).toUpperCase()}
                      </Link>
                      <p className="text-[11px] text-ash">
                        {new Date(o.createdAt).toLocaleDateString("en-GB", {
                          day: "numeric",
                          month: "short",
                        })}
                      </p>
                    </td>
                    <td className="px-5 py-3 text-zinc-200">
                      <p className="font-semibold">{o.customer.name}</p>
                      <p className="text-[11px] text-ash">
                        {o.customer.email}
                      </p>
                    </td>
                    <td className="px-5 py-3 text-zinc-300">
                      {o.items.length} item{o.items.length === 1 ? "" : "s"}
                    </td>
                    <td className="px-5 py-3">
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider ${
                          STATUS_TONE[o.status]
                        }`}
                      >
                        {STATUS_LABEL[o.status]}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-right font-bold text-bolt">
                      {formatGBP(o.subtotal)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-3">
        <Link
          href="/admin/orders"
          className="group flex items-center justify-between rounded-2xl border border-white/10 bg-graphite p-5 transition-colors hover:border-bolt/30"
        >
          <span className="flex items-center gap-3">
            <BagIcon className="h-5 w-5 text-bolt" />
            <span className="font-semibold text-white">Manage orders</span>
          </span>
          <ArrowIcon className="h-4 w-4 text-ash transition-transform group-hover:translate-x-1" />
        </Link>
        <Link
          href="/admin/enquiries"
          className="group flex items-center justify-between rounded-2xl border border-white/10 bg-graphite p-5 transition-colors hover:border-bolt/30"
        >
          <span className="flex items-center gap-3">
            <MailIcon className="h-5 w-5 text-bolt" />
            <span className="font-semibold text-white">
              View enquiries ({stats.enquiries})
            </span>
          </span>
          <ArrowIcon className="h-4 w-4 text-ash transition-transform group-hover:translate-x-1" />
        </Link>
        <Link
          href="/"
          className="group flex items-center justify-between rounded-2xl border border-white/10 bg-graphite p-5 transition-colors hover:border-bolt/30"
        >
          <span className="flex items-center gap-3">
            <ChartIcon className="h-5 w-5 text-bolt" />
            <span className="font-semibold text-white">Visit public site</span>
          </span>
          <ArrowIcon className="h-4 w-4 text-ash transition-transform group-hover:translate-x-1" />
        </Link>
      </section>
    </div>
  );
}
