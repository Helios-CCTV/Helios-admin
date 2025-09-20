import React, { useState, useEffect } from "react";
import type { CCTVCamera, CCTVStats, RoadCCTVStatus } from "../../../types";
import {
  mockCCTVCameras,
  mockCCTVStats,
  mockRoadCCTVStatus,
} from "../../../data/mockData";

// [컴포넌트] 개별 CCTV의 연결 상태를 뱃지로 보여주는 UI (온라인/오프라인/점검/오류)
const CCTVStatusBadge: React.FC<{ status: CCTVCamera["status"] }> = ({
  status,
}) => {
  const getConfig = (status: CCTVCamera["status"]) => {
    switch (status) {
      case "online":
        return {
          bg: "bg-green-100 border-green-200",
          text: "text-green-800",
          label: "온라인",
          icon: "🟢",
        };
      case "offline":
        return {
          bg: "bg-red-100 border-red-200",
          text: "text-red-800",
          label: "오프라인",
          icon: "🔴",
        };
      case "maintenance":
        return {
          bg: "bg-yellow-100 border-yellow-200",
          text: "text-yellow-800",
          label: "점검중",
          icon: "🟡",
        };
      case "error":
        return {
          bg: "bg-orange-100 border-orange-200",
          text: "text-orange-800",
          label: "오류",
          icon: "🟠",
        };
      default:
        return {
          bg: "bg-gray-100 border-gray-200",
          text: "text-gray-800",
          label: "알 수 없음",
          icon: "⚪",
        };
    }
  };

  const config = getConfig(status);

  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border ${config.bg} ${config.text}`}
    >
      <span>{config.icon}</span>
      {config.label}
    </span>
  );
};

// [컴포넌트] 도로별 CCTV 집계 카드. 온라인 비율/파손 신고/마지막 사고 등 표시
const RoadStatusCard: React.FC<{ road: RoadCCTVStatus }> = ({ road }) => {


  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {road.roadName}
          </h3>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-blue-600">
            {road.totalCameras}
          </div>
          <div className="text-sm text-gray-500">총 CCTV</div>
        </div>
      </div>

      <div className="space-y-3 mb-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="text-xs text-gray-600 mb-1">최근 신고</div>
            <div className="text-sm font-semibold text-orange-600">
              {road.damageCount}건
            </div>
          </div>
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="text-xs text-gray-600 mb-1">누적 신고</div>
            <div className="text-sm font-medium text-gray-900">130건</div>
          </div>
        </div>
      </div>
      <div className="flex gap-2">
        <button className="flex-1 px-3 py-2 text-xs bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors">
          CCTV 보기
        </button>
        <button className="flex-1 px-3 py-2 text-xs bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100 transition-colors">
          상세 정보
        </button>
      </div>
    </div>
  );
};

// [페이지 루트] 관리자용 CCTV 현황 모니터 메인 컴포넌트
const CCTVMonitor: React.FC = () => {
  const [cctvStats, setCctvStats] = useState<CCTVStats>(mockCCTVStats);

  const [roadStatus] = useState<RoadCCTVStatus[]>(mockRoadCCTVStatus);
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
      // 실제로는 여기서 API 호출하여 실시간 데이터 업데이트
      setCctvStats((prev) => ({
        ...prev,
        lastUpdated: new Date(),
      }));
    }, 30000); // 30초마다 업데이트

    return () => clearInterval(timer);
  }, []);

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
          <button className="px-4 py-2 bg-white hover:bg-gray-50 text-gray-700 rounded-lg border border-gray-200 transition-colors duration-200 text-sm font-medium">
            새로고침
          </button>
        </div>
      </div>

      {/* 전체 통계 대시보드 */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg p-4 text-center shadow-sm border border-gray-100">
          <div className="text-2xl font-bold text-gray-900">
            {cctvStats.total}
          </div>
          <div className="text-sm text-gray-600">총 CCTV</div>
        </div>

        <div className="bg-white rounded-lg p-4 text-center shadow-sm border border-gray-100">
          <div className="text-2xl font-bold text-yellow-600">
            {cctvStats.maintenance}
          </div>
          <div className="text-sm text-gray-600">점검중</div>
        </div>

        <div className="bg-white rounded-lg p-4 text-center shadow-sm border border-gray-100">
          <div className="text-2xl font-bold text-purple-600">
            {cctvStats.roadsWithDamage}
          </div>
          <div className="text-sm text-gray-600">일반 도로</div>
        </div>
        <div className="bg-white rounded-lg p-4 text-center shadow-sm border border-gray-100">
          <div className="text-2xl font-bold text-pink-600">
            {cctvStats.totalDamageReports}
          </div>
          <div className="text-sm text-gray-600">파손 도로</div>
        </div>
      </div>

      {/* 도로별 CCTV 현황 */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          도로별 CCTV 및 파손 현황
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {roadStatus.map((road) => (
            <RoadStatusCard key={road.roadName} road={road} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default CCTVMonitor; // 페이지 전체를 내보냄 (이전엔 뱃지 컴포넌트를 내보내서 화면에 '알 수 없음'만 보였음)
