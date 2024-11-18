"use client";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import {
  getCurrentUserAndRefreshToken,
  GetCurrentUserAndRefreshTokenMessages,
  getGoogleLoginConsentPage,
  resendActivationMail,
  setAccessTokenCookie,
  setAuthResultCookie,
  signIn,
} from "@/services/AuthService";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
// @ts-ignore
import { useFormState, useFormStatus } from "react-dom";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";

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
        <div className="m-auto">Login</div>
      )}
    </button>
  );
}

const initialState = {
  errorMessage: "",
  unactivatedEmail: "",
};

export enum AuthResult {
  INCOMPLETE_REQUIRE_ACCOUNT_REGISTRATION = "INCOMPLETE_REQUIRE_ACCOUNT_REGISTRATION",
  COMPLETE_AUTHENTICATION = "COMPLETE_AUTHENTICATION",
}

const SignIn = () => {
  const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);
  const [state, formAction] = useFormState(signIn, initialState);
  const [emailResendCoolDown, setEmailResendCoolDown] = useState<number>(0);
  const [isSendingEmail, setIsSendingEmail] = useState<boolean>(false);
  const [oauth2Error, setOauth2Error] = useState<string>("");
  const [isAuthentingOauth2, setIsAuthentingOauth2] = useState(true);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    let ignore = false;

    async function processOauth2Results(token: string, auth_result: string) {
      await setAccessTokenCookie(token);
      if (
        auth_result ===
        AuthResult.INCOMPLETE_REQUIRE_ACCOUNT_REGISTRATION.toString()
      ) {
        await setAuthResultCookie(auth_result);
        router.replace("/oauth2/account-registration");
      } else if (
        auth_result === AuthResult.COMPLETE_AUTHENTICATION.toString()
      ) {
        const results: GetCurrentUserAndRefreshTokenMessages =
          await getCurrentUserAndRefreshToken();
        if (results && !results.isSuccess) {
          setOauth2Error(
            "Oauth2 login failed. Please try again or login using username and password."
          );
          setIsAuthentingOauth2(false);
        }
      }
    }

    const token = searchParams.get("token");
    const auth_result = searchParams.get("auth_result");

    if (token && auth_result && !ignore) {
      processOauth2Results(token, auth_result);
    } else {
      setIsAuthentingOauth2(false);
    }

    return () => {
      ignore = true;
      setIsAuthentingOauth2(true);
    };
  }, []);

  useEffect(() => {
    // exit early when we reach 0
    if (!emailResendCoolDown) return;

    // save intervalId to clear the interval when the
    // component re-renders
    const intervalId = setInterval(() => {
      setEmailResendCoolDown(emailResendCoolDown - 1);
    }, 1000);

    // clear interval on re-render to avoid memory leaks
    return () => clearInterval(intervalId);
    // add timeLeft as a dependency to re-rerun the effect
    // when we update it
  }, [emailResendCoolDown]);

  async function onResendClick() {
    if (state?.unactivatedEmail.length > 0) {
      setIsSendingEmail(true);
      const hasSent = await resendActivationMail(state.unactivatedEmail);
      setIsSendingEmail(false);
      if (hasSent) setEmailResendCoolDown(30);
    }
  }

  if (isAuthentingOauth2)
    return (
      <div className="flex flex-col">
        <div className="loader self-center mb-[28px]"></div>
        <div className="text-[#B0B0B0] text-lg">Processing login...</div>
      </div>
    );

  return (
    <section
      className=" bg-gray-8 flex flex-row justify-center
    rounded-[15px] "
    >
      <form
        action={formAction}
        className="w-fit p-[36px] h-fit max-sm:p-[20px] "
      >
        <div className="mb-[20px]">
          <h1 className="text-white text-[48px] max-sm:text-[36px]">
            Welcome back
          </h1>
          <p className="text-white text-[20px] max-sm:text-[16px]">
            We&apos;re so excited to see you again!
          </p>
        </div>
        <div className="min-w-[434px]">
          <div className="flex justify-between mb-[18px] w-full">
            <div
              // target="_blank"
              // href={`${process.env.NEXT_PUBLIC_GOOGLE_LOGIN_API}`}
              // rel="noopener noreferrer"
              className="text-[16px] w-full h-[50px] border-[2px] border-gray-7 rounded-[10px] flex justify-center px-[12px] py-[8px]
            cursor-pointer hover:border-white"
              onClick={() => {
                getGoogleLoginConsentPage();
              }}
            >
              <Image
                src={"/assets/images/google-512.webp"}
                alt="Google icon"
                width={512}
                height={512}
                className="w-[30px] h-[30px] mr-[10px] "
              />{" "}
              <p className="text-white relative top-[3px]">
                <span className="max-sm:hidden"></span>Login with Google
              </p>
            </div>
            {/* <div
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
            <p className="m-auto text-white">
              <span className="max-sm:hidden">Login with</span> Facebook
            </p>
          </div> */}
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
              required
              name="username"
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
                required
                name="password"
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
              <Link
                href={"/forgot-password"}
                className="text-blue-1 hover:underline"
              >
                Forgot your password?
              </Link>
            </div>
            <SubmitButton />
            {state?.errorMessage &&
              state?.errorMessage !== "Account is unactivated" && (
                <p className="text-red-1 my-[5px]">{state.errorMessage}</p>
              )}
            {oauth2Error && (
              <p className="text-red-1 my-[5px]">{oauth2Error}</p>
            )}
            {state?.errorMessage === "Account is unactivated" && (
              // <p className="text-red-1 my-[5px]">hello</p>
              <div
                className="border-yellow-400 border-[1px] min-w-full mt-[8px]
            text-white max-w-[434px] mb-[8px] p-[8px]"
              >
                <p className="font-bold mb-[6px]">
                  Your account has not been activated.
                </p>
                <p className="mb-[6px]">
                  We&apos;ve sent an email to{" "}
                  <span className="font-bold">{state.unactivatedEmail}</span>.
                  Please check it to activate your account before logging in.
                </p>
                <div className="flex flex-row">
                  <p className="text-[14px] mr-[5px]">
                    <span className="max-sm:hidden">
                      Can&apos;t find the activation email?{" "}
                    </span>
                    Click here to resend.
                  </p>
                  <button
                    type="button"
                    className="text-[14px] relative bottom-[1px] bg-blue-2 h-[20px] px-[7px] py-[5px] min-w-[64px] w-fit rounded-md text-white flex flex-row justify-center
          transition duration-150 ease-out hover:ease-in hover:bg-purple-1 items-center cursor-pointer"
                    disabled={emailResendCoolDown !== 0 || isSendingEmail}
                    onClick={() => onResendClick()}
                  >
                    {isSendingEmail ? (
                      <span className="dot-flashing"></span>
                    ) : (
                      <span>
                        {emailResendCoolDown === 0
                          ? "Resend"
                          : emailResendCoolDown}
                      </span>
                    )}
                  </button>
                </div>
              </div>
            )}
            <p className="text-white">
              Need an account?{" "}
              <Link href={"/sign-up"} className="text-blue-1 hover:underline">
                Register
              </Link>
            </p>
          </div>
        </div>
      </form>
    </section>
  );
};

export default SignIn;
