import React from "react";
import HeroSection from "@/components/public/hero_section";
import AppImage from "@/components/public/app_image";
import AboutUs from "@/components/public/about_us";
import FeatureSection from "@/components/public/features_section";
import WhyChooseUs from "@/components/public/why_us";
import MobileAppSection from "@/components/public/mobile_app_section";
import ReviewsSection from "@/components/public/reviews_section";

const page = () => {
  return (
    <section className="space-y-6 py-12 sm:py-20 lg:py-20 mx-auto">
      <HeroSection />
      <AppImage />
      <AboutUs />
      <FeatureSection />
      {/* <PricingSection /> */}
      <WhyChooseUs />
      <ReviewsSection />
      {/* <MobileAppSection /> */}
      {/* <ContactSection /> */}
    </section>
  );
};

export default page;
