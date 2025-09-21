/**
 * 관리자 대시보드의 "사용자 신고 현황" 섹션 (실데이터 연동)
 * - 더미(mock) 제거, 실제 API(getReport.ts)로부터 데이터를 받아 렌더링합니다.
 */
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchReportData } from "../../../API/getReport";

// 신고 API 단일 항목 타입 (서버 응답 스키마에 맞춤)
interface ReportItem {
  id: number;
  location: string;
  severity: number; // 1~3 등급 가정
  damageType: string; // ex) POTHOLE, CRACK ...
  isChecked: boolean; // 확인/처리 여부
}

// 우선순위 배지 (서버 severity 숫자 기반)
const PriorityIcon: React.FC<{ severity: number }> = ({ severity }) => {
  // severity 숫자에 따른 등급/색상 라벨링 (임계값은 정책에 맞춰 조정)
  const getConfig = (s: number) => {
    if (s >= 3) return { color: "text-red-500", label: "긴급" };
    if (s === 2) return { color: "text-orange-500", label: "높음" };
    return { color: "text-green-600", label: "보통" };
  };
  const cfg = getConfig(severity);
  return (
    <div className={`flex items-center gap-1 ${cfg.color}`}>
      <span className="text-sm font-medium">{cfg.label}</span>
    </div>
  );
};

// 확인 상태 뱃지 (isChecked 기반)
const StatusBadge: React.FC<{ checked: boolean }> = ({ checked }) => {
  const cfg = checked
    ? { bg: "bg-green-100", text: "text-green-800", label: "확인됨" }
    : { bg: "bg-gray-100", text: "text-gray-800", label: "미확인" };
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${cfg.bg} ${cfg.text}`}
    >
      {cfg.label}
    </span>
  );
};

// 신고 유형 아이콘 (damageType 문자열 기반)
const TypeIcon: React.FC<{ damageType: string }> = ({ damageType }) => {
  const t = (damageType || "").toUpperCase();
  const getTypeConfig = (k: string) => {
    if (k.includes("POTHOLE"))
      return { label: "포트홀", color: "text-red-600" };
    if (k.includes("CRACK")) return { label: "균열", color: "text-orange-600" };
    if (k.includes("RUT")) return { label: "러팅", color: "text-yellow-600" };
    return { label: damageType || "기타", color: "text-gray-600" };
  };
  const cfg = getTypeConfig(t);
  return (
    <div className={`flex items-center gap-1 ${cfg.color}`}>
      <span className="text-sm font-medium">{cfg.label}</span>
    </div>
  );
};

// 메인 컨테이너 컴포넌트
// - 상단 통계 카드 4개 + 신고 리스트 테이블을 구성합니다.
const ReportListManager: React.FC = () => {
  // 실데이터 로드
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["reports"],
    queryFn: fetchReportData,
    refetchOnWindowFocus: false,
  });

  // 응답 파싱: axios Response → response.data.data (배열)
  const reports: ReportItem[] = (data as any)?.data?.data ?? [];

  // 상단 통계 (실데이터 기준)
  const statsCards = [
    { title: "총 신고", value: reports.length },
    {
      title: "미확인",
      value: reports.filter((r) => !r.isChecked).length,
    },
    {
      title: "확인됨",
      value: reports.filter((r) => r.isChecked).length,
    },
    {
      title: "위험",
      value: reports.filter((r) => r.severity >= 3).length,
    },
  ];

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

      {/* 통계 카드 4칸: 총 신고/미확인/확인됨/고우선 */}
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
              </div>
            </div>
          );
        })}
      </div>

      {/* 신고 리스트 테이블 */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            신고 목록 ({reports.length}건)
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
                  우선순위
                </th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3">
                  상태
                </th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3">
                  작업
                </th>
              </tr>
            </thead>
            {/* 바디: 실데이터 렌더링 */}
            <tbody className="bg-white divide-y divide-gray-200">
              {/* 로딩/에러 상태 */}
              {isLoading && (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-8 text-center text-gray-500"
                  >
                    불러오는 중…
                  </td>
                </tr>
              )}
              {isError && (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-8 text-center text-red-600"
                  >
                    불러오지 못했습니다.{" "}
                    <button onClick={() => refetch()} className="underline">
                      다시 시도
                    </button>
                  </td>
                </tr>
              )}

              {/* 정상 데이터 */}
              {!isLoading &&
                !isError &&
                reports.map((report) => (
                  <tr key={report.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <TypeIcon damageType={report.damageType} />
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {report.location}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <PriorityIcon severity={report.severity} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusBadge checked={report.isChecked} />
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

              {/* 빈 상태 */}
              {!isLoading && !isError && reports.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-8 text-center text-gray-500"
                  >
                    표시할 신고가 없습니다.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ReportListManager;
