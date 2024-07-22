import Image from "next/image";

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="w-[100vw] h-[100vh] flex flex-col justify-center">
      <div className="min-w-[396px] h-fit m-auto">{children}</div>
      <div className="absolute top-0 right-0 w-[100vw] h-[100vh] bg-[#201D22] z-[-999]"></div>
    </section>
  );
}
