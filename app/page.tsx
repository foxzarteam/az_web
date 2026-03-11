import Hero from "./components/home/hero";
import Listing from "./components/home/property-list";
import Calculator from "./components/home/calculator";
import Features from "./components/shared/features";
import History from "./components/home/history";
import CompanyInfo from "./components/home/info";

export default function Home() {
  return (
    <main>
      <Hero />
      <Listing />
      <Calculator />
      <Features />
      <History />
      <CompanyInfo />
    </main>
  );
}
