'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Hero from "../components/Hero";
import AboutUs from "../components/AboutUs";
import HowItWorks from "../components/HowItWorks";
import Testimonials from "../components/Testimonials";
import FaqSection from "../components/FaqSection";
import CallToAction from "../components/CallToAction";

function HomeRedirect() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('hooperz_token');
    if (token) {
      router.replace('/dashboard');
    }
  }, [router]);

  return null;
}

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-white text-black selection:bg-red-600 selection:text-white">
      <HomeRedirect />
      <main className="flex-grow">
        <Hero />
        <AboutUs />
        <HowItWorks />
        <Testimonials />
        <FaqSection />
        <CallToAction />
      </main>
    </div>
  );
}
