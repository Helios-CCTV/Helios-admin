import React, { useState, useEffect } from "react";
import type { SystemInfo, AdminInfo } from "../../../types";
import { mockSystemInfo } from "../../../data/mockData";

export default function SystemInfoSidebar() {
  const [systemInfo] = useState<SystemInfo>(mockSystemInfo);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [adminInfo] = useState<AdminInfo>({
    id: "admin-1",
    name: "이세현",
    email: "example@example.com",
    role: "admin",
    department: "관리팀",
    lastLogin: new Date(),
    permissions: ["전체 관리", "신고 처리", "API 관리", "CCTV 보기"],
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });
  };

  const getStatusColor = (
    value: number,
    thresholds: { good: number; warning: number }
  ) => {
    if (value >= thresholds.good) return "text-green-600";
    if (value >= thresholds.warning) return "text-yellow-600";
    return "text-red-600";
  };

  const getProgressBarColor = (
    value: number,
    thresholds: { good: number; warning: number }
  ) => {
    if (value >= thresholds.good) return "bg-green-500";
    if (value >= thresholds.warning) return "bg-yellow-500";
    return "bg-red-500";
  };

  return (
    <div className="bg-white h-full flex flex-col shadow-lg border-l border-gray-200">
      {/* 헤더 */}
      <div className="p-6 bg-gradient-to-r from-blue-500 to-blue-400 text-white">
        <div className="flex items-center gap-3 mb-4">
          <div>
            <h1 className="text-xl font-bold">Helios</h1>
            <p className="text-blue-100 text-sm">CCTV 관리 시스템</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* 관리자 정보 */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
              {adminInfo.name.charAt(0)}
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">{adminInfo.name}</h3>
              <p className="text-sm text-gray-500">{adminInfo.department}</p>
            </div>
          </div>
          <div className="text-xs text-gray-500">
            마지막 로그인: {adminInfo.lastLogin.toLocaleDateString("ko-KR")}
          </div>
        </div>

        {/* 현재 시간 */}
        <div className="p-4 border-b border-gray-200">
          <h4 className="text-sm font-semibold text-gray-700 mb-2">
            현재 시간
          </h4>
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="text-lg font-mono text-gray-900">
              {formatTime(currentTime)}
            </div>
            <div className="text-sm text-gray-500 mt-1">서울시간 (UTC+9)</div>
          </div>
        </div>

        {/* 오늘의 통계 */}
        <div className="p-4 border-b border-gray-200">
          <h4 className="text-sm font-semibold text-gray-700 mb-3">
            오늘의 활동
          </h4>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-green-500">✅</span>
                <span className="text-sm text-gray-600">해결된 신고</span>
              </div>
              <span className="text-sm font-semibold text-gray-900">
                {systemInfo.resolvedToday}건
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-yellow-500">⏳</span>
                <span className="text-sm text-gray-600">대기 중 신고</span>
              </div>
              <span className="text-sm font-semibold text-gray-900">
                {systemInfo.pendingReports}건
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-blue-500">📊</span>
                <span className="text-sm text-gray-600">총 신고</span>
              </div>
              <span className="text-sm font-semibold text-gray-900">
                {systemInfo.totalReports}건
              </span>
            </div>
          </div>
        </div>

        {/* 사이드 메뉴 */}
        <div className="p-4">
          <h4 className="text-sm font-semibold text-gray-700 mb-3">
            주요 관리 도구
          </h4>

          <div className="space-y-2">
            <button className="w-full flex items-center gap-3 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors duration-200">
              <span className="text-sm font-medium text-gray-700">
                파손 현황
              </span>
            </button>

            <button className="w-full flex items-center gap-3 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors duration-200">
              <span className="text-sm font-medium text-gray-700">
                사용자 신고 현황
              </span>
            </button>

            <button className="w-full flex items-center gap-3 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors duration-200">
              <span className="text-sm font-medium text-gray-700">
                CCTV 상태 보기
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
