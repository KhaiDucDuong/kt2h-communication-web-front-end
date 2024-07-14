import SideNavbar from "@/components/Dashboard/SideNavbar/SideNavbar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    <section className="flex flex-row min-h-screen">
      <SideNavbar />
      {children}
    </section>
  );
}
