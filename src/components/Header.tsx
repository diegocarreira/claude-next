"use client";

import { Menu } from "lucide-react";

interface HeaderProps {
  title: string;
  subtitle?: string;
  selectedModel: string;
  models: { id: string; name: string }[];
  onToggleSidebar: () => void;
  onNewChat: () => void;
  onChangeModel: (modelId: string) => void;
  onToggleSystem: () => void;
  onToggleSettings: () => void;
  onClearChat: () => void;
  isClearDisabled: boolean;
}

export function Header({
  title,
  subtitle,
  selectedModel,
  models,
  onToggleSidebar,
  onNewChat,
  onChangeModel,
  onToggleSystem,
  onToggleSettings,
  onClearChat,
  isClearDisabled,
}: HeaderProps) {
  return (
    <header className="bg-white border-b border-gray-200 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          {/* Left: hamburger + title */}
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={onToggleSidebar}
              className="p-2 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors cursor-pointer"
              aria-label="Toggle conversations sidebar"
            >
              <Menu className="h-5 w-5 text-gray-700" />
            </button>
            <div className="min-w-0">
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 truncate">
                {title}
              </h1>
              {subtitle && (
                <p className="text-xs text-gray-500 mt-1 truncate">
                  {subtitle}
                </p>
              )}
            </div>
          </div>

          {/* Right: single controls block that reflows on mobile */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-4 w-full sm:w-auto">
            <select
              value={selectedModel}
              onChange={(e) => onChangeModel(e.target.value)}
              className="w-full sm:w-auto px-2 py-1.5 sm:px-3 sm:py-2 border border-gray-300 rounded-md text-xs sm:text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {models.map((model) => (
                <option key={model.id} value={model.id}>
                  {model.name}
                </option>
              ))}
            </select>
            <button
              onClick={onToggleSystem}
              className="px-2 py-1.5 sm:px-3 sm:py-2 text-xs sm:text-sm bg-purple-100 hover:bg-purple-200 text-purple-700 rounded-md transition-colors"
            >
              System
            </button>
            <button
              onClick={onToggleSettings}
              className="px-2 py-1.5 sm:px-3 sm:py-2 text-xs sm:text-sm bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
            >
              Settings
            </button>
            <button
              onClick={onClearChat}
              className="px-2 py-1.5 sm:px-3 sm:py-2 text-xs sm:text-sm bg-red-100 hover:bg-red-200 text-red-700 rounded-md transition-colors"
              disabled={isClearDisabled}
            >
              Clear Chat
            </button>
            <button
              onClick={onNewChat}
              className="px-3 py-2 text-sm bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors"
            >
              New Chat
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
