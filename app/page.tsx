import Hero from "./components/home/hero";
import DiscoverProperties from "./components/home/property-option";
import Listing from "./components/home/property-list";
import Calculator from "./components/home/calculator";
import Features from "./components/shared/features";
import History from "./components/home/history";
import Testimonials from "./components/home/testimonial";
import CompanyInfo from "./components/home/info";

export default function Home() {
  return (
    <main>
      <Hero />
      <DiscoverProperties />
      <Listing />
      <Calculator />
      <Features />
      <History />
      <Testimonials />
      <CompanyInfo />
    </main>
  );
}
