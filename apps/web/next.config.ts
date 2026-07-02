import type { NextConfig } from 'next'

// 브라우저 axios는 상대경로 /api/v1 로 호출한다. 이를 백엔드로 프록시한다.
const backendOrigin = process.env.BACKEND_ORIGIN ?? 'http://localhost:8080'

const nextConfig: NextConfig = {
  // @ui는 빌드 산출물이 아닌 TS 소스를 그대로 export 하므로 트랜스파일 대상에 포함한다.
  transpilePackages: ['@ui'],
  async rewrites() {
    return [
      {
        source: '/api/v1/:path*',
        destination: `${backendOrigin}/api/v1/:path*`,
      },
    ]
  },
}

export default nextConfig
