import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  devIndicators: {
    appIsrStatus: false,
  },
};

export default withNextIntl(nextConfig);
