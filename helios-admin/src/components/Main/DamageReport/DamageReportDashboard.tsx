import React, { useState } from "react";
import type { DamageReport, ChartData } from "../../../types";
import { mockDamageReports } from "../../../data/mockData";

const PriorityBadge: React.FC<{ severity: DamageReport["severity"] }> = ({
  severity,
}) => {
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

const StatusBadge: React.FC<{ status: DamageReport["status"] }> = ({
  status,
}) => {
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

const DoughnutChart: React.FC<{ data: ChartData[] }> = ({ data }) => {
  const total = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="relative w-32 h-32 mx-auto">
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

const DamageReportDashboard: React.FC = () => {
  const [damageReports] = useState<DamageReport[]>(mockDamageReports);

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

  const getStatsByType = () => {
    const typeStats: { [key: string]: number } = {};
    damageReports.forEach((report) => {
      const typeName = getTypeDisplayName(report.type);
      typeStats[typeName] = (typeStats[typeName] || 0) + 1;
    });

    return Object.entries(typeStats).map(([label, value], index) => ({
      label,
      value,
      color: ["#ef4444", "#f97316", "#eab308", "#22c55e", "#8b5cf6"][index % 5],
    }));
  };

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

  const typeData = getStatsByType();
  const severityData = getStatsBySeverity();
  const statusData = getStatsByStatus();

  return (
    <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          파손 현황
        </h2>
        <p className="text-gray-600">
          도로 파손 및 시설물 손상 현황을 실시간으로 모니터링합니다.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* 손상 유형별 통계 */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            손상 유형별
          </h3>
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

      {/* 최근 신고 목록 */}
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
  );
};

export default DamageReportDashboard;
