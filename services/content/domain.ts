import { axiosInstance } from "@/libs/axios";

interface DomainResponse {
  items: {
    domain: string;
    count: number;
    latestUpdatedAt: string;
  }[];
}

export const getDomain = async (): Promise<DomainResponse> => {
  const response = await axiosInstance.get("/api/service/content/domains");
  return response.data;
};
