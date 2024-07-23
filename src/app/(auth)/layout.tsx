export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="w-[100vw] h-[100vh] flex flex-col justify-center">
      <h1 className="absolute top-[48px] left-[48px] text-[30px] text-white max-sm:top-[24px] max-sm:left-[24px]">
        KT2H
      </h1>
      <div className="w-fit h-fit m-auto">{children}</div>
      <div className="absolute top-0 right-0 w-[100vw] h-[100vh] bg-[#201D22] z-[-999]"></div>
    </section>
  );
}
