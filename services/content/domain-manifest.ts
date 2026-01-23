import { DomainType } from "@/constants/domain";
import { axiosInstance } from "@/libs/axios";
import { ItemType, SectionType } from "@/services/content/root-manifest";

interface DomainManifestResponse {
  version: number;
  generatedAt: string;
  domain: DomainType;
  sections: SectionType[];
  items: ItemType[];
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
