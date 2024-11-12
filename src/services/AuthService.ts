"use server";

import { AuthResult } from "@/components/Auth/SignIn";
import {
  loginSchema,
  oauth2AccountRegistrationSchema,
  registerSchema,
} from "@/types/auth";
import { UserResponse } from "@/types/response";
import { User } from "@/types/user";
import {
  accessTokenCookieName,
  oauth2AuthResultCookieName,
  refreshTokenCookieName,
  userSessionCookieName,
} from "@/utils/constants";
import { faL } from "@fortawesome/free-solid-svg-icons";
import { access } from "fs";
import { cookies } from "next/headers";
import { redirect, RedirectType } from "next/navigation";

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
  prevState: { errorMessage: string; unactivatedEmail: string },
  formData: FormData
): Promise<{ errorMessage: string; unactivatedEmail: string }> {
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
      unactivatedEmail: "",
    };
  }

  const bodyData = parse.data;
  console.log("Sign In Form data: " + bodyData);

  let response;
  try {
    response = await fetch(`${global.process.env.LOGIN_API}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(bodyData),
      cache: "no-cache",
    });
  } catch (error) {
    console.log("Error calling sign in api: " + error);
    return {
      errorMessage: "Something went wrong: " + error,
      unactivatedEmail: "",
    };
  }

  const result = await response.json();
  console.log("Response result: " + JSON.stringify(result));

  if (result.statusCode === 200) {
    //get refresh token from response cookies and set it to next server cookie
    const setCookies = response.headers.getSetCookie();
    const refreshTokenExpiration = 90 * 24 * 60 * 60 * 1000; //90 days
    setCookies.forEach((cookie) => {
      if (!cookie.match("refresh_token=")) return;
      const refreshTokenValue = cookie.split("refresh_token=")[1];
      const userSessionData: User = result.data.user;
      setAuthCookies(
        result.data.access_token,
        refreshTokenValue,
        userSessionData
      );
    });

    redirect("/dashboard");
  } else if (result.statusCode === 401) {
    return {
      errorMessage: "Username or password is incorrect",
      unactivatedEmail: "",
    };
  } else if (
    result.statusCode === 403 &&
    result.error === "Account is unactivated"
  ) {
    return {
      errorMessage: "Account is unactivated",
      unactivatedEmail: result.data.email,
    };
  }

  return { errorMessage: result.error, unactivatedEmail: "" };
}

export async function resendActivationMail(email: string) {
  try {
    console.log("Calling resending activation email api");
    const response = await fetch(
      `${process.env.RESEND_ACTIVATION_MAIL_API}?email=${email}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-cache",
      }
    );

    if (response.status === 200) {
      return true;
    }

    const result = await response.json();
    console.log("Cannot resend activation email: " + result.error);
    return false;
  } catch (error) {
    console.log("Error calling resending activation email api: " + error);
    return false;
  }
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
    redirect("/", RedirectType.push);
  }
}

export async function getAccessToken(
  redirectIfFail: boolean = true
): Promise<string> {
  const cookieStore = cookies();
  let accessToken = cookieStore.get("access_token");

  if (accessToken === undefined) {
    console.log("No access token");
    //use refresh token
    const refreshToken = cookieStore.get("refresh_token");
    if (refreshToken === undefined) {
      console.log("No refresh token");
      await logOut(redirectIfFail);
      return "-1";
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
      return "-1";
    }

    const result = await response.json();
    console.log("Refresh token response result: " + JSON.stringify(result));
    if (result.statusCode === 200) {
      //get refresh token from response cookies and set it to next server cookie
      const setCookies = response.headers.getSetCookie();
      setCookies.forEach((cookie) => {
        if (!cookie.match("refresh_token=")) return;
        const refreshTokenValue = cookie.split("refresh_token=")[1];
        const userSessionData: User = result.data.user;
        setAuthCookies(
          result.data.access_token,
          refreshTokenValue,
          userSessionData
        );
      });
      return result.data.access_token;
    } else {
      await logOut(redirectIfFail);
      return "-1";
    }
  }

  return accessToken?.value;
}

export async function getGoogleLoginConsentPage() {
  redirect(`${process.env.GOOGLE_LOGIN_API}`);
}

export interface Oauth2AccountRegistrationMessages {
  usernameErrors?: string[];
  passwordErrors?: string[];
  confirm_passwordErrors?: string[];
  serverErrors?: string[];
  successMessage?: "";
  isSuccess: boolean;
}

