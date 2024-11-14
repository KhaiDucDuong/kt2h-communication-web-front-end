import { z } from "zod";
import { UserStatus } from "./user";
import { ContactResponse } from "./response";

export interface ContactProps extends ContactRow {
  className?: string;
  handleClick: () => void;
}

//contact
export interface ContactRow {
  image: string | null;
  name: string;
  // noMissedMessages: number;
  // isLastMessageFromUser?: boolean;
  // lastMessage?: string;
  // lastSent?: Date;
}

export const contactRowSchema: z.ZodType<ContactRow> = z.object({
  image: z.string().nullable(),
  name: z.string(),
  // noMissedMessages: z.number().min(0).max(999),
  // isLastMessageFromUser: z.boolean().optional(),
  // lastMessage: z.string().optional(),
  // lastSent: z.date().optional(),
});

export interface Contact {
  id: string;
  requester_id: string;
  requester_nickname: string | null;
  to_user_id: string;
  to_user_nickname: string | null;
  to_user_image: string | null;
  to_user_first_name: string;
  to_user_last_name: string;
  to_user_status: UserStatus;
  to_user_last_activity_at: number;
  // messages: Message[];
  // last_message: Message;
}

export const contactSchema: z.ZodType<Contact> = z.object({
  id: z.string().uuid(),
  requester_id: z.string().uuid(),
  requester_nickname: z.string().nullable(),
  to_user_id: z.string().uuid(),
  to_user_nickname: z.string().nullable(),
  to_user_image: z.string().nullable(),
  to_user_first_name: z.string(),
  to_user_last_name: z.string(),
  to_user_status: z.nativeEnum(UserStatus),
  to_user_last_activity_at: z.number()
});

export function getContactsFromResponse(
  response: ContactResponse
): Contact[] | null {
  const contactList = <Contact[]>[]
  for (const contactResponse of response.data.result) {
    let contact = <Contact>{};
    contact.id = contactResponse.id;
    contact.requester_id = contactResponse.requester_id;
    contact.requester_nickname = contactResponse.requester_nickname;
    contact.to_user_id = contactResponse.toUser.to_user_id;
    contact.to_user_nickname = contactResponse.toUser.to_user_nickname;
    contact.to_user_image = contactResponse.toUser.to_user_image;
    contact.to_user_first_name = contactResponse.toUser.to_user_first_name;
    contact.to_user_last_name = contactResponse.toUser.to_user_last_name;
    contact.to_user_status = contactResponse.toUser.to_user_status;
    contact.to_user_last_activity_at = contactResponse.toUser.to_user_last_activity_at;
    try {
      const validatedContact = contactSchema.parse(contact);
    } catch (e) {
      console.log(e);
      return null;
    }
    contactList.push(contact)
  }

  return contactList;
}
