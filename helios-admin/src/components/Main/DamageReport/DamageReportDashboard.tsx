/**

 * 도로 파손 현황을 한눈에 볼 수 있는 대시보드 페이지입니다.
 * - 실제 API 연동 전까지 화면 흐름과 구조를 이해하는 용도로 사용합니다.
 */
import React, { useState } from "react";
import type { DamageReport, ChartData } from "../../../types";
import { mockDamageReports } from "../../../data/mockData";

/**
 * 신고된 파손의 우선순위(severity)를 작은 배지로 표시하는 컴포넌트입니다.
 * severity 값(critical/high/medium/low)에 따라 색상과 라벨이 다르게 나옵니다.
 */
const PriorityBadge: React.FC<{ severity: DamageReport["severity"] }> = ({
  severity,
}) => {
  // severity 값에 따라 배경색/글자색/라벨을 결정
  const getSeverityConfig = (severity: DamageReport["severity"]) => {
    switch (severity) {
      case "critical":
        return { bg: "bg-red-100", text: "text-red-800", label: "긴급" };
      case "high":
        return { bg: "bg-orange-100", text: "text-orange-800", label: "높음" };
      case "medium":
        return { bg: "bg-yellow-100", text: "text-yellow-800", label: "보통" };
      case "low":
        return { bg: "bg-green-100", text: "text-green-800", label: "낮음" };
      default:
        return {
          bg: "bg-gray-100",
          text: "text-gray-800",
          label: "알 수 없음",
        };
    }
  };

  const config = getSeverityConfig(severity);

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}
    >
      {config.label}
    </span>
  );
};

/**
 * StatusBadge
 * 파손 신고의 처리 상태(status)를 보여주는 배지입니다.
 * reported/in_progress/completed/verified 값에 따라 색상과 라벨이 달라집니다.
 */
const StatusBadge: React.FC<{ status: DamageReport["status"] }> = ({
  status,
}) => {
  // status 값에 따라 배경색/글자색/라벨을 결정
  const getStatusConfig = (status: DamageReport["status"]) => {
    switch (status) {
      case "reported":
        return { bg: "bg-blue-100", text: "text-blue-800", label: "신고됨" };
      case "in_progress":
        return {
          bg: "bg-yellow-100",
          text: "text-yellow-800",
          label: "진행중",
        };
      case "completed":
        return { bg: "bg-green-100", text: "text-green-800", label: "완료" };
      case "verified":
        return {
          bg: "bg-purple-100",
          text: "text-purple-800",
          label: "검증됨",
        };
      default:
        return {
          bg: "bg-gray-100",
          text: "text-gray-800",
          label: "알 수 없음",
        };
    }
  };

  const config = getStatusConfig(status);

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}
    >
      {config.label}
    </span>
  );
};

/**
 * DoughnutChart
 * 간단한 도넛 차트를 그려주는 컴포넌트입니다.
 * data 배열을 받아서 비율에 맞는 원호를 그리고, 중앙에는 총 건수를 표시합니다.
 */
const DoughnutChart: React.FC<{ data: ChartData[] }> = ({ data }) => {
  // 전체 값의 합계를 계산 → 비율을 구할 때 사용
  const total = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="relative w-32 h-32 mx-auto">
      {/* 회색 배경 원 + data를 기반으로 한 원호들을 그리는 부분 */}
      <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 120 120">
        <circle
          cx="60"
          cy="60"
          r="45"
          stroke="#f3f4f6"
          strokeWidth="10"
          fill="transparent"
        />
        {data.map((item, index) => {
          // 각 데이터 조각의 비율과 원호 길이/위치를 계산
          const percentage = (item.value / total) * 100;
          const circumference = 2 * Math.PI * 45;
          const strokeDasharray = `${
            (percentage / 100) * circumference
          } ${circumference}`;
          const previousPercentage = data
            .slice(0, index)
            .reduce((sum, prev) => sum + (prev.value / total) * 100, 0);
          const strokeDashoffset = -(
            (previousPercentage / 100) *
            circumference
          );

          return (
            <circle
              key={index}
              cx="60"
              cy="60"
              r="45"
              stroke={item.color || "#3b82f6"}
              strokeWidth="10"
              fill="transparent"
              strokeDasharray={strokeDasharray}
              strokeDashoffset={strokeDashoffset}
              className="transition-all duration-300"
            />
          );
        })}
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="text-2xl font-bold text-gray-900">{total}</div>
        <div className="text-xs text-gray-500">총 건수</div>
      </div>
    </div>
  );
};

/**
 * DamageReportDashboard
 * 대시보드 페이지의 메인 컴포넌트입니다.
 * - 상단에 제목과 설명
 * - 도넛 차트 3종 (유형별, 우선순위별, 상태별)
 * - 최근 신고 내역 테이블
 */
