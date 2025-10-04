// API 상태 관련 타입
export interface ApiStatus {
  id: string;
  name: string;
  status: "active" | "warning" | "error" | "maintenance";
  responseTime: number;
  uptime: number;
  lastChecked: Date;
}

// 파손 보고서 관련 타입
export interface DamageReport {
  id: string;
  cctvName: string;
  cctvUrl: string;
  analyzeId: number;
  date: string;
  detections: string[];
}

// 신고 접수 관련 타입
export interface Report {
  id: string;
  type: "damage" | "accident" | "maintenance" | "emergency";
  priority: "low" | "medium" | "high" | "urgent";
  location: string;
  reporter: string;
  contactInfo: string;
  description: string;
  status: "pending" | "assigned" | "in_progress" | "resolved" | "closed";
}

// 도로 하이라이트 관련 타입
export interface RoadHighlight {
  id: string;
  roadName: string;
  section: string;
  alertLevel: "info" | "warning" | "danger" | "critical";
  issueType:
    | "traffic"
    | "construction"
    | "weather"
    | "accident"
    | "maintenance";
  description: string;
  activeIssues: number;
  trafficFlow: "normal" | "heavy" | "congested" | "blocked";
  lastUpdate: Date;
}

// 시스템 정보 관련 타입
export interface SystemInfo {
  totalCameras: number;
  activeCameras: number;
  offlineCameras: number;
  totalReports: number;
  pendingReports: number;
  resolvedToday: number;
  systemUptime: number;
  serverLoad: number;
}

// 관리자 정보 타입
export interface AdminInfo {
  id: string;
  name: string;
  email: string;
  role: "admin" | "supervisor" | "operator";
  department: string;
  lastLogin: Date;
  permissions: string[];
}

// 차트 데이터 타입
export interface ChartData {
  label: string;
  value: number;
  color?: string;
}

// 통계 카드 타입
export interface StatCard {
  title: string;
  value: string | number;
  change?: number;
  trend?: "up" | "down" | "stable";
  icon?: string;
  color?: "blue" | "green" | "yellow" | "red" | "purple";
}

// CCTV 관련 타입
export interface CCTVCamera {
  id: string;
  name: string;
  location: string;
  roadName: string;
  section: string;
  status: "online" | "offline" | "maintenance" | "error";
  lastOnline: Date;
  resolution: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  hasDamage?: boolean;
  damageReports?: DamageReport[];
}

// CCTV 현황 통계 타입
export interface CCTVStats {
  total: number;
  online: number;
  offline: number;
  maintenance: number;
  error: number;
  roadsWithDamage: number;
  totalDamageReports: number;
  criticalDamage: number;
  lastUpdated: Date;
}

// 도로별 CCTV 현황 타입
export interface RoadCCTVStatus {
  roadName: string;
  totalCameras: number;
  onlineCameras: number;
  offlineCameras: number;
  damageCount: number;
  criticalDamageCount: number;
  lastIncident?: Date;
  status: "normal" | "warning" | "critical";
}

export interface RoadDamage {
  damageName: string;
  countDamage: number;
}
