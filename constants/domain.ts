export const Domain = {
  html: "html",
  css: "css",
  javascript: "javascript",
  typescript: "typescript",
  react: "react",
} as const;

export type DomainType = (typeof Domain)[keyof typeof Domain];
