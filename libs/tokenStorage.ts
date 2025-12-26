import AsyncStorage from "@react-native-async-storage/async-storage";

export type Tokens = {
  accessToken: string;
  refreshToken: string;
};

const KEY = "auth_tokens_v1";

export const tokenStorage = {
  async getTokens(): Promise<Tokens | null> {
    const raw = await AsyncStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Tokens) : null;
  },

  async setTokens(tokens: Tokens) {
    await AsyncStorage.setItem(KEY, JSON.stringify(tokens));
  },

  async clearTokens() {
    await AsyncStorage.removeItem(KEY);
  },
};
