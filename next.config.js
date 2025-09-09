/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['ymsmmcfbnonyrzegfvxe.supabase.co'],
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
}

export default nextConfig
