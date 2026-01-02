import { DomainType } from "@/constants/domain";

export const replaceDomainText = (domain: DomainType | string) => {
  switch (domain) {
    case "html":
    case "css":
    case "react":
    case "web":
      return domain.toUpperCase();
    case "javascript":
      return "JavaScript";
    case "typescript":
      return "TypeScript";
    default:
      return domain.charAt(0).toUpperCase() + domain.slice(1);
  }
};
