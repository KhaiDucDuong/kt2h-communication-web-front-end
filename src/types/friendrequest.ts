import { z } from "zod";
import { GenericResponse } from "./response";

export const sendFriendRequestSchema = z.object({
  receiver_username: z.string().min(5).max(254),
});

export enum FriendRequestStatus {
  ACCEPTED = "ACCEPTED",
  REJECTED = "REJECTED",
  PENDING = "PENDING",
}

export interface FriendRequest {
  id: string;
  sender_id: string;
  sender_image: string | null;
  sender_first_name: string;
  sender_last_name: string;
  receiver_id: string;
  receiver_image: string | null;
  receiver_first_name: string;
  receiver_last_name: string;
  sent_date_time: number;
  status: FriendRequestStatus;
}

export const friendRequestSchema: z.ZodType<FriendRequest> = z.object({
  id: z.string().uuid(),
  sender_id: z.string().uuid(),
  sender_image: z.string().nullable(),
  sender_first_name: z.string().min(1).max(50),
  sender_last_name: z.string().min(1).max(50),
  receiver_id: z.string().uuid(),
  receiver_image: z.string().nullable(),
  receiver_first_name: z.string().min(1).max(50),
  receiver_last_name: z.string().min(1).max(50),
  sent_date_time: z.number(),
  status: z.nativeEnum(FriendRequestStatus)
});

export interface FriendRequestResponse extends GenericResponse {
  data: FriendRequest;
}
