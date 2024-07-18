// next.config.mjs
const nextConfig = {
  // Your configuration options here
  // Example:
  webpack: (config, { isServer }) => {
    // Modify the webpack config here
    // Example: Add a rule for handling .gz files
    if (!isServer) {
      config.module.rules.push({
        test: /\.gz$/,
        use: "raw-loader",
      });
    }
    return config;
  },
};

export default nextConfig;
