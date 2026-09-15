import { notFound, redirect } from "next/navigation";
import { ObjectId } from "mongodb";
import { getSession } from "@/lib/auth";
import { ordersCol, publicOrder } from "@/lib/orders";
import CertificateViewer from "@/components/CertificateViewer";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Your certificate",
  description: "View and download your Dave Electrical certificate.",
  robots: { index: false, follow: false },
};

export default async function CustomerCertificatePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getSession();
  if (!session) {
    const { id } = await params;
    redirect(`/login?next=/account/orders/${id}/certificate`);
  }

  const { id } = await params;
  if (!ObjectId.isValid(id)) notFound();

  const col = await ordersCol();
  const orderDoc = await col.findOne({
    _id: new ObjectId(id),
    userId: session.uid,
  });
  if (!orderDoc) notFound();

  const order = publicOrder(orderDoc);
  if (!order.certificate) {
    return (
      <div className="min-h-[80svh] bg-ink px-5 py-32 text-center text-white">
        <div className="mx-auto max-w-md rounded-3xl border border-white/10 bg-graphite p-10">
          <h1 className="font-display text-2xl font-bold">
            Certificate not issued yet
          </h1>
          <p className="mt-3 text-sm text-ash">
            Your certificate hasn&apos;t been issued for this order yet.
            We&apos;ll email you the moment it is.
          </p>
        </div>
      </div>
    );
  }

  return <CertificateViewer order={order} customerName={session.name} />;
}
