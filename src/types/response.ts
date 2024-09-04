import { Contact } from "./contact";
import { UserStatus } from "./user";

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
      };
    }[];
  };
}
