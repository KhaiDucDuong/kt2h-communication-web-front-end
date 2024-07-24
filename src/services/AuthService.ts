"use server";

import { registerSchema } from "@/types/auth";
import { RefObject } from "react";

export interface signInMessages {
  emailErrors?: string;
  usernameErrors?: string;
  first_nameErrors?: string;
  last_nameErrors?: string;
  passwordErrors?: string;
  confirm_passwordErrors?: string;
  serverErrors?: [];
  successMessage?: "";
}

export async function signUp(prevState: signInMessages, formData: FormData) {
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
      confirm_passwordErrors: parseResult.confirmPassword,
    };
  }

  const bodyData = parse.data;
  console.log("Form data: " + bodyData);

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
      return { successMessage: result.message };
    }
    return { serverErrors: result.error };
  } catch (error) {
    console.log("Error fetching sign up: " + error);
  }
}
