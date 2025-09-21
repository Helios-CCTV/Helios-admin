

import type {
  ApiStatus,
  DamageReport,
  Report,
  RoadHighlight,
  SystemInfo,
  CCTVCamera,
  CCTVStats,
  RoadCCTVStatus,
  RoadDamage,
} from "../types";

// Mock API Status Data
export const mockApiStatuses: ApiStatus[] = [
  {
    id: "api-1",
    name: "CCTV 조회 API",
    status: "active",
    responseTime: 120,
    uptime: 99.9,
    lastChecked: new Date(),
  },
  {
    id: "api-2",
    name: "분석 결과 API",
    status: "active",
    responseTime: 85,
    uptime: 99.8,
    lastChecked: new Date(),
  },
  {
    id: "api-3",
    name: "파손 결과 API",
    status: "warning",
    responseTime: 350,
    uptime: 98.5,
    lastChecked: new Date(),
  },
  {
    id: "api-4",
    name: "신고 API",
    status: "active",
    responseTime: 95,
    uptime: 99.7,
    lastChecked: new Date(),
  },
];

// Mock Damage Reports
export const mockDamageReports: DamageReport[] = [
  {
    id: "damage-1",
    location: "영동고속도로 강릉 방향 38km",
    type: "pothole",
    severity: "high",
    status: "in_progress",
    reportedAt: new Date("2024-12-19T09:30:00"),
    estimatedRepairTime: 4,
    assignedTo: "김현수",
    description: "차로 중앙 부근 대형 포트홀 발견, 즉시 수리 필요",
  },
  {
    id: "damage-2",
    location: "경부고속도로 서울 방향 15km",
    type: "sign_damage",
    severity: "medium",
    status: "reported",
    reportedAt: new Date("2024-12-19T14:15:00"),
    estimatedRepairTime: 2,
    description: "도로 표지판 일부 손상",
  },
  {
    id: "damage-3",
    location: "서해안고속도로 목포 방향 82km",
    type: "lighting",
    severity: "critical",
    status: "completed",
    reportedAt: new Date("2024-12-18T22:00:00"),
    estimatedRepairTime: 6,
    assignedTo: "박지영",
    description: "터널 조명 시설 고장으로 시야 확보 어려움",
  },
];

// Mock Reports
export const mockReports: Report[] = [
  {
    id: "report-1",
    type: "damage",
    priority: "high",
    location: "영동고속도로 38km",
    reporter: "이민수",
    contactInfo: "010-1234-5678",
    description: "도로에 큰 구멍이 있어서 차량 통행에 위험합니다.",
    status: "in_progress",
    createdAt: new Date("2024-12-19T09:25:00"),
    updatedAt: new Date("2024-12-19T10:30:00"),
    assignedTo: "김현수",
  },
  {
    id: "report-2",
    type: "accident",
    priority: "urgent",
    location: "경부고속도로 25km",
    reporter: "박영희",
    contactInfo: "010-9876-5432",
    description: "2중 추돌사고 발생, 구급차 및 견인차 필요",
    status: "assigned",
    createdAt: new Date("2024-12-19T15:45:00"),
    updatedAt: new Date("2024-12-19T15:50:00"),
    assignedTo: "응급팀",
  },
  {
    id: "report-3",
    type: "maintenance",
    priority: "medium",
    location: "서해안고속도로 55km",
    reporter: "최수진",
    contactInfo: "010-5555-7777",
    description: "가로등이 깜빡거려서 야간 운전시 불편합니다.",
    status: "pending",
    createdAt: new Date("2024-12-19T18:20:00"),
    updatedAt: new Date("2024-12-19T18:20:00"),
  },
];

// Mock Road Highlights
export const mockRoadHighlights: RoadHighlight[] = [
  {
    id: "road-1",
    roadName: "영동고속도로",
    section: "강릉방향 35-42km",
    alertLevel: "warning",
    issueType: "maintenance",
    description: "도로 보수 공사로 인한 차로 제한",
    activeIssues: 3,
    trafficFlow: "heavy",
    lastUpdate: new Date(),
  },
  {
    id: "road-2",
    roadName: "경부고속도로",
    section: "부산방향 120-135km",
    alertLevel: "critical",
    issueType: "accident",
    description: "다중 추돌사고로 인한 전면 통제",
    activeIssues: 1,
    trafficFlow: "blocked",
    lastUpdate: new Date(),
  },
  {
    id: "road-3",
    roadName: "서해안고속도로",
    section: "목포방향 80-90km",
    alertLevel: "info",
    issueType: "weather",
    description: "안개로 인한 시야 제한, 서행 권고",
    activeIssues: 2,
    trafficFlow: "normal",
    lastUpdate: new Date(),
  },
];

// Mock System Info
export const mockSystemInfo: SystemInfo = {
  totalCameras: 1247,
  activeCameras: 1198,
  offlineCameras: 49,
  totalReports: 2847,
  pendingReports: 23,
  resolvedToday: 15,
  systemUptime: 99.2,
  serverLoad: 67.3,
};

