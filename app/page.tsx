import dynamic from "next/dynamic";
import Hero from "./components/home/hero";
import Listing from "./components/home/property-list";
import PartnersMarquee from "./components/home/partners-marquee";

const Calculator = dynamic(() => import("./components/home/calculator"));
const Features = dynamic(() => import("./components/shared/features"));
const History = dynamic(() => import("./components/home/history"));
const CompanyInfo = dynamic(() => import("./components/home/info"));

export default function Home() {
  return (
    <main>
      <Hero />
      <Listing />
      <Calculator />
      <Features />
      <PartnersMarquee />
      <History />
      <CompanyInfo />
    </main>
  );
}
