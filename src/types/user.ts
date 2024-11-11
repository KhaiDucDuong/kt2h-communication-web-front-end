import { z } from "zod";
import { UserDataOnlyResponse, UserStatusReponse } from "./response";

export enum UserRole {
  ADMIN = "ADMIN",
  USER = "USER",
}

export enum UserStatus {
  ONLINE = "ONLINE",
  OFFLINE = "OFFLINE",
  IDLE = "IDLE",
  DO_NOT_DISTURB = "DO_NOT_DISTURB",
}

export enum UserDefaultStatus {
  ONLINE = "ONLINE",
  IDLE = "IDLE",
  DO_NOT_DISTURB = "DO_NOT_DISTURB",
  INVISIBLE = "INVISIBLE",
}

export interface User {
  email: string;
  first_name: string;
  last_name: string;
  user_id: string;
  image: string | null;
  phone: string | null;
  status: UserStatus;
  default_status: UserDefaultStatus;
  role: UserRole;
}

export const userSchema: z.ZodType<User> = z.object({
  user_id: z.string().uuid(),
  image: z.string().nullable(),
  first_name: z.string().min(1),
  last_name: z.string().min(1),
  email: z.string().email().min(1),
  phone: z.string().nullable(),
  status: z.nativeEnum(UserStatus),
  default_status: z.nativeEnum(UserDefaultStatus),
  role: z.nativeEnum(UserRole),
});

export interface UserData {
  user_id: string;
  image: string | null;
  first_name: string;
  last_name: string;
  email: string;
  status: UserStatus;
  last_activity_at: number | null;
}

export const userDataSchema: z.ZodType<UserData> = z.object({
  user_id: z.string().uuid(),
  image: z.string().nullable(),
  first_name: z.string().min(1),
  last_name: z.string().min(1),
  email: z.string().email().min(1),
  status: z.nativeEnum(UserStatus),
  last_activity_at: z.number().nullable(),
});

export function getUserDataFromResponse(
  response: UserDataOnlyResponse
): UserData | null {
  let userData = response.data;

  try {
    const validatedUserData = userDataSchema.parse(userData);
  } catch (e) {
    console.log(e);
    return null;
  }

  return userData;
}

export interface StatusUpdate {
  user_id: string;
  status: UserStatus;
  last_activity_at: number | null;
}

export const statusUpdateSchema: z.ZodType<StatusUpdate> = z.object({
  user_id: z.string().uuid(),
  status: z.nativeEnum(UserStatus),
  last_activity_at: z.number().nullable(),
});

export function getStatusUpdateFromResponse(
  response: UserStatusReponse
): StatusUpdate | null {
  let statusUpdate = response.data;

  try {
    const validatedStatusUpdate = statusUpdateSchema.parse(statusUpdate);
  } catch (e) {
    console.log(e);
    return null;
  }

  return statusUpdate;
}
