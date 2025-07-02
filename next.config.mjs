/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'xdbjelcymduefpqcsfqb.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },

  async redirects() {
    return [
      {
        source: '/',
        destination: '/user',
        permanent: true, // ubah ke false kalau ingin sementara
      },
    ];
  },
};

export default nextConfig;
