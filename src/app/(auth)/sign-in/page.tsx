
import SignIn from "@/components/Auth/SignIn";
import Image from "next/image";

export default function SignInPage() {
  return (
    <section
      className=" bg-gray-8 flex flex-row justify-center
    rounded-[15px] "
    >
      <SignIn />
    </section>
  );
}
