import Link from "next/link";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="min-w-[100vw] min-h-[100vh] size-full flex flex-col justify-center bg-[#201D22] py-[40px]">
      <Link href={"/"} className="absolute top-[48px] left-[48px] text-[30px] text-white max-sm:top-[24px] max-sm:left-[24px]
      cursor-pointer">
        KT2H
      </Link>
      <div className="w-fit h-fit m-auto">{children}</div>
      {/* <div className="absolute top-0 right-0 min-w-[100vw] min-h-[100vh] h-[100%] bg-[#201D22] z-[-999]"></div> */}
    </section>
  );
}
