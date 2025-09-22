import React from "react";
import type { DamageReport, ChartData } from "../../../types";
import { useQuery } from "@tanstack/react-query";
import { fetchDetectionData } from "../../../API/getDetection";

// 도넛 차트 컴포넌트
const DoughnutChart: React.FC<{ data: ChartData[] }> = ({ data }) => {
  // 총합 계산: 모든 데이터 값의 합을 구함
  const total = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="relative w-32 h-32 mx-auto">
      {/* SVG 원을 이용해 도넛 차트 그리기, -90도 회전하여 12시 방향부터 시작 */}
      <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 120 120">
        {/* 배경 원 (회색) */}
        <circle
          cx="60"
          cy="60"
          r="45"
          stroke="#f3f4f6"
          strokeWidth="10"
          fill="transparent"
        />
        {/* 데이터 배열을 순회하며 각각의 파이 조각을 원으로 그리기 */}
        {data.map((item, index) => {
          // 각 항목의 비율 계산 (전체 대비 백분율)
          const percentage = total > 0 ? (item.value / total) * 100 : 0;
          // 원의 둘레 길이 계산 (2 * π * 반지름)
          const circumference = 2 * Math.PI * 45;
          // 원의 strokeDasharray 설정: 비율에 맞는 길이와 나머지 길이
          const strokeDasharray = `${
            (percentage / 100) * circumference
          } ${circumference}`;
          // 이전 항목들의 누적 비율 계산하여 offset 지정
          const previousPercentage = data
            .slice(0, index)
            .reduce(
              (sum, prev) => sum + (total > 0 ? (prev.value / total) * 100 : 0),
              0
            );
          // strokeDashoffset은 누적 비율에 따른 위치 조정 (- 부호로 시계방향 이동)
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
      {/* 도넛 중앙에 총합 숫자와 라벨 표시 */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="text-xl font-bold text-gray-900">{total}</div>
        <div className="text-xs text-gray-500">총 건수</div>
      </div>
    </div>
  );
};

// 주요 파손 라벨 목록 (도로 유형)
const DamageReportDashboard: React.FC = () => {
  // React Query를 사용하여 API로부터 파손 데이터 비동기 로드
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["detections"], // 쿼리 식별자
    queryFn: fetchDetectionData, // 데이터 요청 함수
    refetchOnWindowFocus: false, // 윈도우 포커스 시 재요청 비활성화
  });

  const reports: DamageReport[] = data || [];

  // 모든 파손 라벨(detections[])을 펼쳐서 라벨별로 몇 번 나왔는지 집계
  const labelCounts = new Map<string, number>();
  for (const r of reports) {
    for (const label of r.detections ?? []) {
      labelCounts.set(label, (labelCounts.get(label) || 0) + 1);
    }
  }

  // 차트에 사용할 데이터 생성: 상위 8개의 라벨과 개수를 색상과 함께 배열로 만듦
  const COLORS = [
    "#ef4444",
    "#f97316",
    "#eab308",
    "#22c55e",
    "#06b6d4",
    "#8b5cf6",
    "#f43f5e",
    "#10b981",
  ];
  const typeData: ChartData[] = Array.from(labelCounts.entries())
    .sort((a, b) => b[1] - a[1]) // 개수 내림차순 정렬
    .slice(0, 8) // 상위 8개만
    .map(([label, value], index) => ({
      label,
      value,
      color: COLORS[index % COLORS.length], // 색상 할당
    }));

  // 최근 탐지 내역: 날짜 기준 내림차순 정렬 후 상위 10건 추출
  const recentReports = [...reports]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 10);

  // 로딩 상태 UI
  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
        <div className="animate-pulse text-gray-500">
          파손 데이터를 불러오는 중…
        </div>
      </div>
    );
  }

  // 에러 상태 UI
  if (isError) {
    return (
      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
        <div className="text-red-600 font-medium mb-3">
          파손 데이터를 불러오지 못했습니다.
        </div>
        {/* 재요청 버튼 */}
        <button
          onClick={() => refetch()}
          className="px-3 py-1.5 text-sm rounded-lg bg-blue-600 text-white hover:bg-blue-700"
        >
          다시 시도
        </button>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl p-6">
      {/* 헤더 영역 */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-1">파손 현황</h2>
          <p className="text-gray-600">
            실시간 분석 결과를 바탕으로 파손 유형과 최근 탐지 내역을 보여줍니다.
          </p>
        </div>
      </div>

      {/* 파손 유형별 차트와 Top5 라벨 표시 영역 (그리드 레이아웃) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* 파손 라벨별 도넛 차트 박스 */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            파손 유형별
          </h3>
          {/* typeData 배열이 있으면 차트와 범례 표시, 없으면 안내 문구 */}
          {typeData.length > 0 ? (
            <>
              {/* 도넛 차트 컴포넌트 호출 */}
              <DoughnutChart data={typeData} />
              <div className="mt-4 space-y-2">
                {/* typeData 배열을 순회하며 각 항목의 색상, 라벨, 값 표시 */}
                {typeData.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between text-sm"
                  >
                    <div className="flex items-center gap-2">
                      {/* 색상 표시 원 */}
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: item.color }}
                      />
                      {/* 라벨 텍스트 */}
                      <span className="text-gray-700">{item.label}</span>
                    </div>
                    {/* 해당 라벨의 건수 */}
                    <span className="font-medium text-gray-900">
                      {item.value}건
                    </span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            // 데이터가 없을 때 안내 문구
            <div className="text-sm text-gray-500">
              표시할 파손 데이터가 없습니다.
            </div>
          )}
        </div>

        {/* 상위 파손 유형 Top 5 리스트 박스 */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            상위 파손 유형 Top 5
          </h3>
          {/* typeData가 있으면 리스트 렌더링, 없으면 안내 문구 */}
          {typeData.length > 0 ? (
            <ul className="space-y-5">
              {/* 상위 5개 항목을 순회하며 렌더링 */}
              {typeData.slice(0, 5).map((item, idx) => (
                <li
                  key={idx}
                  className="flex items-center justify-between text-sm"
                >
                  <div className="flex items-center gap-2">
                    {/* 색상 표시 원 */}
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                    {/* 라벨 텍스트 */}
                    <span className="text-gray-700">{item.label}</span>
                  </div>
                  {/* 건수 표시 */}
                  <span className="font-medium text-gray-900">
                    {item.value}건
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            // 데이터 없을 때 안내 문구
            <div className="text-sm text-gray-500">
              표시할 파손 데이터가 없습니다.
            </div>
          )}
        </div>
      </div>

      {/* 최근 탐지 결과 테이블 */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">최근 탐지</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            {/* 테이블 헤더: 각 컬럼의 제목을 정의 */}
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left text-sm font-medium text-gray-500 pb-2">
                  CCTV
                </th>
                <th className="text-left text-sm font-medium text-gray-500 pb-2">
                  날짜
                </th>
                <th className="text-left text-sm font-medium text-gray-500 pb-2">
                  유형
                </th>
                <th className="text-left text-sm font-medium text-gray-500 pb-2">
                  건수
                </th>
              </tr>
            </thead>
            {/* 테이블 본문: 탐지 결과 데이터를 행 단위로 동적 생성 */}
            <tbody className="divide-y divide-gray-100">
              {/* recentReports 배열을 순회하며 각 탐지 결과를 테이블 행으로 렌더링 */}
              {recentReports.slice(0, 5).map((r) => (
                <tr key={r.id} className="hover:bg-gray-50">
                  {/* CCTV 이름 */}
                  <td className="py-3 text-sm text-gray-900">{r.cctvName}</td>
                  {/* 탐지 날짜를 로컬 문자열로 표시 */}
                  <td className="py-3 text-sm text-gray-700">
                    {new Date(r.date).toLocaleString()}
                  </td>
                  {/* 탐지된 파손 유형들, 없으면 '-' 표시 */}
                  <td className="py-3 text-sm text-gray-700 truncate max-w-[320px]">
                    {r.detections && r.detections.length > 0
                      ? r.detections.join(", ")
                      : "-"}
                  </td>
                  {/* 탐지된 파손 유형 개수 */}
                  <td className="py-3 font-medium text-gray-900">
                    {r.detections?.length ?? 0}
                  </td>
                </tr>
              ))}
              {/* recentReports가 비어 있을 때 안내 문구를 한 행으로 표시 */}
              {recentReports.slice(0, 5).length === 0 && (
                <tr>
                  <td
                    colSpan={4}
                    className="py-6 text-center text-sm text-gray-500"
                  >
                    표시할 탐지 결과가 없습니다.
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

export default DamageReportDashboard;