// Mock CCTV Cameras Data
export const mockCCTVCameras: CCTVCamera[] = [
  {
    id: "cctv-001",
    name: "영동고속도로 38km 지점",
    location: "강릉방향 38km",
    roadName: "영동고속도로",
    section: "38km",
    status: "online",
    lastOnline: new Date(),
    resolution: "4K",
    coordinates: { lat: 37.5665, lng: 126.978 },
    hasDamage: true,
    damageReports: [mockDamageReports[0]],
  },
  {
    id: "cctv-002",
    name: "경부고속도로 15km 지점",
    location: "서울방향 15km",
    roadName: "경부고속도로",
    section: "15km",
    status: "online",
    lastOnline: new Date(),
    resolution: "1080p",
    coordinates: { lat: 37.4563, lng: 127.0348 },
    hasDamage: true,
    damageReports: [mockDamageReports[1]],
  },
  {
    id: "cctv-003",
    name: "서해안고속도로 82km 지점",
    location: "목포방향 82km",
    roadName: "서해안고속도로",
    section: "82km",
    status: "offline",
    lastOnline: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2시간 전
    resolution: "1080p",
    coordinates: { lat: 36.3504, lng: 127.3845 },
    hasDamage: false,
  },
  {
    id: "cctv-004",
    name: "중부고속도로 25km 지점",
    location: "대전방향 25km",
    roadName: "중부고속도로",
    section: "25km",
    status: "maintenance",
    lastOnline: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6시간 전
    resolution: "4K",
    coordinates: { lat: 37.2636, lng: 127.0286 },
    hasDamage: false,
  },
  {
    id: "cctv-005",
    name: "남해고속도로 120km 지점",
    location: "부산방향 120km",
    roadName: "남해고속도로",
    section: "120km",
    status: "error",
    lastOnline: new Date(Date.now() - 12 * 60 * 60 * 1000), // 12시간 전
    resolution: "1080p",
    coordinates: { lat: 35.1796, lng: 129.0756 },
    hasDamage: true,
  },
  {
    id: "cctv-006",
    name: "호남고속도로 45km 지점",
    location: "광주방향 45km",
    roadName: "호남고속도로",
    section: "45km",
    status: "online",
    lastOnline: new Date(),
    resolution: "4K",
    coordinates: { lat: 36.3219, lng: 127.4201 },
    hasDamage: false,
  },
];

// Mock CCTV Stats
export const mockCCTVStats: CCTVStats = {
  total: 1247,
  online: 1156,
  offline: 62,
  maintenance: 21,
  error: 8,
  roadsWithDamage: 15,
  totalDamageReports: 34,
  criticalDamage: 7,
  lastUpdated: new Date(),
};

// Mock Road CCTV Status
export const mockRoadCCTVStatus: RoadCCTVStatus[] = [
  {
    roadName: "영동고속도로",
    totalCameras: 187,
    onlineCameras: 175,
    offlineCameras: 12,
    damageCount: 8,
    criticalDamageCount: 2,
    lastIncident: new Date(Date.now() - 2 * 60 * 60 * 1000),
    status: "warning",
  },
  {
    roadName: "경부고속도로",
    totalCameras: 342,
    onlineCameras: 328,
    offlineCameras: 14,
    damageCount: 12,
    criticalDamageCount: 3,
    lastIncident: new Date(Date.now() - 4 * 60 * 60 * 1000),
    status: "critical",
  },
  {
    roadName: "서해안고속도로",
    totalCameras: 156,
    onlineCameras: 148,
    offlineCameras: 8,
    damageCount: 3,
    criticalDamageCount: 0,
    lastIncident: new Date(Date.now() - 24 * 60 * 60 * 1000),
    status: "normal",
  },
  {
    roadName: "중부고속도로",
    totalCameras: 98,
    onlineCameras: 91,
    offlineCameras: 7,
    damageCount: 5,
    criticalDamageCount: 1,
    lastIncident: new Date(Date.now() - 6 * 60 * 60 * 1000),
    status: "warning",
  },
  {
    roadName: "남해고속도로",
    totalCameras: 214,
    onlineCameras: 198,
    offlineCameras: 16,
    damageCount: 4,
    criticalDamageCount: 0,
    lastIncident: new Date(Date.now() - 18 * 60 * 60 * 1000),
    status: "normal",
  },
  {
    roadName: "호남고속도로",
    totalCameras: 134,
    onlineCameras: 126,
    offlineCameras: 8,
    damageCount: 2,
    criticalDamageCount: 1,
    lastIncident: new Date(Date.now() - 8 * 60 * 60 * 1000),
    status: "normal",
  },
];

export const mockRoadDamages: RoadDamage[] = [
  {
    damageName: "반사균열",
    countDamage: 5,
  },
  {
    damageName: "세로방향균열",
    countDamage: 3,
  },
  {
    damageName: "밀림균열",
    countDamage: 2,
  },
  {
    damageName: "러팅",
    countDamage: 4,
  },
  {
    damageName: "코루게이션및쇼빙",
    countDamage: 6,
  },
  {
    damageName: "함몰",
    countDamage: 1,
  },
  {
    damageName: "포트홀",
    countDamage: 3,
  },
  {
    damageName: "라벨링",
    countDamage: 2,
  },
  {
    damageName: "박리",
    countDamage: 0,
  },
  {
    damageName: "단부균열",
    countDamage: 0,
  },
  {
    damageName: "시공균열",
    countDamage: 0,
  },
  {
    damageName: "거북등",
    countDamage: 0,
  },
];
