"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { Message } from "@/types/message";

interface MessageItemProps {
  message: Message;
}

export function MessageItem({ message }: MessageItemProps) {
  return (
    <div
      className={`flex ${
        message.role === "user" ? "justify-end" : "justify-start"
      }`}
    >
      <div
        className={`max-w-[748px] px-4 py-3 rounded-lg ${
          message.role === "user"
            ? "bg-blue-600 text-white"
            : "bg-white border border-gray-200"
        }`}
      >
        {message.role === "assistant" ? (
          <div className="prose prose-sm max-w-none text-gray-900">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {message.content}
            </ReactMarkdown>
          </div>
        ) : (
          <p className="whitespace-pre-wrap">{message.content}</p>
        )}
        <div
          className={`text-xs mt-2 ${
            message.role === "user" ? "text-blue-100" : "text-gray-500"
          }`}
        >
          {message.timestamp.toLocaleTimeString()}
        </div>
      </div>
    </div>
  );
}

export default MessageItem;
