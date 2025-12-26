import "dotenv/config";
import type { ExpoConfig } from "expo/config";

export default ({ config }: { config: ExpoConfig }): ExpoConfig => ({
  ...config,
  extra: {
    API_URL: process.env.EXPO_PUBLIC_API_URL,
    API_TIMEOUT_MS: process.env.EXPO_PUBLIC_API_TIMEOUT_MS, // optional
  },
});
