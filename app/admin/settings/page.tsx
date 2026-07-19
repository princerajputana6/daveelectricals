import SettingsManager from "@/components/admin/SettingsManager";
import { getVatRate } from "@/lib/settings";

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  const vatRate = await getVatRate();

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
          Configure how pricing behaves across the site.
        </p>
      </header>

      <SettingsManager initialVatRate={vatRate} />
    </div>
  );
}
