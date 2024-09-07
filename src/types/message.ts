import { z } from "zod";
import { ConversationMessageResponse } from "./response";

export enum MessageType {
    TEXT = "TEXT",
    RECORDING = "RECORDING",
}

export interface Message {
    id: string;
    message: string;
    sender_id: string;
    message_type: MessageType;
    is_reacted: boolean;
    sent_at: number;
}

export interface MessageGroup {
    sender_id: string;
    messages: Message[]
    sentDateTime: Date;
}

export const messageSchema: z.ZodType<Message> = z.object({
    id: z.string().uuid(),
    sender_id: z.string().uuid(),
    message_type: z.nativeEnum(MessageType),
    is_reacted: z.boolean(),
    sent_at: z.number(),
    message: z.string().min(0)
}).refine((data) => {
    if (data.message_type === MessageType.TEXT) {
        return data.message.length >= 1;
    }
    return true;
}, {
    message: "Text messages must have at least 1 character",
    path: ["message"],
})

export function getMessagesFromResponse(
    response: ConversationMessageResponse
  ): Message[] | null {
    const messageList = <Message[]>[]
    for (const messageResponse of response.data.result) {
      let message = <Message>{};
      message.id = messageResponse.id;
      message.message = messageResponse.message;
      message.sender_id = messageResponse.sender_id;
      message.message_type = messageResponse.message_type;
      message.is_reacted = messageResponse.is_reacted;
      message.sent_at = messageResponse.sent_at;
  
      try {
        const validatedMessage = messageSchema.parse(message);
      } catch (e) {
        console.log(e);
        return null;
      }
      messageList.push(message)
    }
  
    return messageList;
  }

export function groupMessagesFromSameSender(messages: Message[]): MessageGroup[] {
    const groupedMessages: MessageGroup[] = [];
    for (const message of messages.toReversed()) {
        if (groupedMessages.length === 0 
            || groupedMessages[groupedMessages.length - 1].sender_id !== message.sender_id 
            || groupedMessages[groupedMessages.length - 1].sentDateTime.getTime() + 1000 * 60 * 5 < message.sent_at * 1000) {
            groupedMessages.push({
                sender_id: message.sender_id,
                messages: [message],
                sentDateTime: new Date(message.sent_at * 1000)
            });
        } else {
            groupedMessages[groupedMessages.length - 1].messages.push(message);
        }
    }
    return groupedMessages;
}
