import { z } from "zod";

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
  INVISIBLE = "INVISIBLE"
}

export interface User {
  email: string;
  first_name: string;
  last_name: string;
  user_id: string;
  image: string | null;
  phone: string | null;
  status: UserStatus
  default_status: UserDefaultStatus
  role: UserRole;
}

export interface SocketStatusUpdate {
  user_id: string;
  status: UserStatus;
}

export const socketStatusUpdateSchema: z.ZodType<SocketStatusUpdate> =
  z.object({
    user_id: z.string().uuid(),
    status: z.nativeEnum(UserStatus),
  });