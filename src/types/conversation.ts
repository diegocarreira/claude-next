import type { Message } from "./message";

export interface Conversation {
  id: string;
  title: string; // derived from first message content
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
}
