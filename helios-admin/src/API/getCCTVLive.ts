import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_CCTV_API_URL;

export interface APIResponse {
  success: boolean; // 요청 성공 여부
  code: number; // HTTP 상태 코드
  message: string; // 응답 메시지
  data: [];
}

export async function fetchCCTVTiming() {
  // 요청 시간 기록
  const startTime = performance.now();

  try {
    await axios.get<APIResponse>(
      `${API_BASE_URL}cctv/view?minX=126.734086&minY=33.450701&maxX=129.394978&maxY=38.612242`
    );

    const endTime = performance.now();

    const duringTime = endTime - startTime;

    console.log(`cctv 응답 시간 : ${duringTime} ms`);

    return duringTime;
  } catch (error) {
    const endTime = performance.now();
    const duringTime = endTime - startTime;

    console.error("CCTV API 요청 실패:", error);
    return duringTime;
  }
}
