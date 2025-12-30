// src/lib/axiosInstance.ts
import { env } from "@/config/env";
import { type Tokens, tokenStorage } from "@/libs/tokenStorage";
import { tokenPairSchema } from "@/schema/auth.schemas";
import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";

type RetryableConfig = InternalAxiosRequestConfig & {
  _retry?: boolean;
};

const REFRESH_PATH = "/auth/refresh"; // 너 서버 경로에 맞게 수정

export const axiosInstance = axios.create({
  baseURL: env.API_URL,
  timeout: 15_000,
});

// refresh 전용(인터셉터 영향 X)
const refreshClient = axios.create({
  baseURL: env.API_URL,
  timeout: 15_000,
});

// ===== 동시요청 락/큐 =====
let isRefreshing = false;
let refreshPromise: Promise<Tokens> | null = null;

type QueueItem = {
  resolve: (token: string) => void;
  reject: (err: unknown) => void;
};

let failedQueue: QueueItem[] = [];

function processQueue(error: unknown, token?: string) {
  failedQueue.forEach((p) => {
    if (error) p.reject(error);
    else if (token) p.resolve(token);
  });
  failedQueue = [];
}

// ===== 토큰 주입 =====
axiosInstance.interceptors.request.use(async (config) => {
  const tokens = await tokenStorage.getTokens();
  if (tokens?.accessToken) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${tokens.accessToken}`;
  }
  return config;
});

// ===== refresh 실행 함수 (Zod 검증 포함) =====
async function refreshTokensOrThrow(): Promise<Tokens> {
  const current = await tokenStorage.getTokens();
  if (!current?.refreshToken) {
    throw new Error("No refreshToken");
  }

  // 보통 refresh는 Authorization 없이 refreshToken만으로 처리
  const res = await refreshClient.post(REFRESH_PATH, {
    refreshToken: current.refreshToken,
  });

  // zod 검증
  const parsed = tokenPairSchema.safeParse(res.data);
  if (!parsed.success) {
    throw new Error("Invalid refresh response");
  }

  const nextTokens: Tokens = {
    accessToken: parsed.data.accessToken,
    refreshToken: parsed.data.refreshToken,
  };

  await tokenStorage.setTokens(nextTokens);
  return nextTokens;
}

// ===== 401 처리 + 재시도 =====
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalConfig = error.config as RetryableConfig | undefined;
    const status = error.response?.status;

    // 원본 config 없거나 401 아니면 그대로 throw
    if (!originalConfig || status !== 401) {
      return Promise.reject(error);
    }

    // refresh 요청 자체가 401이면 무한루프 방지: 바로 로그아웃 처리
    if (originalConfig.url?.includes(REFRESH_PATH)) {
      await tokenStorage.clearTokens();
      return Promise.reject(error);
    }

    // 이미 재시도 한 요청이면 더 이상 시도하지 않음
    if (originalConfig._retry) {
      await tokenStorage.clearTokens();
      return Promise.reject(error);
    }
    originalConfig._retry = true;

    // 이미 refresh 중이면 큐에 쌓아서 refresh 끝나면 재시도
    if (isRefreshing && refreshPromise) {
      try {
        const newAccessToken = await new Promise<string>((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        });

        originalConfig.headers = originalConfig.headers ?? {};
        originalConfig.headers.Authorization = `Bearer ${newAccessToken}`;
        return axiosInstance(originalConfig);
      } catch (e) {
        return Promise.reject(e);
      }
    }

    // refresh 시작
    isRefreshing = true;
    refreshPromise = refreshTokensOrThrow();

    try {
      const next = await refreshPromise;
      processQueue(null, next.accessToken);

      originalConfig.headers = originalConfig.headers ?? {};
      originalConfig.headers.Authorization = `Bearer ${next.accessToken}`;

      return axiosInstance(originalConfig);
    } catch (refreshErr) {
      processQueue(refreshErr);
      await tokenStorage.clearTokens();
      return Promise.reject(refreshErr);
    } finally {
      isRefreshing = false;
      refreshPromise = null;
    }
  },
);
