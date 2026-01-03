import { DomainType } from "@/constants/domain";
import { axiosInstance } from "@/libs/axios";

export type ItemType = {
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
};

export interface RootManifestResponse {
  version: number;
  generatedAt: string;
  items: ItemType[];
}

export const getRootManifest = async (): Promise<RootManifestResponse> => {
  const response = await axiosInstance.get("/api/service/content/manifest");
  return response.data;
};
