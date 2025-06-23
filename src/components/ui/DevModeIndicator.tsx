"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";

export default function DevModeIndicator() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, isLoading, isAuthenticated, refreshAuth } = useAuth();

  // Só mostrar em desenvolvimento
  if (process.env.NODE_ENV !== "development") {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-blue-600 text-white p-2 rounded-full shadow-lg hover:bg-blue-700 transition-colors"
        title="Debug Auth"
      >
        🔍
      </button>

      {isOpen && (
        <div className="absolute bottom-12 right-0 bg-white rounded-lg shadow-xl p-4 min-w-[300px] border">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-sm">🔐 Auth Debug</h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between">
              <span>Is Loading:</span>
              <span
                className={isLoading ? "text-yellow-600" : "text-green-600"}
              >
                {isLoading ? "⏳" : "✅"}
              </span>
            </div>

            <div className="flex justify-between">
              <span>Is Authenticated:</span>
              <span
                className={isAuthenticated ? "text-green-600" : "text-red-600"}
              >
                {isAuthenticated ? "✅" : "❌"}
              </span>
            </div>

            <div className="flex justify-between">
              <span>User:</span>
              <span className={user ? "text-green-600" : "text-red-600"}>
                {user ? user.name : "None"}
              </span>
            </div>

            <div className="flex justify-between">
              <span>Client ID:</span>
              <span className="text-blue-600">{user?.clientId || "N/A"}</span>
            </div>

            <div className="flex justify-between">
              <span>Current Path:</span>
              <span className="text-gray-600">
                {typeof window !== "undefined"
                  ? window.location.pathname
                  : "N/A"}
              </span>
            </div>

            <div className="border-t pt-2 mt-3">
              <button
                onClick={refreshAuth}
                className="w-full bg-blue-500 text-white py-1 px-2 rounded text-xs hover:bg-blue-600"
              >
                🔄 Refresh Auth
              </button>
            </div>

            <div className="text-xs text-gray-500 mt-2">
              <strong>Backend:</strong>
              <div>API: http://localhost:3000</div>
              <div>Frontend: http://localhost:3001</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
