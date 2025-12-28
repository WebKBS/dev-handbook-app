import { axiosInstance } from "@/libs/axios";
import { RootManifestResponse } from "@/services/content/root-manifest";

interface DomainManifestResponse extends RootManifestResponse {
  domain: string;
}

interface DomainManifestItem {
  domain: string;
}

export const getDomainManifest = async ({
  domain,
}: DomainManifestItem): Promise<DomainManifestResponse> => {
  const response = await axiosInstance.get(
    `/api/service/content/domains/${domain}/manifest`,
  );
  return response.data;
};
