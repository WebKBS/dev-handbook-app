import { DomainType } from "@/constants/domain";
import { axiosInstance } from "@/libs/axios";

export type Reference = {
  title: string;
  url: string;
  note?: string;
};

interface PostsResponse {
  meta: {
    id: string;
    domain: DomainType;
    slug: string;
    title: string;
    description?: string;
    tags?: string[];
    updatedAt?: string;
    coverImage?: string;
    order: number;
    level: number;
    references?: Reference[];
  };
  content: string;
}

interface PostParams {
  domain: DomainType;
  slug: string;
}

export const getPosts = async ({
  domain,
  slug,
}: PostParams): Promise<PostsResponse> => {
  const response = await axiosInstance.get(
    `/api/service/content/posts/${domain}/${slug}`,
  );
  return response.data;
};
