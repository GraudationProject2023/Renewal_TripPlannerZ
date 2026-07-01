import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // @ui는 빌드 산출물이 아닌 TS 소스를 그대로 export 하므로 트랜스파일 대상에 포함한다.
  transpilePackages: ['@ui'],
}

export default nextConfig
