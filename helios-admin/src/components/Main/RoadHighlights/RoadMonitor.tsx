import React from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchAnalyzeData } from "../../../API/getAnalyze";

// 서버에서 내려오는 항목 중 이 화면에서 사용하는 필드만 최소 정의
interface AnalyzeItem {
  detections?: string[] | null; // 파손 라벨 배열 (없을 수 있어 null/undefined 허용)
}

const LABELS = [
  "반사균열",
  "세로방향균열",
  "밀림균열",
  "러팅",
  "코루게이션및쇼빙",
  "함몰",
  "포트홀",
  "라벨링",
  "박리",
  "단부균열",
  "시공균열",
  "거북등",
] as const;

const CCTVMonitor: React.FC = () => {
  const { data, isLoading, isError, refetch } = useQuery<AnalyzeItem[]>({
    queryKey: ["detections-for-monitor"],
    queryFn: fetchAnalyzeData,
    refetchOnWindowFocus: false,
  });

  // data가 undefined일 수 있으므로 안전한 기본값을 부여
  const reports: AnalyzeItem[] = data ?? [];

  const totalCCTV = reports.length;
  const detected = reports.filter(
    (r) => (r.detections?.length ?? 0) > 0
  ).length;
  const undetected = reports.filter(
    (r) => Array.isArray(r.detections) && r.detections.length === 0
  ).length;
  const maintenance = Math.max(0, totalCCTV - detected - undetected);

  const labelCounts = new Map<string, number>();
  for (const r of reports) {
    for (const label of r.detections ?? []) {
      labelCounts.set(label, (labelCounts.get(label) || 0) + 1);
    }
  }

  return (
    <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            전국 CCTV 현황 모니터링
          </h2>
          <p className="text-gray-600">
            실시간 CCTV 상태 및 도로 파손 현황을 종합적으로 모니터링합니다.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => refetch()}
            className="px-4 py-2 bg-white hover:bg-gray-50 text-gray-700 rounded-lg border border-gray-200 transition-colors duration-200 text-sm font-medium"
          >
            새로고침
          </button>
        </div>
      </div>

      {/* 상단 통계 카드: 총 CCTV / 점검중 / 일반 도로 / 파손 도로 */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg p-4 text-center shadow-sm border border-gray-100">
          <div className="text-2xl font-bold text-gray-900">{totalCCTV}</div>
          <div className="text-sm text-gray-600">총 CCTV</div>
        </div>
        <div className="bg-white rounded-lg p-4 text-center shadow-sm border border-gray-100">
          <div className="text-2xl font-bold text-yellow-600">
            {maintenance}
          </div>
          <div className="text-sm text-gray-600">점검중</div>
        </div>
        <div className="bg-white rounded-lg p-4 text-center shadow-sm border border-gray-100">
          <div className="text-2xl font-bold text-purple-600">{undetected}</div>
          <div className="text-sm text-gray-600">일반 도로</div>
        </div>
        <div className="bg-white rounded-lg p-4 text-center shadow-sm border border-gray-100">
          <div className="text-2xl font-bold text-pink-600">{detected}</div>
          <div className="text-sm text-gray-600">파손 도로</div>
        </div>
      </div>

      {/* 도로별 CCTV 및 파손 현황 */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          도로별 CCTV 및 파손 현황
        </h3>
        {isError ? (
          <div className="text-sm text-red-600">
            데이터를 불러오지 못했습니다. 다시 시도해주세요.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {LABELS.map((name, idx) => (
              <div
                key={idx}
                className="bg-white rounded-lg p-4 shadow-sm border border-gray-100 hover:shadow-md transition-all"
              >
                <div className="flex items-center justify-between">
                  <div className="text-base font-semibold text-gray-800">
                    {name}
                  </div>
                  <span className="text-base font-semibold text-gray-800">
                    {labelCounts.get(name) || 0}개
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CCTVMonitor;
