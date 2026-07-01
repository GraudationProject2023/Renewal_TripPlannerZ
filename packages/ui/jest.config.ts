import type { Config } from "jest";

const config: Config = {
  rootDir: ".",
  preset: "ts-jest",
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  moduleNameMapper: {
    "^app/(.*)$": "<rootDir>/../../packages/app/$1",
    "\\.svg$": "<rootDir>/mocks/svgMock.tsx",
    "\\.(png|jpg|jpeg|gif|webp)$": "<rootDir>/mocks/fileMock.js",
    "\\.(css|scss)$": "identity-obj-proxy",
  },
  testPathIgnorePatterns: ["/node_modules/", "/.next/"],
  transform: {
    "^.+\\.(ts|tsx)$": ["babel-jest", { presets: ["next/babel"] }],
  },
};

export default config;
