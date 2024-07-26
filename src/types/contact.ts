import { z } from "zod";

export interface ContactProps extends ContactRow {
  
  className?: string;
  handleClick: () => void;
}

export interface ContactRow {
  image: string;
  username: string;
  noMissedMessages: number;
  isLastMessageFromUser?: boolean;
  lastMessage?: string;
  lastSent?: Date;
}

export const contactRowSchema: z.ZodType<ContactRow> = z.object({
  image: z.string(),
  username: z.string(),
  noMissedMessages: z.number().min(0).max(999),
  isLastMessageFromUser: z.boolean().optional(),
  lastMessage: z.string().optional(),
  lastSent: z.date().optional(),
});