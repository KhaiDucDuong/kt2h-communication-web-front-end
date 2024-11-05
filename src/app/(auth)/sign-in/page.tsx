import SignIn from "@/components/Auth/SignIn";
import { Suspense } from "react";

export default function SignInPage() {
  return (
    <section
      className=" bg-gray-8 flex flex-row justify-center
    rounded-[15px] "
    >
      <Suspense fallback={<div className="loader"></div>}>
        <SignIn />
      </Suspense>
    </section>
  );
}
