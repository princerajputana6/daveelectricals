import { getDb } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export const dynamic = "force-dynamic";

export default async function AdminEnquiriesPage() {
  const db = await getDb();
  const list = await db
    .collection("contacts")
    .find({})
    .sort({ submittedAt: -1 })
    .limit(200)
    .toArray();

  return (
    <div className="space-y-6">
      <header>
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-bolt">
          Enquiries
        </p>
        <h1 className="mt-2 font-display text-3xl font-bold text-white">
          Contact form submissions
          <span className="ml-3 rounded-full bg-bolt/15 px-2.5 py-0.5 align-middle text-sm font-semibold text-bolt">
            {list.length}
          </span>
        </h1>
      </header>

      <div className="space-y-4">
        {list.length === 0 ? (
          <p className="rounded-2xl border border-white/10 bg-graphite p-8 text-center text-sm text-ash">
            No enquiries yet.
          </p>
        ) : (
          list.map((e) => {
            const id = e._id instanceof ObjectId ? e._id.toString() : String(e._id);
            return (
              <article
                key={id}
                className="rounded-2xl border border-white/10 bg-graphite p-5"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="font-display text-base font-bold text-white">
                      {e.name}
                    </p>
                    <p className="text-xs text-ash">
                      {e.email}
                      {e.phone ? ` · ${e.phone}` : ""}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="rounded-full bg-bolt/10 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-bolt">
                      {e.service}
                    </span>
                    <p className="mt-1 text-[11px] text-ash">
                      {new Date(e.submittedAt).toLocaleString("en-GB", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
                <p className="mt-3 whitespace-pre-wrap text-sm text-zinc-300">
                  {e.message}
                </p>
              </article>
            );
          })
        )}
      </div>
    </div>
  );
}
