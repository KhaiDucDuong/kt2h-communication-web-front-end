import { z } from "zod";
import { ConversationMessageResponse } from "./response";

// Enum for message types
export enum MessageType {
    TEXT = "TEXT",
    RECORDING = "RECORDING",
    IMAGE = "IMAGE" // Added IMAGE type
}

// Interface representing a single message
export interface Message {
    id: string;
    message: string;
    sender_id: string;
    message_type: MessageType;
    is_reacted: boolean;
    sent_at: number;
    image_url: string | null; // Optional image URL field
}

// Interface representing a group of messages from the same sender
export interface MessageGroup {
    sender_id: string;
    messages: Message[];
    sentDateTime: Date;
}

// Zod schema for validating messages
export const messageSchema: z.ZodType<Message> = z.object({
    id: z.string().uuid(),
    sender_id: z.string().uuid(),
    message_type: z.nativeEnum(MessageType),
    is_reacted: z.boolean(),
    sent_at: z.number(),
    message: z.string().min(0), // Ensures message has at least 1 character
    image_url: z.string().nullable() // Optional image URL validation
}).refine((data) => {
    if (data.message_type === MessageType.TEXT) {
        return data.message.length >= 1; // Text messages must have content
    }
    return true; // Other message types are valid by default
}, {
    message: "Text messages must have at least 1 character or provide an image URL for image messages",
    path: ["message"],
});

// Function to transform response data into an array of messages
export function getMessagesFromResponse(
    response: ConversationMessageResponse
): Message[] | null {
    const messageList: Message[] = [];
    for (const messageResponse of response.data.result) {
        const message: Message = {
            id: messageResponse.id,
            message: messageResponse.message,
            sender_id: messageResponse.sender_id,
            message_type: messageResponse.message_type,
            is_reacted: messageResponse.is_reacted,
            sent_at: messageResponse.sent_at,
            image_url: messageResponse.image_url // Ensure to include the image URL if present
        };

        try {
            messageSchema.parse(message); // Validate message
            messageList.push(message);
        } catch (e) {
            console.log(e);
            return null; // Return null if validation fails
        }
    }
    return messageList;
}

// Function to group messages from the same sender
export function groupMessagesFromSameSender(messages: Message[]): MessageGroup[] {
    const groupedMessages: MessageGroup[] = [];
    for (const message of messages.toReversed()) {
        if (
            groupedMessages.length === 0 ||
            groupedMessages[groupedMessages.length - 1].sender_id !== message.sender_id ||
            groupedMessages[groupedMessages.length - 1].sentDateTime.getTime() + 1000 * 60 * 5 < message.sent_at * 1000
        ) {
            groupedMessages.push({
                sender_id: message.sender_id,
                messages: [message],
                sentDateTime: new Date(message.sent_at * 1000),
            });
        } else {
            groupedMessages[groupedMessages.length - 1].messages.push(message);
        }
    }
    return groupedMessages;
}
