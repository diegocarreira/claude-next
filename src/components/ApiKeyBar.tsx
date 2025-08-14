"use client";

interface ApiKeyBarProps {
  apiKey: string;
  onChange: (value: string) => void;
  onSave: () => void;
}

export function ApiKeyBar({ apiKey, onChange, onSave }: ApiKeyBarProps) {
  return (
    <div className="bg-yellow-50 border-b border-yellow-200 p-4">
      <div className="max-w-4xl mx-auto">
        <form
          className="flex items-center gap-4"
          onSubmit={(e) => e.preventDefault()}
        >
          <label className="text-sm font-medium text-gray-700">
            Anthropic API Key:
          </label>
          <input
            type="password"
            value={apiKey}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Enter your Anthropic API key"
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="button"
            className="px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors"
            onClick={onSave}
          >
            Save
          </button>
        </form>
        <p className="text-xs text-gray-600 mt-2">
          Your API key is stored locally in your browser and never sent to our
          servers.
        </p>
      </div>
    </div>
  );
}

export default ApiKeyBar;
