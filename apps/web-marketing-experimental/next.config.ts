import type { NextConfig } from "next"

const nextConfig: NextConfig = {
    cacheComponents: true,
    partialPrefetching: true,

    turbopack: {
        rules: {
            "*.css": {
                as: "*.css",
                loaders: ["@tailwindcss/turbopack"]
            }
        }
    },

    /**
     * @todo Add origin for tunnel when configured.
     */
    allowedDevOrigins: []
}

export default nextConfig
