import { DomainType } from "@/constants/domain";
import { axiosInstance } from "@/libs/axios";

export interface RootManifestResponse {
  version: number;
  generatedAt: string;
  items: {
    id: string;
    domain: DomainType;
    slug: string;
    title: string;
    description: string;
    tags: string[];
    updatedAt: string;
    coverImage: string;
    order: number;
    level: number;
  }[];
}

export const getRootManifest = async (): Promise<RootManifestResponse> => {
  const response = await axiosInstance.get("/api/service/content/manifest");
  return response.data;
};
