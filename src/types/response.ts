import { Contact } from "./contact";
import { MessageType } from "./message";
import { InvitationNotification } from "./notification";
import { StatusUpdate, User, UserData, UserStatus } from "./user";

export interface GenericResponse {
  error: string[];
  message: string;
  statusCode: number;
}

export interface GenericMetaResponse {
  meta: {
    page: number;
    pages: number;
    page_size: number;
    total: number;
  };
}

export interface ContactResponse extends GenericResponse {
  data: GenericMetaResponse & {
    result: {
      id: string;
      requester_id: string;
      requester_nickname: string;
      toUser: {
        to_user_id: string;
        to_user_nickname: string;
        to_user_image: string;
        to_user_first_name: string;
        to_user_last_name: string;
        to_user_email: string;
        to_user_status: UserStatus;
        to_user_last_activity_at: number;
      };
    }[];
  };
}

// Updated interface for conversation messages to include image_url
export interface ConversationMessageResponse extends GenericResponse {
  data: GenericMetaResponse & {
    result: {
      id: string;
      message: string;
      sender_id: string;
      sender_nickname: string;
      message_type: MessageType;
      is_reacted: boolean;
      sent_at: number;
      image_urls: string[]; // Optional field for image URL
    }[];
  };
}

export interface InvitationNotificationResponse extends GenericResponse {
  data: GenericMetaResponse & {
    result: InvitationNotification[];
  };
}

export interface UserResponse extends GenericResponse {
  data: {
    access_token: string,
    token_type: string,
    user: User
  }
}

export interface UserDataOnlyResponse extends GenericResponse {
  data: UserData
}

export interface UserStatusReponse extends GenericResponse {
  data: StatusUpdate;
}
