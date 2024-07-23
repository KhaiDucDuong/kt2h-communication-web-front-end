"use client";
import { Input } from "@/components/ui/input";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const SignIn = () => {
  const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);
  return (
    <section className="w-fit p-[36px] h-fit max-sm:p-[20px] ">
      <div className="mb-[20px]">
        <h1 className="text-white text-[48px] max-sm:text-[36px]">Welcome back</h1>
        <p className="text-white text-[20px] max-sm:text-[16px]">
          We're so excited to see you again!
        </p>
      </div>
      <div>
        <div className="flex justify-between mb-[18px] w-[500px] max-sm:w-[310px]">
          <div
            className="text-[16px] w-[230px] max-sm:w-[135px] h-[50px] border-[2px] border-gray-7 rounded-[10px] flex justify-center px-[12px] py-[8px]
            cursor-pointer hover:border-white"
            onClick={() => {}}
          >
            <Image
              src={"/assets/images/google-512.webp"}
              alt="Google icon"
              width={512}
              height={512}
              className="w-[30px] h-[30px] mr-[10px] m-auto"
            />{" "}
            <p className="m-auto text-white"><span className="max-sm:hidden">Login with</span> Google</p>
          </div>
          <div
            className="text-[16px] w-[230px] max-sm:w-[135px] h-[50px] border-[2px] border-gray-7 rounded-[10px] flex justify-center px-[12px] py-[8px]
            cursor-pointer hover:border-white"
            onClick={() => {}}
          >
            <Image
              src={"/assets/images/facebook.png"}
              alt="Facebook icon"
              width={512}
              height={512}
              className="w-[30px] h-[30px] mr-[10px] m-auto"
            />{" "}
            <p className="m-auto text-white"><span className="max-sm:hidden">Login with</span> Facebook</p>
          </div>
        </div>
        <div
          className="w-full border-b-[2px] border-gray-7 text-center my-[10px] mb-[20px]
          leading-[0.1em]"
        >
          <span className="px-[10px] bg-[#2C282E] text-[#888689]">or</span>
        </div>
      </div>
      <div className="h-full flex flex-col justify-start">
        <div className="flex flex-col flex-start">
          <label
            htmlFor="username_email_input"
            className="text-white inline-block mb-[8px]"
          >
            Username or Email
          </label>
          <Input
            id="username_email_input"
            type="text"
            placeholder="Enter your username or email"
            className="mb-[20px] text-white bg-gray-8 border-gray-7 focus-visible:ring-0 placeholder:text-[#615E62]"
          />
        </div>
        <div className="flex flex-col flex-start">
          <label
            htmlFor="password_input"
            className="text-white inline-block mb-[8px]"
          >
            Password
          </label>
          <div className="relative mb-[20px]">
            <Input
              id="password_input"
              type={isPasswordVisible ? "text" : "password"}
              placeholder="Enter your password"
              className="mb-[8px] text-white bg-gray-8 border-gray-7 focus-visible:ring-0 placeholder:text-[#615E62]"
            />
            {isPasswordVisible ? (
              <EyeIcon
                className="text-white absolute right-[15px] bottom-[40px] cursor-pointer z-10"
                strokeWidth={1.7}
                width={24}
                height={24}
                onClick={() => setIsPasswordVisible(!isPasswordVisible)}
              />
            ) : (
              <EyeOffIcon
                className="text-white absolute right-[15px] bottom-[40px] cursor-pointer z-10"
                strokeWidth={1.7}
                width={24}
                height={24}
                onClick={() => setIsPasswordVisible(!isPasswordVisible)}
              />
            )}
            <Link href={"/forgot-password"} className="text-blue-1 hover:underline">Forgot your password?</Link>
          </div>
          <button className="bg-blue-2 h-[40px] w-full rounded-md text-white hover:bg-purple-1 mb-[8px]">
                Login
          </button>
          <p className="text-white">Need an account? <Link href={"/sign-up"} className="text-blue-1 hover:underline">Register</Link></p>
        </div>
      </div>
    </section>
  );
};

export default SignIn;
