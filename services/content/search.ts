import { axiosInstance } from "@/libs/axios";

export type SearchItem = {
  id: string;
  title: string;
  slug: string;
  description: string;
  domain: string;
  tags: string[];
  coverImage: string;
};

export interface SearchResponse {
  total: number;
  page: number;
  pageSize: number;
  items: SearchItem[];
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
  const response = await axiosInstance.get(`/content/posts`, {
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
