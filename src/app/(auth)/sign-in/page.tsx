import SignIn from "@/components/Auth/SignIn";
import { Suspense } from "react";

export default function SignInPage() {
  return (
    <Suspense fallback={<div className="loader"></div>}>  
        <SignIn />
    </Suspense>
  );
}
