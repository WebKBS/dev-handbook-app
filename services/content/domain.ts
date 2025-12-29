import { DomainType } from "@/constants/domain";
import { axiosInstance } from "@/libs/axios";

export interface DomainResponseData {
  items: {
    domain: DomainType;
    count: number;
    latestUpdatedAt: string;
    image: string;
  }[];
}

export const getDomain = async (): Promise<DomainResponseData> => {
  const response = await axiosInstance.get("/api/service/content/domains");
  return response.data;
};
