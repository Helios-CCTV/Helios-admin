import React, { useState, useEffect } from "react";
import type { CCTVCamera, CCTVStats, RoadCCTVStatus } from "../../../types";
import {
  mockCCTVCameras,
  mockCCTVStats,
  mockRoadCCTVStatus,
} from "../../../data/mockData";

const RoadMonitor: React.FC<{ status: CCTVCamera["status"] }> = ({
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

const RoadStatusBadge: React.FC<{ status: RoadCCTVStatus["status"] }> = ({
  status,
}) => {
  const getConfig = (status: RoadCCTVStatus["status"]) => {
    switch (status) {
      case "normal":
        return {
          bg: "bg-green-100 border-green-200",
          text: "text-green-800",
          label: "정상",
          icon: "✅",
        };
      case "warning":
        return {
          bg: "bg-yellow-100 border-yellow-200",
          text: "text-yellow-800",
          label: "주의",
          icon: "⚠️",
        };
      case "critical":
        return {
          bg: "bg-red-100 border-red-200",
          text: "text-red-800",
          label: "위험",
          icon: "🚨",
        };
      default:
        return {
          bg: "bg-gray-100 border-gray-200",
          text: "text-gray-800",
          label: "알 수 없음",
          icon: "❓",
        };
    }
  };

  const config = getConfig(status);

  return (
    <span
      className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium border ${config.bg} ${config.text}`}
    >
      <span>{config.icon}</span>
      {config.label}
    </span>
  );
};

const ProgressBar: React.FC<{ percentage: number; color: string }> = ({
  percentage,
  color,
}) => {
  return (
    <div className="w-full bg-gray-200 rounded-full h-2">
      <div
        className={`h-2 rounded-full transition-all duration-300 ${color}`}
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
};

const CCTVCard: React.FC<{ camera: CCTVCamera }> = ({ camera }) => {
  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor(diff / (1000 * 60));

    if (hours > 24) {
      return `${Math.floor(hours / 24)}일 전`;
    } else if (hours > 0) {
      return `${hours}시간 전`;
    } else if (minutes > 0) {
      return `${minutes}분 전`;
    } else {
      return "방금 전";
    }
  };

  return (
    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h4 className="text-sm font-semibold text-gray-900 mb-1">
            {camera.name}
          </h4>
          <p className="text-xs text-gray-600 mb-2">{camera.location}</p>
          <CCTVStatusBadge status={camera.status} />
        </div>
        <div className="text-right">
          <div className="text-xs text-gray-500 mb-1">해상도</div>
          <div className="text-sm font-medium text-gray-900">
            {camera.resolution}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
        <div className="text-xs text-gray-500">
          {camera.status === "online"
            ? "온라인"
            : `마지막 연결: ${formatTime(camera.lastOnline)}`}
        </div>
        {camera.hasDamage && (
          <span className="px-2 py-1 bg-red-50 text-red-600 text-xs rounded-full">
            파손 감지
          </span>
        )}
      </div>
    </div>
  );
};

const RoadStatusCard: React.FC<{ road: RoadCCTVStatus }> = ({ road }) => {
  const onlinePercentage = (road.onlineCameras / road.totalCameras) * 100;

  const formatTime = (date?: Date) => {
    if (!date) return "없음";
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));

    if (hours > 24) {
      return `${Math.floor(hours / 24)}일 전`;
    } else if (hours > 0) {
      return `${hours}시간 전`;
    } else {
      return "1시간 이내";
    }
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {road.roadName}
          </h3>
          <RoadStatusBadge status={road.status} />
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-blue-600">
            {road.totalCameras}
          </div>
          <div className="text-sm text-gray-500">총 CCTV</div>
        </div>
      </div>

      <div className="space-y-3 mb-4">
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm text-gray-600">온라인 상태</span>
            <span className="text-sm font-medium text-gray-900">
              {road.onlineCameras}/{road.totalCameras} (
              {onlinePercentage.toFixed(1)}%)
            </span>
          </div>
          <ProgressBar
            percentage={onlinePercentage}
            color={
              onlinePercentage >= 90
                ? "bg-green-500"
                : onlinePercentage >= 70
                ? "bg-yellow-500"
                : "bg-red-500"
            }
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="text-xs text-gray-600 mb-1">파손 신고</div>
            <div className="text-lg font-semibold text-orange-600">
              {road.damageCount}건
            </div>
            {road.criticalDamageCount > 0 && (
              <div className="text-xs text-red-600">
                긴급: {road.criticalDamageCount}건
              </div>
            )}
          </div>
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="text-xs text-gray-600 mb-1">마지막 사고</div>
            <div className="text-sm font-medium text-gray-900">
              {formatTime(road.lastIncident)}
            </div>
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

const CCTVMonitor: React.FC = () => {
  const [cctvStats, setCctvStats] = useState<CCTVStats>(mockCCTVStats);
  const [cctvCameras] = useState<CCTVCamera[]>(mockCCTVCameras);
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

  const getFilteredCameras = () => {
    if (selectedStatus === "all") return cctvCameras;
    return cctvCameras.filter((camera) => camera.status === selectedStatus);
  };

  const filteredCameras = getFilteredCameras();

  const formatTime = (date: Date) => {
    return date.toLocaleString("ko-KR", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });
  };

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
          <div className="text-sm text-gray-500 mt-1">
            마지막 업데이트: {formatTime(currentTime)}
          </div>
        </div>

        <div className="flex gap-2">
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">전체 상태</option>
            <option value="online">온라인</option>
            <option value="offline">오프라인</option>
            <option value="maintenance">점검중</option>
            <option value="error">오류</option>
          </select>
          <button className="px-4 py-2 bg-white hover:bg-gray-50 text-gray-700 rounded-lg border border-gray-200 transition-colors duration-200 text-sm font-medium">
            새로고침
          </button>
        </div>
      </div>

      {/* 전체 통계 대시보드 */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 mb-6">
        <div className="bg-white rounded-lg p-4 text-center shadow-sm border border-gray-100">
          <div className="text-2xl font-bold text-gray-900">
            {cctvStats.total}
          </div>
          <div className="text-sm text-gray-600">총 CCTV</div>
        </div>
        <div className="bg-white rounded-lg p-4 text-center shadow-sm border border-gray-100">
          <div className="text-2xl font-bold text-green-600">
            {cctvStats.online}
          </div>
          <div className="text-sm text-gray-600">온라인</div>
        </div>
        <div className="bg-white rounded-lg p-4 text-center shadow-sm border border-gray-100">
          <div className="text-2xl font-bold text-red-600">
            {cctvStats.offline}
          </div>
          <div className="text-sm text-gray-600">오프라인</div>
        </div>
        <div className="bg-white rounded-lg p-4 text-center shadow-sm border border-gray-100">
          <div className="text-2xl font-bold text-yellow-600">
            {cctvStats.maintenance}
          </div>
          <div className="text-sm text-gray-600">점검중</div>
        </div>
        <div className="bg-white rounded-lg p-4 text-center shadow-sm border border-gray-100">
          <div className="text-2xl font-bold text-orange-600">
            {cctvStats.error}
          </div>
          <div className="text-sm text-gray-600">오류</div>
        </div>
        <div className="bg-white rounded-lg p-4 text-center shadow-sm border border-gray-100">
          <div className="text-2xl font-bold text-purple-600">
            {cctvStats.roadsWithDamage}
          </div>
          <div className="text-sm text-gray-600">파손 도로</div>
        </div>
        <div className="bg-white rounded-lg p-4 text-center shadow-sm border border-gray-100">
          <div className="text-2xl font-bold text-pink-600">
            {cctvStats.totalDamageReports}
          </div>
          <div className="text-sm text-gray-600">총 파손신고</div>
        </div>
        <div className="bg-white rounded-lg p-4 text-center shadow-sm border border-gray-100">
          <div className="text-2xl font-bold text-red-700">
            {cctvStats.criticalDamage}
          </div>
          <div className="text-sm text-gray-600">긴급 파손</div>
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

      {/* CCTV 상세 목록 */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            CCTV 상세 현황 ({filteredCameras.length}대)
          </h3>
          <div className="flex gap-2">
            <button className="px-3 py-1 text-xs bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors">
              지도로 보기
            </button>
            <button className="px-3 py-1 text-xs bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100 transition-colors">
              내보내기
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredCameras.map((camera) => (
            <CCTVCard key={camera.id} camera={camera} />
          ))}
        </div>

        {filteredCameras.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            선택된 조건에 맞는 CCTV가 없습니다.
          </div>
        )}
      </div>

      {/* 빠른 액션 버튼 */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-3">
        <button className="bg-white hover:bg-gray-50 text-gray-700 px-4 py-3 rounded-lg border border-gray-200 transition-colors duration-200 font-medium text-center">
          📊 통합 대시보드
        </button>
        <button className="bg-white hover:bg-gray-50 text-gray-700 px-4 py-3 rounded-lg border border-gray-200 transition-colors duration-200 font-medium text-center">
          🗺️ 지도 통합 뷰
        </button>
        <button className="bg-white hover:bg-gray-50 text-gray-700 px-4 py-3 rounded-lg border border-gray-200 transition-colors duration-200 font-medium text-center">
          🚨 긴급 알림 설정
        </button>
        <button className="bg-white hover:bg-gray-50 text-gray-700 px-4 py-3 rounded-lg border border-gray-200 transition-colors duration-200 font-medium text-center">
          📈 상태 리포트
        </button>
      </div>
    </div>
  );
};

export default RoadMonitor;
