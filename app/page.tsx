import dynamic from "next/dynamic";
import Hero from "./components/home/hero";
import Listing from "./components/home/property-list";
import PartnersMarquee from "./components/home/partners-marquee";
import FaqSection from "./components/home/faq";

const Calculator = dynamic(() => import("./components/home/calculator"));

export default function Home() {
  return (
    <main>
      <Hero />
      <Calculator />
      <Listing />
      <FaqSection />
      <PartnersMarquee />
    </main>
  );
}
