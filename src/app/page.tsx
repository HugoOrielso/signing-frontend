"use client";

import StripeSlider from "@/components/home/slider";
import Hero from "@/components/home/Hero";
import HomeHeader from "@/components/home/HomeHeader";
import Services from "@/components/home/Services";
import Footer from "@/components/home/Footer";



export default function DimculturaServicesLanding() {
  return (
    <div >
      <HomeHeader />
      <Hero />
      <Services />
      <StripeSlider />
      <Footer />
    </div>
  );
}