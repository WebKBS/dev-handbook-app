import { z } from "zod";

const envSchema = z.object({
  API_URL: z.url(),
});

const parsed = envSchema.safeParse({
  API_URL: process.env.EXPO_PUBLIC_API_URL,
});

if (!parsed.success) {
  // 개발 중엔 원인 바로 보이게
  console.error("[env] Invalid env:", parsed.error.issues);
  // 앱 실행을 막는 게 맞음(필수값 누락이면 계속 오류 나니까)
  throw new Error("Invalid environment configuration");
}

export const env = parsed.data;
export type Env = typeof env;
