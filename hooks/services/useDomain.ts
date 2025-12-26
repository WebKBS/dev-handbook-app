import { getDomain } from "@/services/content/domain";
import { useQuery } from "@tanstack/react-query";

export const useDomain = () => {
  return useQuery({
    queryKey: ["domain"],
    queryFn: getDomain,
  });
};