export async function oauth2AccountRegister(
  prevState: Oauth2AccountRegistrationMessages,
  formData: FormData
): Promise<Oauth2AccountRegistrationMessages> {
  const schema = oauth2AccountRegistrationSchema;
  const accessToken = await getAccessToken(true);

  const data = {
    username: formData.get("username"),
    password: formData.get("password"),
    confirm_password: formData.get("confirmPassword"),
  };

  const parse = schema.safeParse(data);

  if (!parse.success) {
    const parseResult = parse.error.flatten().fieldErrors;
    console.log("Form data parsed result: " + parseResult);
    return {
      usernameErrors: parseResult.username,
      passwordErrors: parseResult.password,
      confirm_passwordErrors: parseResult.confirm_password,
      isSuccess: false,
    };
  }

  const bodyData = parse.data;
  console.log(
    "Oauth2 Account Registration Form data: " + JSON.stringify(bodyData)
  );

  let response, result;
  try {
    response = await fetch(`${process.env.CREATE_ACCOUNT}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(bodyData),
      cache: "no-cache",
    });

    result = await response.json();
    console.log("Response result: " + JSON.stringify(result));
  } catch (error) {
    console.log("Error fetching sign up: " + error);
    return {
      serverErrors: ["Something went wrong: " + error],
      isSuccess: false,
    };
  }

  if (result.statusCode === 201) {
    //get refresh token from response cookies and set it to next server cookie
    const setCookies = response.headers.getSetCookie();
    setCookies.forEach((cookie) => {
      if (!cookie.match("refresh_token=")) return;
      const refreshTokenValue = cookie.split("refresh_token=")[1];
      const userSessionData: User = result.data.user;
      setAuthCookies(
        result.data.access_token,
        refreshTokenValue,
        userSessionData
      );
    });
    deleteAuthResultCookie();

    redirect("/dashboard");
  } else {
    return { serverErrors: result.error, isSuccess: false };
  }
}

export interface GetCurrentUserAndRefreshTokenMessages {
  errors?: string[];
  isSuccess: boolean;
}

export async function getCurrentUserAndRefreshToken(): Promise<GetCurrentUserAndRefreshTokenMessages> {
  const accessToken = await getAccessToken(true);

  let response;
  try {
    response = await fetch(
      `${process.env.GET_CURRENT_USER_AND_REFRESH_TOKEN}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        cache: "no-cache",
      }
    );
  } catch (error) {
    console.log("Error calling getting user api: " + error);
    return {
      errors: ["Something went wrong: " + error],
      isSuccess: false,
    };
  }

  const result: UserResponse = await response.json();
  console.log("Response result: " + JSON.stringify(result));

  if (result.statusCode === 200) {
    //get refresh token from response cookies and set it to next server cookie
    const setCookies = response.headers.getSetCookie();
    setCookies.forEach((cookie) => {
      if (!cookie.match("refresh_token=")) return;
      const refreshTokenValue = cookie.split("refresh_token=")[1];
      setAuthCookies(
        result.data.access_token,
        refreshTokenValue,
        result.data.user
      );
    });

    redirect("/dashboard");
  }

  return {
    errors: result.error,
    isSuccess: false,
  };
}

async function setAuthCookies(
  accessToken: string,
  refreshToken: string,
  user: User
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

  setAccessTokenCookie(accessToken);

  cookieStore.set({
    name: userSessionCookieName,
    value: JSON.stringify(user),
    httpOnly: true,
    sameSite: "strict",
    secure: true,
  });
}

export async function setAccessTokenCookie(accessToken: string) {
  const cookieStore = cookies();
  const accessTokenExpiration = 60 * 60 * 1000; //60 minutes
  cookieStore.set({
    name: accessTokenCookieName,
    value: accessToken,
    httpOnly: true,
    sameSite: "strict",
    secure: true,
    expires: Date.now() + accessTokenExpiration,
  });
}

export async function setUserSessionCookie(user: User) {
  const cookieStore = cookies();
  cookieStore.set({
    name: userSessionCookieName,
    value: JSON.stringify(user),
    httpOnly: true,
    sameSite: "strict",
    secure: true,
  });
}

export async function setAuthResultCookie(authResult: string) {
  const cookieStore = cookies();
  const authResultCookieExpiration = 10 * 60 * 1000; //10 minutes
  cookieStore.set({
    name: oauth2AuthResultCookieName,
    value: authResult,
    httpOnly: true,
    sameSite: "strict",
    secure: true,
    expires: Date.now() + authResultCookieExpiration,
  });
}

export async function deleteAuthResultCookie() {
  const cookieStore = cookies();
  cookieStore.delete(oauth2AuthResultCookieName);
}
