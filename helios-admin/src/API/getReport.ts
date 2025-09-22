import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_CCTV_API_URL;

export interface APIResponse {
  success: boolean; // 요청 성공 여부
  code: number; // HTTP 상태 코드
  message: string; // 응답 메시지
  data: [];
}

export async function fetchReportTiming() {
  // 요청 시간 기록
  const startTime = performance.now();

  try {
    const response = await axios.get<APIResponse>(
      `${API_BASE_URL}report/get-all`
    );

    const endTime = performance.now();

    const duringTime = endTime - startTime;

    console.log(`신고 API 응답 시간 : ${duringTime} ms`);

    return duringTime;
  } catch (error) {
    const endTime = performance.now();
    const duringTime = endTime - startTime;

    console.error("신고 API 요청 실패:", error);
    return duringTime;
  }
}

export async function fetchReportData() {
  try {
    const response = await axios.get<APIResponse>(
      `${API_BASE_URL}report/get-all`
    );
    console.log("신고 API 응답:", response);
    return Array.isArray((response as any)?.data?.data)
      ? (response as any).data.data
      : [];
  } catch (error) {
    console.error("신고 API 요청 실패:", error);
    return [];
  }
}
