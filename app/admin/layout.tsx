import { redirect } from "next/navigation";
import { getSession, isAdminSession } from "@/lib/auth";
import AdminSidebar from "@/components/admin/AdminSidebar";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Admin Console — Dave Electrical Services",
  robots: { index: false, follow: false },
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  if (!session) redirect("/login?next=/admin");
  if (!isAdminSession(session)) redirect("/?error=admin-only");

  return (
    <div className="min-h-screen bg-ink text-zinc-100">
      <AdminSidebar user={{ name: session.name, email: session.email }} />
      <main className="min-h-screen lg:pl-64">
        <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8 sm:py-10">
          {children}
        </div>
      </main>
    </div>
  );
}
