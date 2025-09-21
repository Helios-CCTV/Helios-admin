/**
 * 관리자 대시보드의 "사용자 신고 현황" 섹션입니다.
 * - mockReports(모의 데이터)를 불러와 통계 카드 + 신고 리스트 테이블을 렌더링합니다.
 */
import React, { useState } from "react";
import type { Report } from "../../../types";
import { mockReports } from "../../../data/mockData";

// 우선순위 아이콘/라벨 컴포넌트
// - Report.priority 값(urgent/high/medium/low)에 따라 색상과 이모지가 달라집니다.
// - 테이블의 "우선순위" 컬럼에서 재사용합니다.
const PriorityIcon: React.FC<{ priority: Report["priority"] }> = ({
  priority,
}) => {
  // priority 값별로 색상/아이콘 매핑
  const getConfig = (priority: Report["priority"]) => {
    switch (priority) {
      case "urgent":
        return { color: "text-red-500", icon: "🚨" };
      case "high":
        return { color: "text-orange-500", icon: "⚠️" };
      case "medium":
        return { color: "text-yellow-500", icon: "📋" };
      case "low":
        return { color: "text-green-500", icon: "📝" };
      default:
        return { color: "text-gray-500", icon: "📄" };
    }
  };

  const config = getConfig(priority);

  return (
    <div className={`flex items-center gap-1 ${config.color}`}>
      <span>{config.icon}</span>
      <span className="text-sm font-medium capitalize">
        {priority === "urgent"
          ? "긴급"
          : priority === "high"
          ? "높음"
          : priority === "medium"
          ? "보통"
          : "낮음"}
      </span>
    </div>
  );
};

