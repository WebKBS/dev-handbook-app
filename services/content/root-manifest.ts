import { axiosInstance } from "@/libs/axios";

interface RootManifestResponse {
  version: number;
  generatedAt: string;
  items: {
    id: string;
    domain: string;
    slug: string;
    title: string;
    description: string;
    tags: string[];
    updatedAt: string;
    coverImage: string;
    order: number;
  }[];
}

export const getRootManifest = async (): Promise<RootManifestResponse> => {
  const response = await axiosInstance.get("/api/service/content/manifest");
  return response.data;
};
