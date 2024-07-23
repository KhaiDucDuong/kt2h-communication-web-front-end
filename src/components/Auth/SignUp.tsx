"use client";
import { Input } from "@/components/ui/input";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const SignUp = () => {
  const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);
  return (
    <section className="w-fit p-[36px] h-fit max-sm:p-[20px] ">
      <div className="mb-[20px]">
        <h1 className="text-white text-[48px] max-sm:text-[36px]">
          Get started now
        </h1>
        <p className="text-white text-[20px] max-sm:text-[16px]">
          Enter your credentials to create your account
        </p>
      </div>
      <div>
        <div
          className="w-full border-b-[2px] border-gray-7 text-center my-[10px] mb-[20px]
          leading-[0.1em]"
        ></div>
      </div>
      <div className="h-full flex flex-col justify-start">
        <div className="flex flex-col flex-start">
          <label
            htmlFor="email_input"
            className="text-white inline-block mb-[8px]"
          >
            Email<span className="ml-[0.5em] text-red-600">*</span>
          </label>
          <Input
            id="email_input"
            required
            type="email"
            placeholder="Enter your email"
            className="mb-[20px] text-white bg-gray-8 border-gray-7 focus-visible:ring-0 placeholder:text-[#615E62]"
          />
        </div>
        <div className="flex flex-col flex-start">
          <label
            htmlFor="username_input"
            className="text-white inline-block mb-[8px]"
          >
            Username<span className="ml-[0.5em] text-red-600">*</span>
          </label>
          <Input
            id="username_input"
            required
            type="text"
            placeholder="Enter your username"
            className="mb-[20px] text-white bg-gray-8 border-gray-7 focus-visible:ring-0 placeholder:text-[#615E62]"
          />
        </div>
        <div className="flex justify-between w-full">
          <div className="flex flex-col flex-start w-[47%]">
            <label
              htmlFor="firstname_input"
              className="text-white inline-block mb-[8px]"
            >
              First name<span className="ml-[0.5em] text-red-600">*</span>
            </label>
            <Input
              id="firstname_input"
              required
              type="text"
              placeholder="Enter your first name"
              className="mb-[20px] text-white bg-gray-8 border-gray-7 focus-visible:ring-0 placeholder:text-[#615E62]"
            />
          </div>
          <div className="flex flex-col flex-start w-[47%]">
            <label
              htmlFor="lastname_input"
              className="text-white inline-block mb-[8px]"
            >
              Last name<span className="ml-[0.5em] text-red-600">*</span>
            </label>
            <Input
              id="lastname_input"
              required
              type="text"
              placeholder="Enter your last name"
              className="mb-[20px] text-white bg-gray-8 border-gray-7 focus-visible:ring-0 placeholder:text-[#615E62]"
            />
          </div>
        </div>
        <div className="flex flex-col flex-start">
          <label
            htmlFor="password_input"
            className="text-white inline-block mb-[8px]"
          >
            Password<span className="ml-[0.5em] text-red-600">*</span>
          </label>
          <div className="relative mb-[20px]">
            <Input
              id="password_input"
              required
              type={isPasswordVisible ? "text" : "password"}
              placeholder="Enter your password"
              className="mb-[8px] text-white bg-gray-8 border-gray-7 focus-visible:ring-0 placeholder:text-[#615E62]"
            />
            {isPasswordVisible ? (
              <EyeIcon
                className="text-white absolute right-[15px] bottom-[16px] cursor-pointer z-10"
                strokeWidth={1.7}
                width={24}
                height={24}
                onClick={() => setIsPasswordVisible(!isPasswordVisible)}
              />
            ) : (
              <EyeOffIcon
                className="text-white absolute right-[15px] bottom-[16px] cursor-pointer z-10"
                strokeWidth={1.7}
                width={24}
                height={24}
                onClick={() => setIsPasswordVisible(!isPasswordVisible)}
              />
            )}
          </div>
          <button className="bg-blue-2 h-[40px] w-full rounded-md text-white hover:bg-purple-1 mb-[8px]">
            Register
          </button>
          <Link href={"/sign-in"} className="text-blue-1 hover:underline">
            Already have an account?
          </Link>
        </div>
      </div>
    </section>
  );
};

export default SignUp;
