import Link from "next/link";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="w-[100vw] h-[100vh] flex flex-col justify-center">
      <Link href={"/"} className="absolute top-[48px] left-[48px] text-[30px] text-white max-sm:top-[24px] max-sm:left-[24px]
      cursor-pointer">
        KT2H
      </Link>
      <div className="w-fit max-w-[80%] max-sm:max-w-[93%] h-fit m-auto">{children}</div>
      <div className="absolute top-0 right-0 w-[100vw] h-[100vh] bg-[#201D22] z-[-999]"></div>
    </section>
  );
}
