import { axiosInstance } from "@/libs/axios";
import { ItemType } from "@/services/content/root-manifest";

interface SearchResponse {
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
}

export const getSearch = async ({
  domain,
  q,
  tags,
  sort = "updatedAt_desc",
}: SearchParams) => {
  const response = await axiosInstance.get(`/api/service/content/posts`, {
    params: {
      domain,
      q,
      tags,
      sort,
      page: 1,
      pageSize: 20,
    },
  });
  return response.data;
};
