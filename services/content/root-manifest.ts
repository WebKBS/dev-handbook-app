import { axiosInstance } from "@/libs/axios";

export const getRootManifest = async () => {
  return await axiosInstance.get("/api/service/content/manifest");
};
