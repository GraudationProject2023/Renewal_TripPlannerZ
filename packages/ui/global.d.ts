/// <reference types="react" />

declare module "*.svg" {
  const content: React.FC<React.SVGProps<SVGSVGElement>>;
}

declare module "*.png" {
  const value: string;
}

declare module "*.jpg" {
  const value: string;
}

declare module "*.jpeg" {
  const value: string;
}

declare global {
  interface Window {
    naver: any;
    IMP?: any;
  }
}

declare global {
  namespace React {
    namespace JSX {
      interface IntrinsicElements {
        [elemName: string]: any;
      }
    }
  }
}

export {};
