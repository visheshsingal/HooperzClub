'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import AboutUs from "../components/AboutUs";
import Footer from "../components/Footer";

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
    <div className="flex flex-col min-h-screen bg-black text-white selection:bg-red-500 selection:text-white">
      <HomeRedirect />
      <Navbar />
      <main className="flex-grow">
        <Hero />
        <AboutUs />
      </main>
      <Footer />
    </div>
  );
}
