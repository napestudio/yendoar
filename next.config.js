/** @type {import('next').NextConfig} */

const nextConfig = {
  env: {
    // fe_api_url: process.env.apiUrl,
    apiKey: "33F85ADC279C7872D63B1B42A1B31",
    MP_ACCESS_TOKEN: process.env.MP_ACCESS_TOKEN,
    GOOGLE_ID:
      "426944037353-doj012lil9vjrbb60o8gghbrs0khh1sp.apps.googleusercontent.com",
    GOOGLE_SECRET: "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",
    GOOGLE_MAPS_API_KEY: "AIzaSyBSkIXKMTCC1e6cOo_3t7O4BMxcxbhJdyk",
  },
  images: {
    dangerouslyAllowSVG: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "placehold.co",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "utfs.io",
        pathname: "**",
      },
    ],
  },
};

module.exports = nextConfig;
