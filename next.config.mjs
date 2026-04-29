/** @type {import('next').NextConfig} */
const nextConfig = {
   reactStrictMode: true,
   // Tell Next.js NOT to bundle these packages so Vercel includes full directories
   // (PDFKit needs its /data/*.afm font files at runtime)
   serverExternalPackages: ['pdfkit', 'fontkit', 'linebreak', 'unicode-properties'],
   images: {
      remotePatterns: [
         {
            protocol: 'https',
            hostname: 'res.cloudinary.com'
         }
      ]
   }
};

export default nextConfig;
