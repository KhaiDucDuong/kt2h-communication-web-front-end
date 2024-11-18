"use client";
import { Input } from "@/components/ui/input";
import { SignInMessages, signUp } from "@/services/AuthService";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import Link from "next/link";
import { useRef, useState } from "react";
// @ts-ignore
import { useFormState, useFormStatus } from "react-dom";

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      className="bg-blue-2 h-[40px] w-full rounded-md text-white  mb-[8px] flex flex-row justify-center
          transition duration-150 ease-out hover:ease-in hover:bg-purple-1"
      aria-disabled={pending}
    >
      {pending ? (
        <div className="dot-flashing m-auto"></div>
      ) : (
        <div className="m-auto">Register</div>
      )}
    </button>
  );
}

const initialState: SignInMessages = {
  emailErrors: [],
  usernameErrors: [],
  first_nameErrors: [],
  last_nameErrors: [],
  passwordErrors: [],
  confirm_passwordErrors: [],
  serverErrors: [],
  successMessage: "",
  registeredEmail: "",
  hasRegisteredAccount: false,
};

const SignUp = () => {
  const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);
  const [isConfirmedPasswordVisible, setIsConfirmedPasswordVisible] =
    useState<boolean>(false);
  const formRef = useRef<HTMLFormElement>(null);
  const [state, formAction] = useFormState(signUp, initialState);

  if (formRef.current && state?.hasRegisteredAccount) {
    state.hasRegisteredAccount = false;
    formRef.current.reset();
  }

  // return <SignUpSuccess email="khai@gmail"/>

  return (
    <form
      action={formAction}
      id="signUpForm"
      className="w-fit p-[36px] h-fit max-sm:p-[20px]"
      ref={formRef}
    >
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
        <div className="flex flex-col flex-start mb-[20px]">
          <label
            htmlFor="email_input"
            className="text-white inline-block mb-[8px]"
          >
            Email<span className="ml-[0.5em] text-red-600">*</span>
          </label>
          <Input
            id="email_input"
            name="email"
            required
            type="email"
            placeholder="Enter your email"
            className="text-white bg-gray-8 border-gray-7 focus-visible:ring-0 placeholder:text-[#615E62]"
          />
          {state?.emailErrors && (
            <p className="text-red-1 my-[5px]">{state.emailErrors}</p>
          )}
        </div>
        <div className="flex flex-col flex-start mb-[20px]">
          <label
            htmlFor="username_input"
            className="text-white inline-block mb-[8px]"
          >
            Username<span className="ml-[0.5em] text-red-600">*</span>
          </label>
          <Input
            id="username_input"
            name="username"
            required
            type="text"
            placeholder="Enter your username"
            className=" text-white bg-gray-8 border-gray-7 focus-visible:ring-0 placeholder:text-[#615E62]"
          />
          {state?.usernameErrors && (
            <p className="text-red-1 my-[5px]">{state.usernameErrors}</p>
          )}
        </div>
        <div className="flex justify-between w-full mb-[20px]">
          <div className="flex flex-col flex-start w-[47%]">
            <label
              htmlFor="firstname_input"
              className="text-white inline-block mb-[8px]"
            >
              First name<span className="ml-[0.5em] text-red-600">*</span>
            </label>
            <Input
              id="firstname_input"
              name="firstName"
              required
              type="text"
              placeholder="Enter your first name"
              className=" text-white bg-gray-8 border-gray-7 focus-visible:ring-0 placeholder:text-[#615E62]"
            />
            {state?.first_nameErrors && (
              <p className="text-red-1 my-[5px]">{state.first_nameErrors}</p>
            )}
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
              name="lastName"
              required
              type="text"
              placeholder="Enter your last name"
              className=" text-white bg-gray-8 border-gray-7 focus-visible:ring-0 placeholder:text-[#615E62]"
            />
            {state?.last_nameErrors && (
              <p className="text-red-1 my-[5px]">{state.last_nameErrors}</p>
            )}
          </div>
        </div>
        <div className="flex flex-col flex-start">
          <label
            htmlFor="password_input"
            className="text-white inline-block mb-[8px]"
          >
            Password<span className="ml-[0.5em] text-red-600">*</span>
          </label>
          <div className="relative">
            <Input
              id="password_input"
              name="password"
              required
              type={isPasswordVisible ? "text" : "password"}
              placeholder="Enter your password"
              className=" text-white bg-gray-8 border-gray-7 focus-visible:ring-0 placeholder:text-[#615E62]"
            />
            {isPasswordVisible ? (
              <EyeIcon
                className="text-white absolute right-[15px] bottom-[8px] cursor-pointer z-10"
                strokeWidth={1.7}
                width={24}
                height={24}
                onClick={() => setIsPasswordVisible(!isPasswordVisible)}
              />
            ) : (
              <EyeOffIcon
                className="text-white absolute right-[15px] bottom-[8px] cursor-pointer z-10"
                strokeWidth={1.7}
                width={24}
                height={24}
                onClick={() => setIsPasswordVisible(!isPasswordVisible)}
              />
            )}
          </div>
          {state?.passwordErrors && (
            <p className="text-red-1 my-[5px]">{state.passwordErrors}</p>
          )}
        </div>
        <div className="flex flex-col flex-start mt-[20px]">
          <label
            htmlFor="confirm_password_input"
            className="text-white inline-block mb-[8px]"
          >
            Confirm password<span className="ml-[0.5em] text-red-600">*</span>
          </label>
          <div className="relative">
            <Input
              id="confirm_password_input"
              name="confirmPassword"
              required
              type={isConfirmedPasswordVisible ? "text" : "password"}
              placeholder="Enter your password"
              className=" text-white bg-gray-8 border-gray-7 focus-visible:ring-0 placeholder:text-[#615E62]"
            />
            {isConfirmedPasswordVisible ? (
              <EyeIcon
                className="text-white absolute right-[15px] bottom-[8px] cursor-pointer z-10"
                strokeWidth={1.7}
                width={24}
                height={24}
                onClick={() =>
                  setIsConfirmedPasswordVisible(!isConfirmedPasswordVisible)
                }
              />
            ) : (
              <EyeOffIcon
                className="text-white absolute right-[15px] bottom-[8px] cursor-pointer z-10"
                strokeWidth={1.7}
                width={24}
                height={24}
                onClick={() =>
                  setIsConfirmedPasswordVisible(!isConfirmedPasswordVisible)
                }
              />
            )}
          </div>
          {state?.confirm_passwordErrors && (
            <p className="text-red-1 my-[5px]">
              {state.confirm_passwordErrors}
            </p>
          )}
          <div className="mt-[20px]"></div>
          <SubmitButton />
          {state?.serverErrors && (
            <p className="text-red-1 my-[5px]">{state.serverErrors}</p>
          )}
          {state?.successMessage && (
            <div
              className="border-green-400 border-[1px]
            text-white max-w-[434px] self-center mb-[8px] p-[8px]"
            >
              <p className="font-bold mb-[6px]">
                Your account has been created.
              </p>
              <p>
                We sent an email to <span className="font-bold">{state.registeredEmail}</span>. Please check it to
                activate your account and get started.
              </p>
            </div>
          )}

          <Link href={"/sign-in"} className="text-blue-1 hover:underline">
            Already have an account?
          </Link>
        </div>
      </div>
    </form>
  );
};

export default SignUp;
