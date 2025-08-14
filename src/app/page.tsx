"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import Anthropic from "@anthropic-ai/sdk";
import type { Message } from "@/types/message";
import type { Conversation } from "@/types/conversation";
import Header from "@/components/Header";
import ConversationsDrawer from "@/components/ConversationsDrawer";
import MessageItem from "@/components/MessageItem";
import SystemMessagePanel from "@/components/SystemMessagePanel";
import ApiKeyBar from "@/components/ApiKeyBar";
import ChatInput from "@/components/ChatInput";
import TypingIndicator from "@/components/TypingIndicator";
import CLAUDE_MODELS from "@/claude-models.json";

const TITLE_CHARS_LENGTH = 40;

export default function Home() {
  const [apiKey, setApiKey] = useState("");
  const [selectedModel, setSelectedModel] = useState(CLAUDE_MODELS[0].id);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<
    string | null
  >(null);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showApiKeyInput, setShowApiKeyInput] = useState(false);
  const [systemMessage, setSystemMessage] = useState(
    "You are Claude, a helpful AI assistant created by Anthropic. Be helpful, harmless, and honest."
  );
  const [showSystemMessage, setShowSystemMessage] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const currentConversation = useMemo(() => {
    return conversations.find((c) => c.id === activeConversationId) || null;
  }, [conversations, activeConversationId]);
  const currentMessages = useMemo(() => {
    return currentConversation?.messages || [];
  }, [currentConversation]);

  const generateTitleFromContent = (content: string) => {
    const trimmed = content.trim();
    return trimmed.slice(0, TITLE_CHARS_LENGTH);
  };

  const ensureActiveConversation = () => {
    if (activeConversationId && currentConversation)
      return activeConversationId;
    const newId = Date.now().toString();
    const newConv: Conversation = {
      id: newId,
      title: "New chat",
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setConversations((prev) => [newConv, ...prev]);
    setActiveConversationId(newId);
    return newId;
  };

  // Load API key, selected model, and conversations from localStorage on component mount
  useEffect(() => {
    const savedApiKey = localStorage.getItem("claude-api-key");
    if (savedApiKey) {
      setApiKey(savedApiKey);
    } else {
      setShowApiKeyInput(true);
    }

    // Load selected model
    const savedModel = localStorage.getItem("claude-selected-model");
    if (savedModel) {
      // Verify the saved model is still in our current model list
      const modelExists = CLAUDE_MODELS.some(
        (model) => model.id === savedModel
      );
      if (modelExists) {
        setSelectedModel(savedModel);
      }
    }

    // Load system message
    const savedSystemMessage = localStorage.getItem("claude-system-message");
    if (savedSystemMessage) {
      setSystemMessage(savedSystemMessage);
    }

    // Load conversations (with migration from single conversation if needed)
    const savedConversations = localStorage.getItem("claude-conversations");
    if (savedConversations) {
      try {
        const raw = JSON.parse(savedConversations) as Array<
          Omit<Conversation, "createdAt" | "updatedAt" | "messages"> & {
            createdAt: string;
            updatedAt: string;
            messages: Array<Omit<Message, "timestamp"> & { timestamp: string }>;
          }
        >;
        const parsed: Conversation[] = raw.map((c) => ({
          ...c,
          createdAt: new Date(c.createdAt),
          updatedAt: new Date(c.updatedAt),
          messages: c.messages.map((m) => ({
            ...m,
            timestamp: new Date(m.timestamp),
          })),
        }));
        setConversations(parsed);
        if (parsed.length > 0) {
          // pick most recently updated as active
          const mostRecent = [...parsed].sort(
            (a, b) => b.updatedAt.getTime() - a.updatedAt.getTime()
          )[0];
          setActiveConversationId(mostRecent.id);
        }
      } catch (error) {
        console.error("Error loading conversations:", error);
        localStorage.removeItem("claude-conversations");
      }
    } else {
      // Migrate old single-conversation storage if present
      const savedMessages = localStorage.getItem("claude-conversation");
      if (savedMessages) {
        try {
          const parsedMessages = JSON.parse(savedMessages) as Array<
            Omit<Message, "timestamp"> & { timestamp: string }
          >;
          const messagesWithDates: Message[] = parsedMessages.map((msg) => ({
            ...msg,
            timestamp: new Date(msg.timestamp),
          }));
          const firstText =
            messagesWithDates.find((m) => m.content)?.content ?? "New chat";
          const conv: Conversation = {
            id: Date.now().toString(),
            title: generateTitleFromContent(firstText),
            messages: messagesWithDates,
            createdAt: new Date(),
            updatedAt: new Date(),
          };
          setConversations([conv]);
          setActiveConversationId(conv.id);
          localStorage.removeItem("claude-conversation");
          localStorage.setItem("claude-conversations", JSON.stringify([conv]));
        } catch (error) {
          console.error("Error migrating single conversation:", error);
          localStorage.removeItem("claude-conversation");
        }
      } else {
        // Start with one empty conversation for convenience
        const id = Date.now().toString();
        const conv: Conversation = {
          id,
          title: "New chat",
          messages: [],
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        setConversations([conv]);
        setActiveConversationId(id);
      }
    }
  }, []);

  // Save API key to localStorage when it changes
  useEffect(() => {
    if (apiKey) {
      localStorage.setItem("claude-api-key", apiKey);
    }
  }, [apiKey]);

  // Save conversations to localStorage when they change
  useEffect(() => {
    // serialize dates to ISO strings
    const serializable = conversations.map((c) => ({
      ...c,
      createdAt: c.createdAt.toISOString(),
      updatedAt: c.updatedAt.toISOString(),
      messages: c.messages.map((m) => ({
        ...m,
        timestamp: m.timestamp.toISOString(),
      })),
    }));
    localStorage.setItem("claude-conversations", JSON.stringify(serializable));
  }, [conversations]);

  // Save selected model to localStorage when it changes
  useEffect(() => {
    localStorage.setItem("claude-selected-model", selectedModel);
  }, [selectedModel]);

  // Save system message to localStorage when it changes
  useEffect(() => {
    localStorage.setItem("claude-system-message", systemMessage);
  }, [systemMessage]);

  // Scroll to bottom when current conversation messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [currentMessages]);

  const sendMessage = async () => {
    if (!inputMessage.trim() || !apiKey) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: inputMessage.trim(),
      timestamp: new Date(),
    };

    const convId = ensureActiveConversation();
    // optimistic update with user message
    setConversations((prev) =>
      prev.map((c) => {
        if (c.id !== convId) return c;
        const nextMessages = [...c.messages, userMessage];
        const updatedTitle =
          c.title === "New chat" && userMessage.content
            ? generateTitleFromContent(userMessage.content)
            : c.title;
        return {
          ...c,
          title: updatedTitle,
          messages: nextMessages,
          updatedAt: new Date(),
        };
      })
    );
    setInputMessage("");
    setIsLoading(true);

    try {
      const anthropic = new Anthropic({
        apiKey: apiKey,
        dangerouslyAllowBrowser: true,
      });

      const messagesForApi = [
        ...currentMessages.map((msg) => ({
          role: msg.role,
          content: msg.content,
        })),
        { role: "user" as const, content: inputMessage.trim() },
      ];
      const response = await anthropic.messages.create({
        model: selectedModel,
        max_tokens: 4000,
        system: systemMessage,
        messages: messagesForApi,
      });

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content:
          response.content[0].type === "text" ? response.content[0].text : "",
        timestamp: new Date(),
      };

      setConversations((prev) =>
        prev.map((c) =>
          c.id === convId
            ? {
                ...c,
                messages: [...c.messages, assistantMessage],
                updatedAt: new Date(),
              }
            : c
        )
      );
    } catch (error) {
      console.error("Error sending message:", error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content:
          "Sorry, there was an error processing your message. Please check your API key and try again.",
        timestamp: new Date(),
      };
      setConversations((prev) =>
        prev.map((c) =>
          c.id === convId
            ? {
                ...c,
                messages: [...c.messages, errorMessage],
                updatedAt: new Date(),
              }
            : c
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleClearChatConfirmation = () => {
    if (!currentConversation || currentMessages.length === 0) return;
    const confirmed = window.confirm(
      "Are you sure you want to clear the chat?"
    );
    if (confirmed) {
      setConversations((prev) =>
        prev.map((c) =>
          c.id === currentConversation.id
            ? { ...c, title: "New chat", messages: [], updatedAt: new Date() }
            : c
        )
      );
    }
  };

  const handleApiKeySubmit = () => {
    if (apiKey.trim()) {
      setShowApiKeyInput(false);
    }
  };

  const startNewConversation = () => {
    const id = Date.now().toString();
    const conv: Conversation = {
      id,
      title: "New chat",
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setConversations((prev) => [conv, ...prev]);
    setActiveConversationId(id);
  };

  const deleteConversation = (conversationId: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this chat?"
    );
    if (!confirmed) return;
    setConversations((prev) => {
      const remaining = prev.filter((c) => c.id !== conversationId);
      if (remaining.length === 0) {
        const id = Date.now().toString();
        const conv: Conversation = {
          id,
          title: "New chat",
          messages: [],
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        setActiveConversationId(id);
        return [conv];
      }
      if (activeConversationId === conversationId) {
        const next = [...remaining].sort(
          (a, b) => b.updatedAt.getTime() - a.updatedAt.getTime()
        )[0];
        setActiveConversationId(next.id);
      }
      return remaining;
    });
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50 text-gray-900">
      <Header
        title="Claude Chat"
        subtitle={
          currentConversation ? currentConversation.title : "No conversation"
        }
        selectedModel={selectedModel}
        models={CLAUDE_MODELS}
        onToggleSidebar={() => setShowSidebar((prev) => !prev)}
        onNewChat={startNewConversation}
        onChangeModel={setSelectedModel}
        onToggleSystem={() => setShowSystemMessage((s) => !s)}
        onToggleSettings={() => setShowApiKeyInput((s) => !s)}
        onClearChat={handleClearChatConfirmation}
        isClearDisabled={currentMessages.length === 0}
      />

      <ConversationsDrawer
        open={showSidebar}
        conversations={conversations}
        activeConversationId={activeConversationId}
        onClose={() => setShowSidebar(false)}
        onSelect={(id) => setActiveConversationId(id)}
        onDelete={deleteConversation}
        onNewChat={startNewConversation}
      />

      {showSystemMessage && (
        <SystemMessagePanel
          value={systemMessage}
          onChange={setSystemMessage}
          onClose={() => setShowSystemMessage(false)}
        />
      )}

      {showApiKeyInput && (
        <ApiKeyBar
          apiKey={apiKey}
          onChange={setApiKey}
          onSave={handleApiKeySubmit}
        />
      )}

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto p-4">
          {currentMessages.length === 0 ? (
            <div className="text-center text-gray-500 mt-8">
              <p className="text-lg mb-2">Welcome to Claude Chat!</p>
              <p className="text-sm">
                Start a conversation by typing a message below.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {currentMessages.map((message) => (
                <MessageItem key={message.id} message={message} />
              ))}
              {isLoading && <TypingIndicator />}
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <footer className="bg-white border-t border-gray-200 p-4">
        <div className="max-w-4xl mx-auto">
          <ChatInput
            value={inputMessage}
            disabled={!apiKey || isLoading}
            onChange={setInputMessage}
            onKeyPress={handleKeyPress}
            onSend={sendMessage}
          />
        </div>
      </footer>
    </div>
  );
}
