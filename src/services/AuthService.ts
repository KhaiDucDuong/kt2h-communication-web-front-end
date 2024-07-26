"use server";

import { loginSchema, registerSchema } from "@/types/auth";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export interface SignInMessages {
  emailErrors?: string[];
  usernameErrors?: string[];
  first_nameErrors?: string[];
  last_nameErrors?: string[];
  passwordErrors?: string[];
  confirm_passwordErrors?: string[];
  serverErrors?: string[];
  successMessage?: "";
  hasRegisteredAccount: boolean;
}

export async function signUp(
  prevState: SignInMessages,
  formData: FormData
): Promise<SignInMessages> {
  const schema = registerSchema;

  const data = {
    email: formData.get("email"),
    username: formData.get("username"),
    first_name: formData.get("firstName"),
    last_name: formData.get("lastName"),
    password: formData.get("password"),
    confirm_password: formData.get("confirmPassword"),
  };

  const parse = schema.safeParse(data);

  if (!parse.success) {
    const parseResult = parse.error.flatten().fieldErrors;
    console.log("Form data parsed result: " + parseResult);
    return {
      emailErrors: parseResult.email,
      usernameErrors: parseResult.username,
      first_nameErrors: parseResult.first_name,
      last_nameErrors: parseResult.last_name,
      passwordErrors: parseResult.password,
      confirm_passwordErrors: parseResult.confirm_password,
      hasRegisteredAccount: false,
    };
  }

  const bodyData = parse.data;
  console.log("Sign Up Form data: " + bodyData);

  try {
    const response = await fetch(`${process.env.REGISTER_API}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(bodyData),
      cache: "no-cache",
    });

    const result = await response.json();
    console.log("Response result: " + JSON.stringify(result));
    if (result.statusCode === 201) {
      //other logics
      return { successMessage: result.message, hasRegisteredAccount: true };
    }
    return { serverErrors: result.error, hasRegisteredAccount: false };
  } catch (error) {
    console.log("Error fetching sign up: " + error);
    return {
      serverErrors: ["Something went wrong: " + error],
      hasRegisteredAccount: false,
    };
  }
}

export async function signIn(
  prevState: { errorMessage: string },
  formData: FormData
): Promise<{ errorMessage: string }> {
  const cookieStore = cookies();
  const schema = loginSchema;

  const data = {
    username: formData.get("username"),
    password: formData.get("password"),
  };

  const parse = schema.safeParse(data);

  if (!parse.success) {
    return {
      errorMessage: "Username or password is not in the correct format",
    };
  }

  const bodyData = parse.data;
  console.log("Sign In Form data: " + bodyData);

  let response;
  try {
    response = await fetch(`${process.env.LOGIN_API}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(bodyData),
      cache: "no-cache",
    });
  } catch (error) {
    console.log("Error calling sign in api: " + error);
    return { errorMessage: "Something went wrong: " + error };
  }

  const result = await response.json();
  console.log("Response result: " + JSON.stringify(result));

  if (result.statusCode === 200) {
    //get refresh token from response cookies and set it to next server cookie
    const setCookies = response.headers.getSetCookie();
    const refreshTokenExpiration = 90 * 24 * 60 * 60 * 1000 //90 days
    setCookies.forEach((cookie) => {
      cookie.match("refresh_token=");
      const refreshTokenValue = cookie.split("refresh_token=")[1];
      cookieStore.set({
        name: "refresh_token",
        value: refreshTokenValue,
        httpOnly: true,
        sameSite: "strict",
        secure: true,
        expires: Date.now() + refreshTokenExpiration
      });

      const accessTokenExpiration = 10 * 60 * 1000 //10 minutes
      cookieStore.set({
        name: "access_token",
        value: result.data.access_token,
        httpOnly: true,
        sameSite: "strict",
        secure: true,
        expires: Date.now() + accessTokenExpiration
      });

      cookieStore.set({
        name: "user_session",
        value: JSON.stringify(result.data.user),
        httpOnly: true,
        sameSite: "strict",
        secure: true,
      });
    });
    redirect("/direct-message");
  } else if (result.statusCode === 401) {
    return { errorMessage: "Username or password is incorrect" };
  }

  return { errorMessage: result.error };
}
