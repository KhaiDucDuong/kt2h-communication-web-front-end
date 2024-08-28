"use client";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";

const ActivatePage = () => {
  const searchParams = useSearchParams();
  const key = searchParams.get("key") || "empty";

  useEffect(() => {
    async function useActivationKey(key: string) {}
  }, []);

  return (
    <section
      className="w-fit bg-gray-8 flex flex-row justify-center
    rounded-[15px]"
    >
      <div className="w-fit h-fit p-[36px]">
        <div className="flex justify-center mb-[20px]">
          <Image
            src={"/assets/images/check-mail.png"}
            width={512}
            height={512}
            alt="mail activation success"
            className="size-[162px]"
          />
        </div>
        <div className="text-white">
          <p className="text-[36px] font-bold">Verification Success</p>
          <p className="text-[20px]">
            Your account with email johhny@gmail.com has been activated.
          </p>
          <Link
            href={"/sign-in"}
            className="bg-blue-2 h-[40px] w-full rounded-md text-white  mb-[8px] flex flex-row justify-center
          transition duration-150 ease-out hover:ease-in hover:bg-purple-1 mt-[20px]"
          >
            <div className="m-auto">Back to Login</div>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ActivatePage;
