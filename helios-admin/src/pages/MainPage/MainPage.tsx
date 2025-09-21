import React from "react";
import SystemInfoSidebar from "../../components/Main/SystemInfo/SystemInfoSidebar";
import ApiStatusMonitor from "../../components/Main/ApiStatus/ApiStatusMonitor";
import DamageReportDashboard from "../../components/Main/DamageReport/DamageReportDashboard";
import ReportListManager from "../../components/Main/ReportList/ReportListManager";
import RoadMonitor from "../../components/Main/RoadHighlights/RoadMonitor";

export default function MainPage() {
  return (
    <div className="flex h-screen bg-gray-100">
      {/* 사이드바 */}
      <div className="w-80 flex-shrink-0">
        <SystemInfoSidebar />
      </div>

      {/* 메인 컨텐츠 */}
      <div className="flex-1 overflow-hidden">
        <div className="h-full overflow-y-auto">
          <div className="p-6 space-y-8">
            {/* API 상태 모니터링 */}
            <section>
              <ApiStatusMonitor />
            </section>

            {/* 파손 데이터 대시보드 */}
            <section>
              <DamageReportDashboard />
            </section>

            {/* 신고 접수 관리 */}
            <section>
              <ReportListManager />
            </section>

            {/* CCTV 현황 모니터링 */}
            <section>
              <RoadMonitor />
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
