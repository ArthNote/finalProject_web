import React from "react";
import HeroSection from "@/components/public/hero_section";
import AppImage from "@/components/public/app_image";

const page = () => {
  return (
    <section className="space-y-6 py-12 sm:py-20 lg:py-20 mx-auto">
      <HeroSection />
      <AppImage />
      {/* <AboutUs />
      <KeyFeatures />
      <WhyChooseUs />
      <Testimonials /> */}
    </section>
  );
};

export default page;
