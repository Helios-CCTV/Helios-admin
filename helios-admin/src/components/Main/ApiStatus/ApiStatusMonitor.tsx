import React from "react";
import { useQuery } from "@tanstack/react-query";

import { fetchCCTVTiming } from "../../../API/getCCTVLive";
import { fetchAnalyzeTiming } from "../../../API/getAnalyze";
import { fetchDetectionTiming } from "../../../API/getDetection";
import { fetchReportTiming } from "../../../API/getReport";

// 단일 API 상태 카드
const ApiStatusCard: React.FC<{
  title: string;
  responseTime?: number | null;
}> = ({ title, responseTime }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all duration-200 hover:border-blue-200">
      <div className="flex items-start justify-between mb-1">
        <div className="flex flex-col gap-4">
          <h3 className="text-l font-semibold text-gray-900 mb-1">{title}</h3>
        </div>
        <div className="text-right">
          <div className="text-l font-bold text-blue-600">
            {typeof responseTime === "number"
              ? `${Math.round(responseTime)}ms`
              : "-"}
          </div>
          <div className="text-xs text-gray-500">응답시간</div>
        </div>
      </div>
    </div>
  );
};

const ApiStatusMonitor: React.FC = () => {
  // 실제 CCTV API 응답 시간 측정 (30초마다 갱신)
  const { data: cctvTimeMs } = useQuery({
    queryKey: ["cctvTime"],
    queryFn: fetchCCTVTiming,
    refetchInterval: 30000,
  });

  const { data: analyzeTimeMs } = useQuery({
    queryKey: ["analyzeTime"],
    queryFn: fetchAnalyzeTiming,
    refetchInterval: 30000,
  });

  const { data: detectionTimeMs } = useQuery({
    queryKey: ["detectionTime"],
    queryFn: fetchDetectionTiming,
    refetchInterval: 30000,
  });

  const { data: reportTimeMs } = useQuery({
    queryKey: ["reportTime"],
    queryFn: fetchReportTiming,
    refetchInterval: 30000,
  });

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">API 상태</h2>
        </div>

        <button className="flex items-center gap-2 bg-white hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg border border-gray-200 transition-colors duration-200">
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
        {/* 1) CCTV API - 실측 값 사용 */}
        <ApiStatusCard title="CCTV API" responseTime={cctvTimeMs ?? null} />

        {/* 2) 분석 API - 더미 */}
        <ApiStatusCard title="분석 API" responseTime={analyzeTimeMs ?? null} />

        {/* 3) 파손 API - 더미 */}
        <ApiStatusCard
          title="파손 API"
          responseTime={detectionTimeMs ?? null}
        />

        {/* 4) 지도 서비스 - 더미 */}
        <ApiStatusCard
          title="신고 조회 API"
          responseTime={reportTimeMs ?? null}
        />
      </div>
    </div>
  );
};

export default ApiStatusMonitor;
