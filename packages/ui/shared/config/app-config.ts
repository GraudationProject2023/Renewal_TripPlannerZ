interface IAppUrls {
  tripplannerz: {
    production: string
    development: string
  }
}

export const APP_URLS: IAppUrls = {
  tripplannerz: {
    production: process.env.NEXT_PUBLIC_SITE_URL || '',
    development: 'http://localhost:3000',
  },
}
