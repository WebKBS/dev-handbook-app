import { axiosInstance } from "@/libs/axios";
import { ItemType } from "@/services/content/root-manifest";

export interface SearchResponse {
  total: number;
  page: number;
  pageSize: number;
  items: ItemType[];
}

interface SearchParams {
  domain: string;
  q: string;
  tags?: string[];
  sort?: "order_asc" | "updatedAt_desc";
  page?: number;
  pageSize?: number;
}

export const getSearch = async ({
  domain,
  q,
  tags,
  sort = "updatedAt_desc",
  page = 1,
  pageSize = 20,
}: SearchParams): Promise<SearchResponse> => {
  const response = await axiosInstance.get(`/api/service/content/posts`, {
    params: {
      domain,
      q,
      tags,
      sort,
      page,
      pageSize,
    },
  });
  return response.data;
};
