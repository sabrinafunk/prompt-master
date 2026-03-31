/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'plus.unsplash.com' },
      { protocol: 'https', hostname: 'jqcudoqhwyerypxcrrek.supabase.co' },
      { protocol: 'https', hostname: 'arturbranchina.com.br' }
    ]
  }
};
export default nextConfig;
