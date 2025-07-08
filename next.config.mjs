/** @type {import('next').NextConfig} */
const nextConfig = {
  // Konfigurasi image Supabase
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'xdbjelcymduefpqcsfqb.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },

  // Redirect halaman root ke /user
  async redirects() {
    return [
      {
        source: '/',
        destination: '/user',
        permanent: true,
      },
    ];
  },

  // ✅ Tambahkan batas maksimal ukuran body upload untuk API route
  api: {
    bodyParser: {
      sizeLimit: '10mb', // Atur sesuai kebutuhan, misalnya '20mb' kalau banyak gambar
    },
  },
};

export default nextConfig;
