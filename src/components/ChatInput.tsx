"use client";

interface ChatInputProps {
  value: string;
  disabled: boolean;
  onChange: (value: string) => void;
  onKeyPress: (e: React.KeyboardEvent) => void;
  onSend: () => void;
}

export function ChatInput({
  value,
  disabled,
  onChange,
  onKeyPress,
  onSend,
}: ChatInputProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyPress={onKeyPress}
        placeholder={
          disabled
            ? "Please enter your API key first"
            : "Type your message here... (Press Enter to send, Shift+Enter for new line)"
        }
        className="flex-1 px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed text-gray-900 text-sm sm:text-base"
        rows={3}
        disabled={disabled}
      />
      <button
        onClick={onSend}
        disabled={disabled || !value.trim()}
        className="px-4 sm:px-6 py-2 sm:py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors text-sm sm:text-base font-medium"
      >
        Send
      </button>
    </div>
  );
}

export default ChatInput;
