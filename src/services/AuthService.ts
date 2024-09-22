"use server";

import { loginSchema, registerSchema } from "@/types/auth";
import {
  accessTokenCookieName,
  refreshTokenCookieName,
  userSessionCookieName,
} from "@/utils/constants";
import { faL } from "@fortawesome/free-solid-svg-icons";
import { access } from "fs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

// export const accessTokenCookieName = "access_token";
// export const refreshTokenCookieName = "refresh_token";
// export const userSessionCookieName = "user_session";

export interface SignInMessages {
  emailErrors?: string[];
  usernameErrors?: string[];
  first_nameErrors?: string[];
  last_nameErrors?: string[];
  passwordErrors?: string[];
  confirm_passwordErrors?: string[];
  serverErrors?: string[];
  successMessage?: "";
  registeredEmail?: "";
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
      return {
        successMessage: result.message,
        registeredEmail: result.data.email,
        hasRegisteredAccount: true,
      };
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
    const refreshTokenExpiration = 90 * 24 * 60 * 60 * 1000; //90 days
    setCookies.forEach((cookie) => {
      cookie.match("refresh_token=");
      const refreshTokenValue = cookie.split("refresh_token=")[1];
      setAuthCookies(
        result.data.access_token,
        refreshTokenValue,
        JSON.stringify(result.data.user)
      );
    });

    redirect("/dashboard");
  } else if (result.statusCode === 401) {
    return { errorMessage: "Username or password is incorrect" };
  }

  return { errorMessage: result.error };
}

interface ActivationAccountResponse {
  success: boolean;
  username: string;
}

export async function activateAccount(
  key: string
): Promise<ActivationAccountResponse> {
  let result: ActivationAccountResponse = {
    success: false,
    username: "",
  };

  if (key === null || key.length !== 20) {
    return result;
  }

  try {
    const response = await fetch(
      `${process.env.ACTIVATE_ACCOUNT_API}?key=${key}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-cache",
      }
    );

    const result = await response.json();
    console.log("Response result: " + JSON.stringify(result));

    if (result.statusCode === 200) {
      result.success = true;
      result.username = result.data.username;
      return result;
    }
  } catch (error) {
    console.log("Error calling activate account api: " + error);
    result.success = false;
    return result;
  }
  return result;
}

export async function logOut(isRedirect: boolean = true) {
  const cookieStore = cookies();
  const refreshToken = cookieStore.get("refresh_token");

  if (refreshToken?.value) {
    try {
      const response = await fetch(`${process.env.LOGOUT_API}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Cookie: `${refreshTokenCookieName}=${refreshToken?.value};`,
        },
        cache: "no-cache",
      });

      if (response.status === 200) {
        console.log("Request to log out successfully");
      } else {
        console.log("Request to log out failed");
      }
    } catch (error) {
      console.log("Error fetching logging out api: " + error);
    }
  } else console.log("Error: No refresh token found when logging out");

  cookieStore.delete(refreshTokenCookieName);
  cookieStore.delete(accessTokenCookieName);
  cookieStore.delete(userSessionCookieName);
  if (isRedirect) {
    redirect("/");
  }
}

export async function getAccessToken(redirectIfFail: boolean = true) {
  const cookieStore = cookies();
  let accessToken = cookieStore.get("access_token");

  if (accessToken === undefined) {
    //use refresh token
    const refreshToken = cookieStore.get("refresh_token");
    if (refreshToken === undefined) {
      await logOut(redirectIfFail);
      return;
    }

    let response;
    try {
      response = await fetch(`${process.env.USE_REFRESH_TOKEN_API}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Cookie: `${refreshTokenCookieName}=${refreshToken?.value};`,
        },
        cache: "no-cache",
      });
    } catch (error) {
      console.log("Error fetching using refresh token: " + error);
      await logOut(redirectIfFail);
      return;
    }

    const result = await response.json();
    console.log("Refresh token response result: " + JSON.stringify(result));
    if (result.statusCode === 200) {
      //get refresh token from response cookies and set it to next server cookie
      const setCookies = response.headers.getSetCookie();
      setCookies.forEach((cookie) => {
        cookie.match("refresh_token=");
        const refreshTokenValue = cookie.split("refresh_token=")[1];
        setAuthCookies(
          result.data.access_token,
          refreshTokenValue,
          JSON.stringify(result.data.user)
        );
      });
      return result.data.access_token;
    } else {
      await logOut(redirectIfFail);
      return;
    }
  }

  return accessToken?.value;
}

async function setAuthCookies(
  accessToken: string,
  refreshToken: string,
  user: any
) {
  const cookieStore = cookies();
  const refreshTokenExpiration = 90 * 24 * 60 * 60 * 1000; //90 days
  cookieStore.set({
    name: refreshTokenCookieName,
    value: refreshToken,
    httpOnly: true,
    sameSite: "strict",
    secure: true,
    expires: Date.now() + refreshTokenExpiration,
  });

  const accessTokenExpiration = 60 * 60  * 1000; //60 minutes
  cookieStore.set({
    name: accessTokenCookieName,
    value: accessToken,
    httpOnly: true,
    sameSite: "strict",
    secure: true,
    expires: Date.now() + accessTokenExpiration,
  });

  cookieStore.set({
    name: userSessionCookieName,
    value: user,
    httpOnly: true,
    sameSite: "strict",
    secure: true,
  });
}
