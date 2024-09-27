import { z } from "zod";
import { GenericResponse } from "./response";

export const sendFriendRequestSchema = z.object({
    receiver_username: z.string().min(5).max(254),
})


export enum FriendRequestStatus {
    ACCEPTED = "ACCEPTED",
    REJECTED = "REJECTED",
    PENDING = "PENDING",
  }

export interface FriendRequest {
    id: string;
    sender_id: string;
    sender_image: string;
    sender_first_name: string;
    sender_last_name: string;
    receiver_id: string;
    receiver_image: string;
    receiver_first_name: string;
    receiver_last_name: string;
    sent_date_time: number;
    status: FriendRequestStatus;
}

export interface FriendRequestResponse extends GenericResponse {
    data: FriendRequest
}