/** @type {import('next').NextConfig} */
const nextConfig = {
  allowedDevOrigins: ["192.168.1.*"],
  turbopack: {
    root: ".",
  },
};

export default nextConfig;
