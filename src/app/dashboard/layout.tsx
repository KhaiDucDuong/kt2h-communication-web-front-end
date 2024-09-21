export default function DashboardLayout({
    children,
  }: {
    children: React.ReactNode;
  }) {
    return (
      <section className="relative">
        {/* <div className="flex">
          <SideNavbar />
          <div className="w-full">{children}</div>
        </div> */}
        <div className="size-full">{children}</div>
      </section>
    );
  }
  