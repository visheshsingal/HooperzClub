import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import AboutUs from "../components/AboutUs";
import Footer from "../components/Footer";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-zinc-950 text-white selection:bg-orange-500 selection:text-white">
      <Navbar />
      <main className="flex-grow">
        <Hero />
        <AboutUs />
      </main>
      <Footer />
    </div>
  );
}
