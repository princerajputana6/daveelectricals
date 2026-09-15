import SettingsManager from "@/components/admin/SettingsManager";
import { getVatRate } from "@/lib/settings";
import { qbConfigured, isQuickBooksConnected, loadQbConfig } from "@/lib/quickbooks";

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage({
  searchParams,
}: {
  searchParams: Promise<{ qb?: string }>;
}) {
  const vatRate = await getVatRate();
  const configured = qbConfigured();
  const connected = configured ? await isQuickBooksConnected() : false;
  const cfg = connected ? await loadQbConfig() : null;
  const { qb } = await searchParams;

  const qbNote: Record<string, string> = {
    connected: "QuickBooks connected successfully.",
    error: "QuickBooks connection failed — please try again.",
    state_error: "Security check failed — please retry the connection.",
    no_realm: "No QuickBooks company was returned — please retry.",
  };

  return (
    <div className="space-y-6">
      <header>
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-bolt">
          Settings
        </p>
        <h1 className="mt-2 font-display text-3xl font-bold text-white">
          Store settings
        </h1>
        <p className="mt-1 text-xs text-ash">
          Configure pricing and connected accounting.
        </p>
      </header>

      <SettingsManager initialVatRate={vatRate} />

      {/* QuickBooks integration */}
      <div className="max-w-xl rounded-2xl border border-white/10 bg-graphite p-6">
        <h2 className="font-display text-lg font-bold text-white">
          QuickBooks Online
        </h2>
        <p className="mt-1 text-xs text-ash">
          When connected, every paid order is automatically invoiced, synced to
          QuickBooks, PDF-generated, stored, and emailed to the customer.
        </p>

        {qb && qbNote[qb] && (
          <p
            className={`mt-4 rounded-lg border px-3 py-2 text-xs font-semibold ${
              qb === "connected"
                ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
                : "border-red-500/30 bg-red-500/10 text-red-300"
            }`}
          >
            {qbNote[qb]}
          </p>
        )}

        <div className="mt-5 flex items-center justify-between gap-4">
          <div className="text-sm">
            <span className="text-ash">Status: </span>
            {!configured ? (
              <span className="font-semibold text-amber-300">
                Not configured (set QB_* env vars)
              </span>
            ) : connected ? (
              <span className="font-semibold text-emerald-300">
                Connected{cfg?.realmId ? ` · company ${cfg.realmId}` : ""}
              </span>
            ) : (
              <span className="font-semibold text-amber-300">Not connected</span>
            )}
          </div>
          {configured && (
            <a
              href="/api/quickbooks/connect"
              className="rounded-full bg-bolt px-5 py-2.5 text-sm font-bold text-ink transition-transform hover:scale-[1.04]"
            >
              {connected ? "Reconnect" : "Connect QuickBooks"}
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
