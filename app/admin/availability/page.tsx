import AvailabilityManager from "@/components/admin/AvailabilityManager";

export const dynamic = "force-dynamic";

export default function AdminAvailabilityPage() {
  return (
    <div className="space-y-6">
      <header>
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-bolt">
          Availability
        </p>
        <h1 className="mt-2 font-display text-3xl font-bold text-white">
          Same-day emergency slots
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-ash">
          Manage the bookable same-day emergency call-out slots customers see on
          the booking page. Booked slots are locked and can&apos;t be edited or
          deleted.
        </p>
      </header>

      <AvailabilityManager />
    </div>
  );
}
