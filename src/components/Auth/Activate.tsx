"use client";

import { activateAccount } from "@/services/AuthService";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
const Activate = () => {
  const searchParams = useSearchParams();
  const key = searchParams.get("key");
  const [activationSuccess, setActivationSuccess] = useState<boolean>(false);
  const [accountUsername, setAccountUsername] = useState<string>("");

  useEffect(() => {
    if (key != null)
      activateAccount(key).then((data) => {
        setActivationSuccess(data.success);
        setAccountUsername(data.username);
      });
  }, []);

  return ( 
      <section
        className="w-fit bg-gray-8 flex flex-row justify-center
      rounded-[15px]"
      >
        <div className="w-fit min-w-[440px] h-fit p-[36px]">
          <div className="flex justify-center mb-[20px]">
            <Image
              src={
                activationSuccess
                  ? "/assets/images/check-mail.png"
                  : "/assets/images/cross-mail.png"
              }
              width={512}
              height={512}
              alt={
                activationSuccess
                  ? "mail activation success"
                  : "mail activation fail"
              }
              className="size-[162px]"
            />
          </div>
          <div className="text-white">
            <p className="text-[36px] font-bold">
              {activationSuccess ? "Verification Success" : "Verification Fail"}
            </p>
            <p className="text-[20px]">
              {activationSuccess
                ? `Your account ${accountUsername} has been activated.`
                : "Invalid activation key."}
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

export default Activate;
