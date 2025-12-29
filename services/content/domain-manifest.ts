import { DomainType } from "@/constants/domain";
import { axiosInstance } from "@/libs/axios";
import { RootManifestResponse } from "@/services/content/root-manifest";

interface DomainManifestResponse extends RootManifestResponse {
  domain: DomainType;
}

interface DomainManifestItem {
  domain: DomainType;
}

export const getDomainManifest = async ({
  domain,
}: DomainManifestItem): Promise<DomainManifestResponse> => {
  const response = await axiosInstance.get(
    `/api/service/content/domains/${domain}/manifest`,
  );
  return response.data;
};
