import { z } from "zod";

export interface ContactProps {
  image: string;
  username: string;
  noMissedMessages: number;
  isLastMessageFromUser?: boolean;
  lastMessage?: string;
  lastSent?: Date;
}

export const contactPropsSchema: z.ZodType<ContactProps> = z.object({
  image: z.string(),
  username: z.string(),
  noMissedMessages: z.number().min(0).max(999),
  isLastMessageFromUser: z.boolean().optional(),
  lastMessage: z.string().optional(),
  lastSent: z.date().optional(),
});