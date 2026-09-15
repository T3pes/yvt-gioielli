import type { NextConfig } from "next";

const supabaseHost = (process.env.NEXT_PUBLIC_SUPABASE_URL || "https://dxuefrkgncrqxipvglqa.supabase.co")
  .replace(/^https?:\/\//, "")
  .replace(/\/$/, "");

const nextConfig: NextConfig = {
  images: {
    remotePatterns: supabaseHost
      ? [{ protocol: "https", hostname: supabaseHost, pathname: "/storage/v1/object/public/**" }]
      : [{ protocol: "https", hostname: "**.supabase.co", pathname: "/storage/v1/object/public/**" }],
    formats: ["image/avif", "image/webp"],
    // i segnaposto grafici dell'atelier sono SVG nostri; il bucket accetta solo raster
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  async redirects() {
    return [
      { source: "/", destination: "/it", permanent: false },
      { source: "/catalogo", destination: "/it/catalogo", permanent: false },
      { source: "/collezioni", destination: "/it/collezioni", permanent: false },
      { source: "/contatti", destination: "/it/contatti", permanent: false },
    ];
  },
};

export default nextConfig;