const DamageReportDashboard: React.FC = () => {
  // 현재 화면에 표시할 신고 데이터 (mockData 사용)
  const [damageReports] = useState<DamageReport[]>(mockDamageReports);

  // 내부 type 코드(pothole, crack 등)를 사람이 읽기 좋은 한글로 변환
  const getTypeDisplayName = (type: DamageReport["type"]) => {
    const typeMap = {
      pothole: "포트홀",
      crack: "균열",
      sign_damage: "표지판 손상",
      lighting: "조명",
      barrier: "방호벽",
    };
    return typeMap[type] || type;
  };

  // 유형별 신고 건수를 집계해서 차트용 데이터로 변환
  const getStatsByType = () => {
    const typeStats: { [key: string]: number } = {};
    damageReports.forEach((report) => {
      const typeName = getTypeDisplayName(report.type);
      typeStats[typeName] = (typeStats[typeName] || 0) + 1;
    });

    // label, value, color 형태로 도넛 차트에 들어갈 데이터 생성
    return Object.entries(typeStats).map(([label, value], index) => ({
      label,
      value,
      color: ["#ef4444", "#f97316", "#eab308", "#22c55e", "#8b5cf6"][index % 5],
    }));
  };

  // 우선순위(severity)별 신고 건수를 집계
  const getStatsBySeverity = () => {
    const severityStats: { [key: string]: number } = {};
    damageReports.forEach((report) => {
      const severityMap = {
        critical: "긴급",
        high: "높음",
        medium: "보통",
        low: "낮음",
      };
      const severityName = severityMap[report.severity];
      severityStats[severityName] = (severityStats[severityName] || 0) + 1;
    });

    return Object.entries(severityStats).map(([label, value], index) => ({
      label,
      value,
      color: ["#dc2626", "#ea580c", "#ca8a04", "#16a34a"][index % 4],
    }));
  };

  // 처리 상태(status)별 신고 건수를 집계
  const getStatsByStatus = () => {
    const statusStats: { [key: string]: number } = {};
    damageReports.forEach((report) => {
      const statusMap = {
        reported: "신고됨",
        in_progress: "진행중",
        completed: "완료",
        verified: "검증됨",
      };
      const statusName = statusMap[report.status];
      statusStats[statusName] = (statusStats[statusName] || 0) + 1;
    });

    return Object.entries(statusStats).map(([label, value], index) => ({
      label,
      value,
      color: ["#3b82f6", "#eab308", "#22c55e", "#8b5cf6"][index % 4],
    }));
  };

  // 차트에 사용할 데이터 생성
  const typeData = getStatsByType();
  const severityData = getStatsBySeverity();
  const statusData = getStatsByStatus();

  return (
    <>
      {/* 대시보드 전체 레이아웃 컨테이너 */}
      <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl p-6">
        {/* 제목 + 설명 */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">파손 현황</h2>
          <p className="text-gray-600">
            도로 파손 및 시설물 손상 현황을 실시간으로 모니터링합니다.
          </p>
        </div>

        {/* 유형/우선순위/상태 차트 3개 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* 손상 유형별 통계 */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              손상 유형별
            </h3>
            {/* 도넛 차트와 범례 */}
            <DoughnutChart data={typeData} />
            <div className="mt-4 space-y-2">
              {typeData.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between text-sm"
                >
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: item.color }}
                    ></div>
                    <span className="text-gray-700">{item.label}</span>
                  </div>
                  <span className="font-medium text-gray-900">
                    {item.value}건
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* 우선순위별 통계 */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              우선순위별
            </h3>
            {/* 도넛 차트와 범례 */}
            <DoughnutChart data={severityData} />
            <div className="mt-4 space-y-2">
              {severityData.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between text-sm"
                >
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: item.color }}
                    ></div>
                    <span className="text-gray-700">{item.label}</span>
                  </div>
                  <span className="font-medium text-gray-900">
                    {item.value}건
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* 처리 상태별 통계 */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              처리 상태별
            </h3>
            {/* 도넛 차트와 범례 */}
            <DoughnutChart data={statusData} />
            <div className="mt-4 space-y-2">
              {statusData.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between text-sm"
                >
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: item.color }}
                    ></div>
                    <span className="text-gray-700">{item.label}</span>
                  </div>
                  <span className="font-medium text-gray-900">
                    {item.value}건
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 최근 파손 신고 내역 테이블 */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              최근 파손 신고
            </h3>
            <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
              전체 보기
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              {/* 테이블 헤더 */}
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left text-sm font-medium text-gray-500 pb-2">
                    위치
                  </th>
                  <th className="text-left text-sm font-medium text-gray-500 pb-2">
                    유형
                  </th>
                  <th className="text-left text-sm font-medium text-gray-500 pb-2">
                    우선순위
                  </th>
                  <th className="text-left text-sm font-medium text-gray-500 pb-2">
                    상태
                  </th>
                  <th className="text-left text-sm font-medium text-gray-500 pb-2">
                    담당자
                  </th>
                  <th className="text-left text-sm font-medium text-gray-500 pb-2">
                    예상 시간
                  </th>
                </tr>
              </thead>
              {/* 테이블 바디: 최근 5건만 표시 */}
              <tbody className="divide-y divide-gray-100">
                {damageReports.slice(0, 5).map((report) => (
                  <tr key={report.id} className="hover:bg-gray-50">
                    <td className="py-3 text-sm text-gray-900">
                      {report.location}
                    </td>
                    <td className="py-3 text-sm text-gray-700">
                      {getTypeDisplayName(report.type)}
                    </td>
                    <td className="py-3">
                      <PriorityBadge severity={report.severity} />
                    </td>
                    <td className="py-3">
                      <StatusBadge status={report.status} />
                    </td>
                    <td className="py-3 text-sm text-gray-700">
                      {report.assignedTo || "-"}
                    </td>
                    <td className="py-3 text-sm text-gray-700">
                      {report.estimatedRepairTime}시간
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default DamageReportDashboard;
