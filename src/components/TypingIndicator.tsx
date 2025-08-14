"use client";

export function TypingIndicator() {
  return (
    <div className="flex justify-start">
      <div className="bg-white border border-gray-200 px-4 py-3 rounded-lg">
        <div className="flex items-center gap-2">
          <div className="animate-spin h-4 w-4 border-2 border-gray-300 border-t-blue-600 rounded-full"></div>
          <span className="text-gray-500 text-sm">Claude is thinking...</span>
        </div>
      </div>
    </div>
  );
}

export default TypingIndicator;
