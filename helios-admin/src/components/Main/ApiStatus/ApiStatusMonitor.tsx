import React, { useState, useEffect } from "react";
import type { ApiStatus } from "../../../types";
import { mockApiStatuses } from "../../../data/mockData";

function StatusIndicator({ status }: { status: ApiStatus["status"] }) {
  const getStatusConfig = (status: ApiStatus["status"]) => {
    switch (status) {
      case "active":
        return {
          color: "bg-green-500",
          text: "정상",
          textColor: "text-green-700",
        };
      case "warning":
        return {
          color: "bg-yellow-500",
          text: "경고",
          textColor: "text-yellow-700",
        };
      case "error":
        return { color: "bg-red-500", text: "오류", textColor: "text-red-700" };
      case "maintenance":
        return {
          color: "bg-gray-500",
          text: "점검중",
          textColor: "text-gray-700",
        };
      default:
        return {
          color: "bg-gray-500",
          text: "알 수 없음",
          textColor: "text-gray-700",
        };
    }
  };

  const config = getStatusConfig(status);

  return (
    <div className="flex items-center gap-2">
      <div
        className={`w-3 h-3 rounded-full ${config.color} animate-pulse`}
      ></div>
      <span className={`text-sm font-medium ${config.textColor}`}>
        {config.text}
      </span>
    </div>
  );
}

const ApiStatusCard: React.FC<{ api: ApiStatus }> = ({ api }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all duration-200 hover:border-blue-200">
      <div className="flex items-start justify-between mb-1">
        <div className="flex flex-col gap-4">
          <h3 className="text-l font-semibold text-gray-900 mb-1">
            {api.name}
          </h3>
          <StatusIndicator status={api.status} />
        </div>
        <div className="text-right">
          <div className="text-l font-bold text-blue-600">
            {api.responseTime}ms
          </div>
          <div className="text-xs text-gray-500">응답시간</div>
        </div>
      </div>
    </div>
  );
};

const ApiStatusMonitor: React.FC = () => {
  const [apiStatuses, setApiStatuses] = useState<ApiStatus[]>(mockApiStatuses);

  const refreshData = () => {
    // 실제 API 호출로 대체
    setApiStatuses([...mockApiStatuses]);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      refreshData();
    }, 30000); // 30초마다 새로고침

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">API 상태</h2>
          <div className="flex items-center gap-3"></div>
        </div>

        <button
          onClick={refreshData}
          className="flex items-center gap-2 bg-white hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg border border-gray-200 transition-colors duration-200"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
          새로고침
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-4">
        {apiStatuses.map((api) => (
          <ApiStatusCard key={api.id} api={api} />
        ))}
      </div>
    </div>
  );
};

export default ApiStatusMonitor;
