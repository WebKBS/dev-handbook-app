export const Domain = {
  html: "html",
  css: "css",
  javascript: "javascript",
  typescript: "typescript",
  react: "react",
  web: "web",
  glossary: "glossary",
} as const;

export type DomainType = (typeof Domain)[keyof typeof Domain];

type DomainHeroItem = {
  title: string;
  subtitle: string;
};

export const DomainHeroContent: Record<DomainType, DomainHeroItem> = {
  html: {
    title: "구조를 만드는 언어, HTML",
    subtitle:
      "웹의 뼈대를 만드는 태그부터 시맨틱 마크업까지, 입문자를 위한 핵심 가이드.",
  },
  css: {
    title: "디자인을 입히는 언어, CSS",
    subtitle:
      "색, 폰트, 레이아웃부터 반응형까지, 화면을 아름답게 만드는 스타일 가이드.",
  },
  javascript: {
    title: "동작을 책임지는 언어, JavaScript",
    subtitle:
      "이벤트, 비동기, DOM 조작까지, 웹을 살아 움직이게 하는 동작 원리.",
  },
  typescript: {
    title: "안정성을 더하는 언어, TypeScript",
    subtitle:
      "타입 시스템, 인터페이스, 제네릭까지, 자바스크립트에 날개를 다는 타입 가이드.",
  },
  react: {
    title: "UI를 구축하는 라이브러리, React",
    subtitle:
      "컴포넌트, 상태 관리, 훅까지, 현대적인 웹 애플리케이션 개발의 핵심.",
  },
  web: {
    title: "웹 개발의 기반 지식, Web",
    subtitle:
      "표준과 브라우저 동작, 성능·접근성·보안 같은 필수 기반을 빠짐없이 정리합니다.",
  },
  glossary: {
    title: "웹 개발 용어사전",
    subtitle:
      "웹 개발에서 자주 사용되는 용어들을 알기 쉽게 정리한 용어사전입니다.",
  },
};
