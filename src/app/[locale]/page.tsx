import Hero from "@/components/Hero";
import Accommodations from "@/components/Accommodations";
import Packages from "@/components/Packages";
import Yoga from "@/components/Yoga";

export default function Home() {
  return (
    <main className="w-full flex flex-col">
      <Hero />
      <Accommodations />
      <Packages />
      <Yoga />
    </main>
  );
}
