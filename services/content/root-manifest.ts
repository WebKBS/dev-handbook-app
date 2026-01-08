import { DomainType } from "@/constants/domain";
import { axiosInstance } from "@/libs/axios";

export type SectionType = {
  id: string;
  name: string;
  order: number;
};

export type ItemType = {
  id: string;
  domain: DomainType;
  slug: string;
  title: string;
  description: string;
  sectionId: string;
  tags: string[];
  updatedAt: string;
  coverImage: string;
  order: number;
  level: number;
  derived: {
    readingMinutes: number;
    textChars: number;
    codeLines: number;
    imagesCount: number;
    metricVersion: number;
  };
};

export interface RootManifestResponse {
  version: number;
  generatedAt: string;
  sectionsByDomain: Record<DomainType, SectionType[]>;
  items: ItemType[];
}

export const getRootManifest = async (): Promise<RootManifestResponse> => {
  const response = await axiosInstance.get("/api/service/content/manifest");
  console.log("response:", response.data);
  return response.data;
};
