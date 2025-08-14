"use client";

interface SystemMessagePanelProps {
  value: string;
  onChange: (value: string) => void;
  onClose: () => void;
}

export function SystemMessagePanel({
  value,
  onChange,
  onClose,
}: SystemMessagePanelProps) {
  return (
    <div className="bg-purple-50 border-b border-purple-200 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="space-y-3">
          <label className="text-sm font-medium text-gray-700 block">
            System Message (Guidelines for the conversation):
          </label>
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Enter system instructions that will guide Claude's behavior..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900 resize-y"
            rows={4}
          />
          <div className="flex items-center justify-between">
            <p className="text-xs text-gray-600">
              The system message sets the context and guidelines for the entire
              conversation.
            </p>
            <button
              onClick={onClose}
              className="px-3 py-1 bg-purple-600 text-white text-xs rounded-md hover:bg-purple-700 transition-colors"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SystemMessagePanel;
