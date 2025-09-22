import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_CCTV_API_URL;

export interface APIResponse {
  success: boolean; // 요청 성공 여부
  code: number; // HTTP 상태 코드
  message: string; // 응답 메시지
  data: [];
}

export async function fetchAnalyzeTiming() {
  // 요청 시간 기록
  const startTime = performance.now();

  try {
    const response = await axios.get<APIResponse>(
      `${API_BASE_URL}analyze/get-analyze`
    );

    const endTime = performance.now();

    const duringTime = endTime - startTime;

    console.log(`분석 응답 시간 : ${duringTime} ms`);

    return duringTime;
  } catch (error) {
    const endTime = performance.now();
    const duringTime = endTime - startTime;

    console.error("분석 API 요청 실패:", error);
    return duringTime;
  }
}

export async function fetchAnalyzeData() {
  try {
    const response = await axios.get<APIResponse>(
      `${API_BASE_URL}analyze/get-analyze`
    );

    console.log("분석 데이터:", response.data.data);
    return response.data.data;
  } catch (error) {
    console.error("분석 API 요청 실패:", error);
    return [];
  }
}
