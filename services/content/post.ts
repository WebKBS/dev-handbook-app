import { DomainType } from "@/constants/domain";
import { axiosInstance } from "@/libs/axios";

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
