import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      <div>Home page</div>
      <Link href={"/sign-in"} className="text-blue-1 hover:underline">Sign in</Link>
      <Link href={"/direct-message"} className="text-blue-1 hover:underline">Messaging page</Link>
    </main>
  );
}
