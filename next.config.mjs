/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'plus.unsplash.com' },
      { protocol: 'https', hostname: 'jqcudoqhwyerypxcrrek.supabase.co' },
      { protocol: 'https', hostname: 'arturbranchina.com.br' }
    ]
  },
  experimental: {
    cpus: 1,
  }
};
export default nextConfig;
