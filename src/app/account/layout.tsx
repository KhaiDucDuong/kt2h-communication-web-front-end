import Header from "@/components/Header/Header"
export default function AccountLayout({
    children,
  }: {
    children: React.ReactNode
  }) {
    return (
      <section>
        <Header />
        <div>Layout from Account</div>
        {children}
      </section>
    )
  }