// 처리 상태 뱃지 컴포넌트
// - Report.status 값(pending/assigned/in_progress/resolved/closed)에 따라 배경/텍스트 컬러와 라벨이 달라집니다.
const StatusBadge: React.FC<{ status: Report["status"] }> = ({ status }) => {
  // status 값별 스타일/라벨 매핑
  const getStatusConfig = (status: Report["status"]) => {
    switch (status) {
      case "pending":
        return { bg: "bg-gray-100", text: "text-gray-800", label: "대기중" };
      case "assigned":
        return { bg: "bg-blue-100", text: "text-blue-800", label: "배정됨" };
      case "in_progress":
        return {
          bg: "bg-yellow-100",
          text: "text-yellow-800",
          label: "진행중",
        };
      case "resolved":
        return { bg: "bg-green-100", text: "text-green-800", label: "해결됨" };
      case "closed":
        return { bg: "bg-purple-100", text: "text-purple-800", label: "완료" };
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

// 신고 유형 아이콘/라벨 컴포넌트
// - Report.type 값(damage/accident/maintenance/emergency/기타)에 따라 아이콘/색상이 달라집니다.
const TypeIcon: React.FC<{ type: Report["type"] }> = ({ type }) => {
  // type 값별 아이콘/라벨/색상 매핑
  const getTypeConfig = (type: Report["type"]) => {
    switch (type) {
      case "damage":
        return { icon: "🚧", label: "파손", color: "text-red-600" };
      case "accident":
        return { icon: "🚗", label: "사고", color: "text-orange-600" };
      case "maintenance":
        return { icon: "🔧", label: "정비", color: "text-blue-600" };
      case "emergency":
        return { icon: "🚨", label: "응급", color: "text-red-700" };
      default:
        return { icon: "📋", label: "기타", color: "text-gray-600" };
    }
  };

  const config = getTypeConfig(type);

  return (
    <div className={`flex items-center gap-1 ${config.color}`}>
      <span>{config.icon}</span>
      <span className="text-sm font-medium">{config.label}</span>
    </div>
  );
};

// 메인 컨테이너 컴포넌트
// - 상단 통계 카드 4개 + 신고 리스트 테이블을 구성합니다.
const ReportListManager: React.FC = () => {
  const [reports] = useState<Report[]>(mockReports);
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [selectedPriority, setSelectedPriority] = useState<string>("all");

  // reports: 화면에 표시할 신고 데이터(모의 데이터). 실제 연동 시 서버 응답으로 대체.
  // selectedStatus/selectedPriority: 필터링 상태(현재는 UI 미노출, 내부 필터 로직만 유지)

  // 선택된 상태/우선순위에 맞춰 리스트를 필터링
  const getFilteredReports = () => {
    return reports.filter((report) => {
      const statusMatch =
        selectedStatus === "all" || report.status === selectedStatus;
      const priorityMatch =
        selectedPriority === "all" || report.priority === selectedPriority;
      return statusMatch && priorityMatch;
    });
  };

  const filteredReports = getFilteredReports();

  // 상단 통계 카드에 들어갈 값 계산
  // - 총 신고, 대기중, 진행중(배정+진행), 완료(해결+완료)
  const getStatsCards = () => {
    return [
      {
        title: "총 신고",
        value: reports.length,
        color: "blue",
        icon: "📋",
      },
      {
        title: "대기중",
        value: reports.filter((r) => r.status === "pending").length,
        color: "gray",
        icon: "⏳",
      },
      {
        title: "진행중",
        value: reports.filter(
          (r) => r.status === "in_progress" || r.status === "assigned"
        ).length,
        color: "yellow",
        icon: "🔄",
      },
      {
        title: "완료",
        value: reports.filter(
          (r) => r.status === "resolved" || r.status === "closed"
        ).length,
        color: "green",
        icon: "✅",
      },
    ];
  };

  // "방금 전/분 전/시간 전/일 전" 형태로 상대 시각을 계산해 표시
  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days > 0) return `${days}일 전`;
    if (hours > 0) return `${hours}시간 전`;
    if (minutes > 0) return `${minutes}분 전`;
    return "방금 전";
  };

  const statsCards = getStatsCards();

  return (
    // 페이지 전체 컨테이너: 그라디언트 배경 + 라운딩
    <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          사용자 신고 현황
        </h2>
        <p className="text-gray-600">
          실시간으로 접수되는 신고를 효율적으로 관리하고 처리합니다.
        </p>
      </div>

      {/* 통계 카드 4칸: 총 신고/대기중/진행중/완료 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {statsCards.map((card, index) => {
          // 카드 색상 테마 매핑(텍스트/배경)
          const colorClasses = {
            blue: "bg-blue-50 text-blue-700",
            gray: "bg-gray-50 text-gray-700",
            yellow: "bg-yellow-50 text-yellow-700",
            green: "bg-green-50 text-green-700",
          };

          return (
            <div
              key={index}
              className="bg-white rounded-lg p-4 shadow-sm border border-gray-100"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">{card.title}</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {card.value}
                  </p>
                </div>
                <div
                  className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                    colorClasses[card.color as keyof typeof colorClasses]
                  }`}
                >
                  <span className="text-lg">{card.icon}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 신고 리스트 테이블 */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            신고 목록 ({filteredReports.length}건)
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            {/* 헤더: 컬럼명 */}
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3">
                  유형
                </th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3">
                  위치
                </th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3">
                  신고자
                </th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3">
                  우선순위
                </th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3">
                  상태
                </th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3">
                  담당자
                </th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3">
                  접수시간
                </th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3">
                  작업
                </th>
              </tr>
            </thead>
            {/* 바디: 필터 조건에 맞는 신고만 표시 */}
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredReports.map((report) => (
                <tr key={report.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <TypeIcon type={report.type} />
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {report.location}
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">
                      {report.reporter}
                    </div>
                    <div className="text-sm text-gray-500">
                      {report.contactInfo}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <PriorityIcon priority={report.priority} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <StatusBadge status={report.status} />
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {report.assignedTo || "-"}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {formatTime(report.createdAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex gap-2">
                      <button className="text-green-600 hover:text-green-800 font-medium">
                        처리
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 빈 상태: 필터 결과가 없을 때 안내 */}
        {filteredReports.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            조건에 맞는 신고가 없습니다.
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportListManager;
