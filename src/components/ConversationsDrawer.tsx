"use client";

import { Trash } from "lucide-react";
import type { Conversation } from "@/types/conversation";

interface ConversationsDrawerProps {
  open: boolean;
  conversations: Conversation[];
  activeConversationId: string | null;
  onClose: () => void;
  onSelect: (conversationId: string) => void;
  onDelete: (conversationId: string) => void;
  onNewChat: () => void;
}

export function ConversationsDrawer({
  open,
  conversations,
  activeConversationId,
  onClose,
  onSelect,
  onDelete,
  onNewChat,
}: ConversationsDrawerProps) {
  return (
    <>
      <div
        className={`fixed inset-y-0 left-0 w-64 bg-white border-r border-gray-200 shadow-lg transform transition-transform duration-200 z-40 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="h-full flex flex-col">
          <div className="p-4 border-b border-gray-200 flex items-center justify-between">
            <span className="font-semibold text-gray-800">Conversations</span>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
              aria-label="Close sidebar"
            >
              ✕
            </button>
          </div>
          <div className="flex-1 overflow-y-auto">
            {conversations
              .slice()
              .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
              .map((conv) => {
                const displayName = `${conv.title}${"..."}`;
                const isActive = conv.id === activeConversationId;
                return (
                  <button
                    key={conv.id}
                    onClick={() => {
                      onSelect(conv.id);
                      onClose();
                    }}
                    className={`w-full cursor-pointer text-left px-4 py-3 border-b border-gray-100 hover:bg-gray-50 ${
                      isActive ? "bg-gray-50" : ""
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <div className="text-sm text-gray-900 truncate">
                          {displayName}
                        </div>
                        <div className="text-xs text-gray-500">
                          {conv.updatedAt.toLocaleString()}
                        </div>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDelete(conv.id);
                        }}
                        className="p-2 rounded-md text-gray-500 hover:text-red-600 hover:bg-red-50 cursor-pointer"
                        aria-label="Delete conversation"
                        title="Delete conversation"
                      >
                        <Trash className="h-4 w-4" />
                      </button>
                    </div>
                  </button>
                );
              })}
          </div>
          <div className="p-4 border-t border-gray-200">
            <button
              onClick={onNewChat}
              className="w-full cursor-pointer px-3 py-2 text-sm bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors"
            >
              New Chat
            </button>
          </div>
        </div>
      </div>
      {open && (
        <div className="fixed inset-0 bg-black/30 z-30" onClick={onClose} />
      )}
    </>
  );
}

export default ConversationsDrawer;
