import { getRootManifest } from "@/services/content/root-manifest";
import { useQuery } from "@tanstack/react-query";

export const useRootManifest = () => {
  return useQuery({
    queryKey: ["manifest"],
    queryFn: getRootManifest,
  });
};
