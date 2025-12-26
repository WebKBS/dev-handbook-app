import Constants from "expo-constants";
import { z } from "zod";

/**
 * Expo Constants에서 extra 꺼내오기
 * (런타임/빌드 방식에 따라 expoConfig/manifest 접근 경로가 달라질 수 있어 둘 다 대응)
 */
const rawExtra: unknown =
  Constants.expoConfig?.extra ?? (Constants as any).manifest?.extra ?? {};

/**
 * 문자열로 들어오는 값들을 안전하게 변환하기 위한 스키마
 * - API_URL: 필수, URL 형식
 * - API_TIMEOUT_MS: 선택, 숫자로 coercion, 기본값 15000
 */
const envSchema = z.object({
  API_URL: z.url(),
  API_TIMEOUT_MS: z.coerce.number().int().positive().default(15000),
});

const parsed = envSchema.safeParse(rawExtra);

if (!parsed.success) {
  // 개발 중엔 원인 바로 보이게
  console.error("[env] Invalid env:", parsed.error.issues);
  // 앱 실행을 막는 게 맞음(필수값 누락이면 계속 오류 나니까)
  throw new Error("Invalid environment configuration");
}

export const env = parsed.data;
export type Env = typeof env;
