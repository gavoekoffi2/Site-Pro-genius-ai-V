import Preloader from "@/components/Preloader";
import Hero from "@/components/hero/Hero";
import About from "@/components/sections/About";
import Products from "@/components/sections/Products";
import Services from "@/components/sections/Services";
import Impact from "@/components/sections/Impact";
import Stats from "@/components/sections/Stats";
import Tech from "@/components/sections/Tech";
import Team from "@/components/sections/Team";
import FinalCTA from "@/components/sections/FinalCTA";

export default function Home() {
  return (
    <>
      <Preloader />
      <Hero />
      <About />
      <Products />
      <Services />
      <Impact />
      <Stats />
      <Tech />
      <Team />
      <FinalCTA />
    </>
  );
}
